import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  BaseUserDto,
  CreateUserDto,
  UserDto,
  ForgotPasswordDto,
  VerifyOtpDto,
  SendOtpDto,
  ResetPasswordDto,
} from '@task-manager/users/api';
import { PublicRoute } from './auth.decorator';
import { Serialize } from '@task-manager/core/interceptors';

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
  @Post('verify-otp')
  async verifyOtp(
    @Body()
    verifyOtpDto: VerifyOtpDto
  ) {
    return this.authService.verifyOTP(verifyOtpDto);
  }

  @PublicRoute()
  @Post('send-otp')
  async sendOtp(
    @Body()
    sendOtpDto: SendOtpDto
  ) {
    return this.authService.sendOTP(sendOtpDto);
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
}
