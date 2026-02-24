import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Calendar')
@Controller('calendar')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  async getEvents(@Req() req) {
    return this.calendarService.listUpcomingEvents(req.user.id);
  }

  @Post('create')
  async createEvent(@Req() req, @Body() body: CreateEventDto) {
    return this.calendarService.createEvent(req.user.id, body);
  }
}