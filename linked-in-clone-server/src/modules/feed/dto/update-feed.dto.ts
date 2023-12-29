import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedRequest } from './create-feed.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFeedPostRequest extends PartialType(CreateFeedRequest) {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  post?: string;
}
