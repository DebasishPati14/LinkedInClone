import { Injectable } from '@nestjs/common';
import { CreateUserDto, LogInUserDto, UpdateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as bcrypt from 'bcrypt';
import { UserResponse } from './interfaces/create-user.response';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserEntity)
    private authenticationRepository: Repository<UserEntity>,
  ) {}

  generateHash = (password: string): Observable<string> => {
    return from(bcrypt.hash(password, 12));
  };

  verifyHash = (
    password: string,
    hashedPassword: string,
  ): Observable<boolean> => {
    return from(bcrypt.compare(password, hashedPassword));
  };

  createUser(createUserDto: CreateUserDto): Observable<UserResponse> {
    // return from(this.authenticationRepository.save(createUserDto));
    return this.generateHash(createUserDto.password).pipe(
      switchMap((hashedPassword: string): Observable<UserResponse> => {
        return from(
          this.authenticationRepository.save({
            ...createUserDto,
            hash: hashedPassword,
          }),
        ).pipe(
          map((user: UserResponse) => {
            delete user.hash;
            delete user.password;
            return user;
          }),
        );
      }),
    );
  }

  async loginUser(
    loginUserDto: LogInUserDto,
  ): Observable<UserResponse | { error: string }> {
    const existingUser = from(
      await this.authenticationRepository.findOne({
        where: { email: loginUserDto.email },
      }),
    );
    if (!existingUser) {
      return of({ error: 'Invalid email address' });
    }
    return this.verifyHash(loginUserDto.password, existingUser.hash).pipe(
      map((val) => {
        if (!val) {
          return { error: 'Invalid password' };
        }
        delete existingUser.hash;
        return existingUser;
      }),
    );
  }

  findAllUsers() {
    return `This action returns all User`;
  }

  findOneUserById(id: string) {
    return `This action returns a #${id} User`;
  }

  updateUserById(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} authentication`;
  }

  deleteUserById(id: string) {
    return `This action removes a #${id} authentication`;
  }
}
