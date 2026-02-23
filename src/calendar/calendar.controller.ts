import { Body, Controller, Get, Post } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  async getEvents() {
    return this.calendarService.listUpcomingEvents();
  }

  @Post('create')
  @ApiOperation({ summary: 'Create calendar event manually' })
  async createEvent(@Body() body: CreateEventDto) {
    return this.calendarService.createEvent(body);
  }
}
