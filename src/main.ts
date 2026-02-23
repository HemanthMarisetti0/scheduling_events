import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const oauth2Client = new google.auth.OAuth2(
  //   process.env.GOOGLE_CLIENT_ID,
  //   process.env.GOOGLE_CLIENT_SECRET,
  //   process.env.GOOGLE_REDIRECT_URI
  // );

  // const { tokens } = await oauth2Client.getToken('4/0AfrIepACLEOdSuMGg8nFndYXPr6Y6AN7BzyiokoSvb8Vud0P15Qnn6PmQnS0dJFqGAF6AQ');
  // console.log(tokens);

  const config = new DocumentBuilder()
    .setTitle('AI Scheduler API')
    .setDescription('Single-user AI scheduling agent using Gemini + Google Calendar')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();