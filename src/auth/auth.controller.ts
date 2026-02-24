import {
  Controller,
  Get,
  Query,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  googleLogin(@Res() res: Response) {
    const url = this.authService.getAuthUrl();
    return res.redirect(url);
  }

  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
  ) {
    return this.authService.handleCallback(code);
  }
}