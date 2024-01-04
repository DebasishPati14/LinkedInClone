import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserRequest } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CONSTANT_STRINGS } from 'src/common/constant';
import { UserEntity } from '../user/entities/user.entity';
import { CreateUserRequest } from '../user/dto';
import { UserResponse } from '../user/types';
import { SignupResponse } from './types';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  generateHash = (password: string): Observable<string> => {
    return from(bcrypt.hash(password, 12));
  };

  verifyUserPassword = (password: string, hashedPassword: string): Observable<boolean> => {
    return from(bcrypt.compare(password, hashedPassword));
  };

  findUser(email: string): Observable<UserEntity | null> {
    return from(
      this.userRepository.findOne({
        where: { email },
      }),
    ).pipe(
      switchMap((user) => {
        if (!user) {
          return of(null);
        }
        return of(user);
      }),
    );
  }

  signupUser(signUpRequest: CreateUserRequest): Observable<SignupResponse> {
    return this.findUser(signUpRequest.email).pipe(
      switchMap((user) => {
        if (user) {
          throw new HttpException(
            { message: CONSTANT_STRINGS.recordExists, status: HttpStatus.BAD_REQUEST },
            HttpStatus.BAD_REQUEST,
          );
        }
        return this.generateHash(signUpRequest.password).pipe(
          switchMap((hashedPassword: string): Observable<UserResponse> => {
            return from(
              this.userRepository.save({
                ...signUpRequest,
                hash: hashedPassword,
              }),
            ).pipe(
              map((user: any) => {
                delete user.hash;
                delete user.role;
                delete user.password;
                delete user.confirmPassword;
                delete user.id;
                return user;
              }),
            );
          }),
        );
      }),
    );
  }

  validateUser(loginUserDto: LoginUserRequest): Observable<UserEntity> {
    return this.findUser(loginUserDto.email).pipe(
      switchMap((user) => {
        if (!user) {
          throw new HttpException(
            { message: CONSTANT_STRINGS.invalidCredentialErrorMessage, status: HttpStatus.NOT_FOUND },
            HttpStatus.BAD_REQUEST,
          );
        }
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

  loginUser(loginUserDto: LoginUserRequest): Observable<Promise<{ token?: string }>> {
    return this.validateUser(loginUserDto).pipe(
      map(async (existingUser) => {
        if (!existingUser) {
          throw new HttpException(
            { message: CONSTANT_STRINGS.userErrorMessage, status: HttpStatus.UNAUTHORIZED },
            HttpStatus.UNAUTHORIZED,
          );
        }
        return {
          token: await this.jwtService.signAsync(
            {
              user: existingUser,
            },
            { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRATION_TIME },
          ),
        };
      }),
    );
  }
}
