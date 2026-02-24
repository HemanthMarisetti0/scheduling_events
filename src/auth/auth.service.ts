import { Injectable, BadRequestException } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private oauth2Client;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService, 
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.configService.get<string>('GOOGLE_REDIRECT_URI'),
    );
  }

  getAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
    });
  }

  async handleCallback(code: string) {
      try {

        console.log('Received OAuth code:', code);

    const { tokens } = await this.oauth2Client.getToken(code);
        console.log('Tokens received:', tokens);


    if (!tokens) {
      throw new BadRequestException('Failed to retrieve Google tokens');
    }

    this.oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: this.oauth2Client,
      version: 'v2',
    });

    const { data } = await oauth2.userinfo.get();

    if (!data.email) {
      throw new BadRequestException('Google account email not found');
    }

    let user = await this.usersService.findByEmail(data.email);

    if (!user) {
      user = await this.usersService.create({
        email: data.email,
      });
    }

    if (tokens.refresh_token) {
      await this.usersService.saveGoogleRefreshToken(
        user._id.toString(),
        tokens.refresh_token,
      );
    }

    const accessToken = this.jwtService.sign({
      sub: user._id,
      email: user.email,
    });

    return {
      access_token: accessToken,
    };
     } catch (error) {
    console.error('Google OAuth Error:', error.response?.data || error.message);
    throw error;
  }
  }
}