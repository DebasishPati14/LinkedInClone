import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  post: string;
}
