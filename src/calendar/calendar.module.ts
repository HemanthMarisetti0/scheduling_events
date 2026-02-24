import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [UsersModule],

  providers: [CalendarService],
  controllers: [CalendarController],
})
export class CalendarModule { }