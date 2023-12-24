import { Injectable } from '@nestjs/common';
import { CreateUserDto, LogInUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as bcrypt from 'bcrypt';
import { UserResponse } from './interfaces/create-user.response';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserEntity)
    private authenticationRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  generateHash = (password: string): Observable<string> => {
    return from(bcrypt.hash(password, 12));
  };

  verifyUserPassword = (password: string, hashedPassword: string): Observable<boolean> => {
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
            delete user.id;
            return user;
          }),
        );
      }),
    );
  }

  validateUser(loginUserDto: LogInUserDto): Observable<UserEntity> {
    return from(
      this.authenticationRepository.findOne({
        where: { email: loginUserDto.email },
      }),
    ).pipe(
      switchMap((user) => {
        return this.verifyUserPassword(loginUserDto.password, user.hash).pipe(
          map((doesUserExist) => {
            if (doesUserExist) {
              delete user.hash;
              return user;
            }
          }),
        );
      }),
    );
  }

  loginUser(loginUserDto: LogInUserDto): Observable<Promise<{ token?: string } | { error: string }>> {
    return this.validateUser(loginUserDto).pipe(
      map(async (existingUser) => {
        if (!existingUser) {
          return { error: 'Invalid email or password' };
        }
        return {
          token: await this.jwtService.signAsync(
            {
              sub: existingUser.id,
              email: existingUser.email,
            },
            { secret: process.env.JWT_SECRET, expiresIn: 3600 },
          ),
        };
      }),
    );
  }
}
