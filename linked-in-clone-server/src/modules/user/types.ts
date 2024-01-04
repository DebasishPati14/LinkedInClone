import { FeedPostResponse } from '../feed/types';
import { RolesEnum } from './entities/user.entity';

export interface UserResponse {
  email: string;
  firstName: string;
  lastName: string;
  role?: RolesEnum;
  profilePictureUrl?: RolesEnum;
  id: string;
  feedPosts: FeedPostResponse[];
}

export interface FriendRequestResponse {
  email: string;
  firstName: string;
  lastName: string;
  role?: RolesEnum;
  profilePictureUrl?: RolesEnum;
  id: string;
  feedPosts: FeedPostResponse[];
}
