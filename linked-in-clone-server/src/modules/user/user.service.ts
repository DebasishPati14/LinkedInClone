import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { Observable, from, map } from 'rxjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  findAll() {
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
          return null;
        }
        return user;
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
