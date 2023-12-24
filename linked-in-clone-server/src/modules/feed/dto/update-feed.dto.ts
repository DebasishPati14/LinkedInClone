import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedDto } from './create-feed.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFeedDto extends PartialType(CreateFeedDto) {
  @IsNotEmpty()
  @IsString()
  post?: string;
}
