import { Injectable, BadRequestException } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class CalendarService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService, 
  ) {}

  private createOAuthClient(refreshToken: string) {
    const oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    return oauth2Client;
  }

  async listUpcomingEvents(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user?.googleRefreshToken) {
      throw new BadRequestException('Google not connected');
    }

    const oauthClient = this.createOAuthClient(user.googleRefreshToken);

    const calendar = google.calendar({
      version: 'v3',
      auth: oauthClient,
    });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items ?? [];
  }

  async createEvent(
    userId: string,
    data: {
      title: string;
      description?: string;
      start: string;
      end: string;
    },
  ) {
    const user = await this.usersService.findById(userId);

    if (!user?.googleRefreshToken) {
      throw new BadRequestException('Google not connected');
    }

    const oauthClient = this.createOAuthClient(user.googleRefreshToken);

    const calendar = google.calendar({
      version: 'v3',
      auth: oauthClient,
    });

    const event = {
      summary: data.title,
      description: data.description,
      start: {
        dateTime: data.start,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: data.end,
        timeZone: 'Asia/Kolkata',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return response.data;
  }
}