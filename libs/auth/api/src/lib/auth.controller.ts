import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  BaseUserDto,
  CreateUserDto,
  UserDto,
  ForgotPasswordDto,
  VerifyAccountDto,
  SendVerificationLinkDto,
  ResetPasswordDto,
  ChangeActiveWorkspaceDto,
  UserInfoDto,
} from '@TaskM/core/dto';
import { PublicRoute } from './auth.decorator';
import { Serialize } from '@TaskM/core/interceptors';
import { CurrentUser } from '@TaskM/core/decorators';
import { User } from '@TaskM/core/db';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @Serialize(UserDto)
  @Post('register')
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @PublicRoute()
  @Post('login')
  async login(
    @Body()
    userDto: BaseUserDto
  ) {
    return this.authService.login(userDto);
  }

  @PublicRoute()
  @Post('verify-account')
  async verifyAccount(
    @Body()
    verifyAccountDto: VerifyAccountDto
  ) {
    return this.authService.verifyAccount(verifyAccountDto);
  }

  @PublicRoute()
  @Post('confirm-account')
  async sendOtp(
    @Body()
    dto: SendVerificationLinkDto
  ) {
    return this.authService.sendVerificationLink(dto);
  }

  @PublicRoute()
  @Post('forgot-password')
  async forgotPassword(
    @Body()
    forgotPasswordDto: ForgotPasswordDto
  ) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @PublicRoute()
  @Post('reset-password')
  async resetPassword(
    @Body()
    resetPasswordDto: ResetPasswordDto
  ) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Serialize(UserInfoDto)
  @Get('get-my-info')
  async getMyInfo(@CurrentUser() user: User) {
    return this.authService.getMyInfo(user.id);
  }

  @Post('update-active-workspace')
  async updateActiveWorkspace(
    @CurrentUser() user: User,
    @Body() payload: ChangeActiveWorkspaceDto
  ) {
    return this.authService.updateActiveWorkspace(user.id, payload.workspaceId);
  }
}
