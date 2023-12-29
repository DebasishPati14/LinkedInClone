import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from '../user/types';

export class FeedPostResponse {
  @ApiProperty()
  post: string;
  @ApiProperty()
  id: string;
  @ApiProperty()
  author: UserResponse;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
