import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Friend_Request_Status } from '../dto/friend-request.dto';
import { UserEntity } from './user.entity';

@Entity('friend_request')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (userDetail) => userDetail.sentFriendRequests)
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (userDetail) => userDetail.receivedFriendRequests)
  receiver: UserEntity;

  @Column()
  status: Friend_Request_Status;
}
