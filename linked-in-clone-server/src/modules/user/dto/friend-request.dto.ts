import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export type Friend_Request_Status = 'pending' | 'accepted' | 'declined';

export interface FriendRequestStatus {
  status?: Friend_Request_Status;
}

export class FriendRequestResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  sender: UserEntity;
  @ApiProperty()
  receiver: UserEntity;
  @ApiProperty()
  status: Friend_Request_Status;
}

export class ResponseFriendRequestBody {
  @ApiProperty()
  requestId: number;
  @ApiProperty()
  status: Friend_Request_Status;
}
