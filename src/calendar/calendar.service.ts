import { Injectable } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CalendarService {
  private calendar: calendar_v3.Calendar;

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');
    const refreshToken = this.configService.get<string>('GOOGLE_REFRESH_TOKEN');

    if (!clientId || !clientSecret || !redirectUri || !refreshToken) {
      throw new Error('Missing Google OAuth environment variables');
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri,
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    this.calendar = google.calendar({
      version: 'v3',
      auth: oauth2Client,
    });
  }

  async listUpcomingEvents() {
    const response = await this.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items;
  }

  async createEvent(data: {
    title: string;
    description?: string;
    start: string;
    end: string;
  }) {
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

    const response = await this.calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return response.data;
  }
}
