import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() createAuthDto: any) {
    return "success";
  }

  @Post('register')
  register(@Body() createAuthDto: any) {
    return "success";
  }
}
