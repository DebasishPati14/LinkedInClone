import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import fs = require('fs');
import { UserResponse } from './types';
import { UpdateUserRequest } from './dto';
import { CONSTANT_STRINGS, ErrorResponse, SuccessResponse } from 'src/common/constant';
import { FriendRequestResponse, ResponseFriendRequestBody } from './dto/friend-request.dto';
import { FriendRequestEntity } from './entities/friend-request.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(FriendRequestEntity)
    private friendRequestRepository: Repository<FriendRequestEntity>,
  ) {}

  findAll(): Observable<UserEntity[]> {
    return from(
      this.userRepository.find({ relations: ['feedPosts'], select: ['id', 'firstName', 'lastName', 'email', 'role'] }),
    ).pipe(
      map((user) => {
        if (!user) {
          return null;
        }
        return user;
      }),
    );
  }

  findUserById(id: string): Observable<UserEntity> {
    return from(
      this.userRepository.findOne({
        where: { id },
        relations: ['feedPosts'],
        select: ['id', 'firstName', 'lastName', 'email', 'role'],
      }),
    ).pipe(
      map((user) => {
        if (!user) {
          throw new HttpException(
            { message: CONSTANT_STRINGS.userErrorMessage, status: HttpStatus.BAD_REQUEST },
            HttpStatus.BAD_REQUEST,
          );
        }
        return user;
      }),
    );
  }

  saveUserProfilePicture(user: UserResponse, imageUrl: string) {
    if (user.profilePictureUrl) {
      const removingFilePath = __dirname + '../../../../' + user.profilePictureUrl;
      fs.unlink(removingFilePath, (err) => {
        if (!err) {
          return this.updateUserRecord(user.id, { profilePictureUrl: imageUrl });
        }
      });
    } else {
      return this.updateUserRecord(user.id, { profilePictureUrl: imageUrl });
    }
  }

  updateUserRecord(id: string, updateUserRecord: UpdateUserRequest) {
    return from(this.userRepository.update(id, updateUserRecord)).pipe(
      map((user) => {
        if (!user) {
          throw new HttpException(
            { message: CONSTANT_STRINGS.userErrorMessage, status: HttpStatus.BAD_REQUEST },
            HttpStatus.BAD_REQUEST,
          );
        }
        return user;
      }),
    );
  }

  responseFriendRequest(
    currentUser: UserEntity,
    reqBody: ResponseFriendRequestBody,
  ): Observable<SuccessResponse | ErrorResponse> {
    return from(
      this.friendRequestRepository.findOne({
        where: { id: reqBody.requestId },
        relations: ['receiver'],
      }),
    ).pipe(
      switchMap((friendRequest: FriendRequestEntity) => {
        if (!friendRequest) {
          throw new HttpException(
            { message: CONSTANT_STRINGS.noRecordExists, status: HttpStatus.UNPROCESSABLE_ENTITY },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        } else {
          if (friendRequest.receiver.id !== currentUser.id) {
            throw new HttpException(
              { message: CONSTANT_STRINGS.notAllowedToOperate, status: HttpStatus.UNPROCESSABLE_ENTITY },
              HttpStatus.UNPROCESSABLE_ENTITY,
            );
          }
          return from(this.friendRequestRepository.update({ id: reqBody.requestId }, { status: reqBody.status })).pipe(
            map(() => {
              return { success: CONSTANT_STRINGS.successMessage };
            }),
          );
        }
      }),
    );
  }

  receivedFriendRequests(currentUser: UserEntity): Observable<FriendRequestResponse[]> {
    return from(
      this.friendRequestRepository.find({
        where: { receiver: currentUser },
      }),
    ).pipe(
      map((friendRequestEntities: FriendRequestEntity[]) => {
        return friendRequestEntities;
      }),
    );
  }

  receivedFriendRequestDetail(currentUser: UserEntity, requestId: number): Observable<FriendRequestResponse> {
    return from(this.friendRequestRepository.findOne({ where: { id: +requestId, sender: currentUser } })).pipe(
      map((friendRequestEntities: FriendRequestEntity) => {
        if (!friendRequestEntities) {
          throw new HttpException(
            { message: CONSTANT_STRINGS.badRequest, status: HttpStatus.BAD_REQUEST },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
        return friendRequestEntities;
      }),
    );
  }

  hasFriendRequestBefore(sender: UserEntity, receiver: UserEntity): Observable<boolean> {
    return from(
      this.friendRequestRepository.findOne({
        where: [
          { sender, receiver },
          { receiver: sender, sender: receiver },
        ],
      }),
    ).pipe(
      switchMap((friendRequestEntity: FriendRequestEntity) => {
        return of(!!friendRequestEntity);
      }),
    );
  }

  sendFriendRequest(sendUser: UserEntity, receiverId: string): Observable<FriendRequestResponse> {
    if (sendUser.id === receiverId) {
      throw new HttpException(
        { message: CONSTANT_STRINGS.sameUserFriendRequestError, status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.findUserById(receiverId).pipe(
      switchMap((receiverDetail: UserEntity) => {
        return this.hasFriendRequestBefore(sendUser, receiverDetail).pipe(
          switchMap((hasSent: boolean) => {
            if (hasSent) {
              throw new HttpException(
                { message: CONSTANT_STRINGS.sendFriendRequestError, status: HttpStatus.BAD_REQUEST },
                HttpStatus.BAD_REQUEST,
              );
            }
            return from(
              this.friendRequestRepository.save({ sender: sendUser, receiver: receiverDetail, status: 'pending' }),
            );
          }),
        );
      }),
    );
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
