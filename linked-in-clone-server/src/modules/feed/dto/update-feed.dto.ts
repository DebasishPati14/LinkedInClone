import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedDto } from './create-feed.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFeedDto extends PartialType(CreateFeedDto) {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  post?: string;
}
