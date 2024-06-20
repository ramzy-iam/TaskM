import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@task-manager/core/db';
import { UsersService } from '@task-manager/users/api';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { EmailHelper, DayjsHelper } from '@task-manager/core/helpers';
import {
  JWT_EXPIRY_DATE,
  ACCOUNT_VERIFICATION_EXPIRY_TIME,
  RESET_PASSWORD_EXPIRY_TIME,
} from '@task-manager/core/constants';
import {
  BaseUserDto,
  CreateUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SendVerificationLinkDto,
  VerifyAccountDto,
} from '@task-manager/core/dto';
import { StateUser } from '@task-manager/users/types';
import { ManipulateType } from 'dayjs';

@Injectable()
export class AuthService {
  private emailHelper: EmailHelper;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
    this.emailHelper = EmailHelper.getInstance();
  }

  async register(userDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.findOne({ email: userDto.email });
    if (user) throw new ConflictException('Email already in use, please login');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userDto.password, salt);

    const response = await this.usersService.create({
      ...userDto,
      password: hashedPassword,
    });

    this.sendVerificationLink({ email: userDto.email });

    return response;
  }

  async validateUser(
    email: string,
    password: string
  ): Promise<User | null | undefined> {
    const user = await this.usersService.findOne({ email });

    if (user) {
      const passwordCorrect = await bcrypt.compare(password, user.password);
      if (passwordCorrect) return user;
      return undefined;
    }

    return null;
  }

  async login(userDto: BaseUserDto) {
    const user = await this.validateUser(userDto.email, userDto.password);
    if (user === null) throw new NotFoundException(`User not found`);
    if (user === undefined) throw new BadRequestException(`Incorrect password`);
    if (!(user.state === StateUser.CONFIRMED))
      throw new UnauthorizedException(`You account is not verified`);

    const payload = { username: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: JWT_EXPIRY_DATE,
    });

    return {
      access_token,
    };
  }

  async verifyPayload(payload: {
    username: string;
    sub: number;
  }): Promise<Partial<User>> {
    const { sub: id, username } = payload;
    const user = await this.usersService.findOne({ id, email: username });
    if (!user) throw new UnauthorizedException(`Invalid token`);
    return user;
  }

  async sendVerificationLink({ email }: SendVerificationLinkDto) {
    const user = await this.usersService.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    if (user.state === StateUser.CONFIRMED)
      throw new BadRequestException({
        message: 'This account is already is verified',
        code: 'AccountAlreadyVerifiedLinkException',
        name: 'AccountAlreadyVerifiedLinkException',
      });

    const { hashedToken: token, tokenExpiresAt: tokenExpires } =
      await this.createToken(ACCOUNT_VERIFICATION_EXPIRY_TIME);

    const verificationLink = `${process.env['NX_AUTH_PUBLIC_URL']}/auth/verify-account?token=${token}`;

    await this.usersService.update(user.id, { token, tokenExpires });

    const response = await this.emailHelper.sendEmail({
      to: user?.email as string,
      subject: 'TaskM: Account verification',
      html: `Activate your account with this link: ${verificationLink}. This is valid for ${ACCOUNT_VERIFICATION_EXPIRY_TIME} min`,
    });
    if (!response.accepted.length)
      throw new InternalServerErrorException(
        'Failed to send the verification link by mail'
      );

    return { message: 'Verification link sent successfully' };
  }

  async verifyAccount({ token }: VerifyAccountDto) {
    const user = await this.usersService.findOne({
      token,
    });

    if (!user)
      throw new BadRequestException({
        message: 'Verification link is invalid',
        code: 'InvalidVerificationLinkException',
        name: 'InvalidVerificationLinkException',
      });

    const hasExpired = DayjsHelper.new(user.tokenExpires)
      .utc()
      .isBefore(DayjsHelper.new());

    if (hasExpired)
      throw new BadRequestException({
        message: 'Verification link has expired',
        code: 'ExpiryVerificationLinkException',
        name: 'ExpiryVerificationLinkException',
      });

    await this.usersService.update(user.id, {
      state: StateUser.CONFIRMED,
      token: undefined,
      tokenExpires: undefined,
    });

    return {
      message: 'Account verified successfully',
    };
  }

  private async createToken(expiryTime: number, unit: ManipulateType = 'm') {
    const token = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const tokenExpiresAt = DayjsHelper.new().add(expiryTime, 'm').toDate(); //10 min

    return { hashedToken, tokenExpiresAt };
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.usersService.findOne({ email });

    if (!user)
      throw new BadRequestException(
        'There is no user with given email address'
      );

    const {
      hashedToken: passwordResetToken,
      tokenExpiresAt: passwordResetExpires,
    } = await this.createToken(RESET_PASSWORD_EXPIRY_TIME);

    await this.usersService.update(user.id, {
      passwordResetToken,
      passwordResetExpires,
    });
    const resetURL = `${process.env['NX_AUTH_PUBLIC_URL']}/auth/new-password?token=${passwordResetToken}`;

    // send mail
    await this.emailHelper.sendEmail({
      to: user?.email as string,
      subject: 'TaskM: Reset password',
      html: `Click to this link to reset your password, it's valid for ${RESET_PASSWORD_EXPIRY_TIME} min: ${resetURL}`,
    });

    return {
      message: 'Reset password link sent to you email address',
    };
  }

  async resetPassword({
    token: resetToken,
    newPassword,
    email,
  }: ResetPasswordDto) {
    const user = await this.usersService.findOne({ email });

    if (!user)
      throw new BadRequestException(
        'There is no user with given email address'
      );

    if (resetToken !== user.passwordResetToken)
      throw new BadRequestException('Invalid password reset link');

    const hasExpired = DayjsHelper.new(user.passwordResetExpires)
      .utc()
      .isBefore(DayjsHelper.new());

    if (hasExpired)
      throw new BadRequestException('This password reset link as expired');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    this.usersService.update(user.id, {
      password: hashedPassword,
      passwordResetExpires: undefined,
      passwordResetToken: undefined,
    });

    await this.emailHelper.sendEmail({
      to: user?.email as string,
      subject: 'TaskM: Password reset successfully ',
      html: `Your password has been reset successfully`,
    });

    const token = await this.login({ ...user, password: newPassword });

    return {
      message: 'Password reset successfully',
      token,
    };
  }

  async updateActiveWorkspace(
    userId: number,
    workspaceId: number
  ): Promise<void> {
    return this.usersService.updateActiveWorkspace(userId, workspaceId);
  }

  async getMyInfo(userId: number) {
    return this.usersService.getUserInfo(userId);
  }
}
