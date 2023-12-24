import { ApiProperty } from '@nestjs/swagger';

export class PostResponse {
  @ApiProperty()
  post: string;
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
