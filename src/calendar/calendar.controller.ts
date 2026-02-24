import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Calendar')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  // ✅ Get upcoming events
  @Get('events')
  async getEvents(@Req() req) {
    return this.calendarService.listUpcomingEvents(req.user.id);
  }

  // ✅ Get event by ID
  @Get('event/:id')
  async getEvent(@Req() req, @Param('id') id: string) {
    return this.calendarService.getEvent(req.user.id, id);
  }

  // ✅ Create event
  @Post('create')
  async createEvent(@Req() req, @Body() body: CreateEventDto) {
    return this.calendarService.createEvent(req.user.id, body);
  }

  // ✅ Update event
  @Put('event/:id')
  async updateEvent(
    @Req() req,
    @Param('id') id: string,
    @Body() body: CreateEventDto,
  ) {
    return this.calendarService.updateEvent(req.user.id, id, body);
  }

  // ✅ Delete event
  @Delete('event/:id')
  async deleteEvent(@Req() req, @Param('id') id: string) {
    return this.calendarService.deleteEvent(req.user.id, id);
  }

  // ✅ Check availability
  @Get('availability')
  async checkAvailability(
    @Req() req,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.calendarService.checkAvailability(req.user.id, start, end);
  }
}