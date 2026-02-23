import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'Team Meeting' })
  title: string;

  @ApiProperty({ example: 'Discuss project updates', required: false })
  description?: string;

  @ApiProperty({ example: '2026-02-24T15:00:00' })
  start: string;

  @ApiProperty({ example: '2026-02-24T16:00:00' })
  end: string;
}