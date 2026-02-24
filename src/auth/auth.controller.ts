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
  constructor(private readonly authService: AuthService) { }

  @Get('google')
  googleLogin(@Res() res: Response) {
    const url = this.authService.getAuthUrl();
    return res.redirect(url);
  }

  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    const { access_token } =
      await this.authService.handleCallback(code);

    const frontendUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_PROD_URL
        : process.env.FRONTEND_DEV_URL;

    return res.redirect(
      `${frontendUrl}/login-success?token=${access_token}`,
    );
  }
}