import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedRequest {
  @IsNotEmpty()
  @IsString()
  post: string;
}
