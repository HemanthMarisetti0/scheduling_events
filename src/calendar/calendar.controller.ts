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
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Calendar')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  async getEvents(
    @Req() req,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    if (!start || !end) {
      throw new BadRequestException('Start and end query params are required');
    }

    return this.calendarService.listEventsInRange(
      req.user.id,
      start,
      end,
    );
  }

  @Get('event/:id')
  async getEvent(@Req() req, @Param('id') id: string) {
    return this.calendarService.getEvent(req.user.id, id);
  }

  @Post('create')
  async createEvent(@Req() req, @Body() body: CreateEventDto) {
    return this.calendarService.createEvent(req.user.id, body);
  }

  @Put('event/:id')
  async updateEvent(
    @Req() req,
    @Param('id') id: string,
    @Body() body: CreateEventDto,
  ) {
    return this.calendarService.updateEvent(req.user.id, id, body);
  }

  @Delete('event/:id')
  async deleteEvent(@Req() req, @Param('id') id: string) {
    return this.calendarService.deleteEvent(req.user.id, id);
  }

  @Get('availability')
  async checkAvailability(
    @Req() req,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    if (!start || !end) {
      throw new BadRequestException('Start and end query params are required');
    }

    return this.calendarService.checkAvailability(req.user.id, start, end);
  }
}