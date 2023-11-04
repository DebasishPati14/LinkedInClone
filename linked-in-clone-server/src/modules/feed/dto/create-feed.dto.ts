import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedDto {
  @IsNotEmpty()
  @IsString()
  post: string;

  @IsDate()
  createdAt: string;

  @IsDate()
  updatedAt: string;
}
