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
import { EmailHelper, DayjsHelper } from '@task-manager/core/helpers';
import otpGenerator from 'otp-generator';
import {
  JWT_EXPIRY_DATE,
  OTP_EXPIRY_TIME,
  OTP_LENGTH,
  RESET_PASSWORD_EXPIRY_TIME,
} from '@task-manager/core/constants';
import crypto from 'crypto';
import {
  BaseUserDto,
  CreateUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SendOtpDto,
  VerifyOtpDto,
} from '@task-manager/core/dto';
import { StateUser } from '@task-manager/users/types';

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

    this.sendOTP({ email: userDto.email });

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

  async sendOTP({ email }: SendOtpDto) {
    const user = await this.usersService.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    if (user.state === StateUser.CONFIRMED) return;

    const newOtp = otpGenerator.generate(OTP_LENGTH, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const otpExpiryTime = DayjsHelper.new().add(OTP_EXPIRY_TIME, 'm').toDate(); //10 min after otp is sent

    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(newOtp, salt);

    await this.usersService.update(user.id, { otp: hashedOtp, otpExpiryTime });

    const response = await this.emailHelper.sendEmail({
      to: user?.email as string,
      subject: 'OTP for TaskM',
      html: `Activate your account with this OTP: ${newOtp}. This is valid for ${OTP_EXPIRY_TIME} min`,
    });
    if (!response.accepted.length)
      throw new InternalServerErrorException(
        'Failed to send to OTP code by mail'
      );

    return { message: 'OTP sent successfully' };
  }

  async verifyOTP({ email, otp: _otp }: VerifyOtpDto) {
    const user = await this.usersService.findOne({
      email: email,
    });

    if (!user) throw new NotFoundException('User not found');
    if (!user.otp) throw new NotFoundException('There no is OTP generated');

    const hasExpired = DayjsHelper.new(user.otpExpiryTime)
      .utc()
      .isBefore(DayjsHelper.new());

    if (hasExpired) throw new BadRequestException('OTP has expired');

    if (!(await bcrypt.compare(_otp, user.otp))) {
      throw new BadRequestException('OTP is incorrect');
    }

    //OTP is correct
    await this.usersService.update(user.id, {
      state: StateUser.CONFIRMED,
      otp: undefined,
      otpExpiryTime: undefined,
    });

    return {
      message: 'OTP verified successfully',
    };
  }

  private async createPasswordResetToken(userId: number) {
    const resetToken = crypto.randomBytes(32).toString('hex');

    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const passwordResetExpires = DayjsHelper.new()
      .add(RESET_PASSWORD_EXPIRY_TIME, 'm')
      .toDate(); //10 min

    await this.usersService.update(userId, {
      passwordResetToken,
      passwordResetExpires,
    });
    return passwordResetToken;
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.usersService.findOne({ email });

    if (!user)
      throw new BadRequestException(
        'There is no user with given email address'
      );

    const resetToken = await this.createPasswordResetToken(user.id);
    const resetURL = `${process.env['CLIENT_AUTH_URL']}/new-password?token=${resetToken}`;

    // send mail
    await this.emailHelper.sendEmail({
      to: user?.email as string,
      subject: 'TaskM: Reset password for ',
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

    const hasExpired = DayjsHelper.new(user.otpExpiryTime)
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
}
