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

  private async getCalendar(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user?.googleRefreshToken) {
      throw new BadRequestException('Google not connected');
    }

    const oauthClient = this.createOAuthClient(user.googleRefreshToken);

    return google.calendar({
      version: 'v3',
      auth: oauthClient,
    });
  }

  // ✅ List upcoming events
  async listUpcomingEvents(userId: string) {
    const calendar = await this.getCalendar(userId);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items ?? [];
  }

  // ✅ Get event by ID
  async getEvent(userId: string, eventId: string) {
    const calendar = await this.getCalendar(userId);

    const response = await calendar.events.get({
      calendarId: 'primary',
      eventId,
    });

    return response.data;
  }

  // ✅ Create event
  async createEvent(userId: string, data: any) {
    const calendar = await this.getCalendar(userId);

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
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
      },
    });

    return response.data;
  }

  // ✅ Update event
  async updateEvent(userId: string, eventId: string, data: any) {
    const calendar = await this.getCalendar(userId);

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId,
      requestBody: {
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
      },
    });

    return response.data;
  }

  // ✅ Delete event
  async deleteEvent(userId: string, eventId: string) {
    const calendar = await this.getCalendar(userId);

    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });

    return { message: 'Event deleted successfully' };
  }

  // ✅ Free/Busy check
  async checkAvailability(userId: string, timeMin: string, timeMax: string) {
    const calendar = await this.getCalendar(userId);

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        items: [{ id: 'primary' }],
      },
    });

    return response.data;
  }
}