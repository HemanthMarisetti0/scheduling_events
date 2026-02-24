import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CalendarModule } from './calendar/calendar.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CalendarModule,
    AuthModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,

  ],
})
export class AppModule { }