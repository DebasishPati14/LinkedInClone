import { BadRequestException, Injectable } from '@nestjs/common';
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
    private authenticationRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  generateHash = (password: string): Observable<string> => {
    return from(bcrypt.hash(password, 12));
  };

  verifyUserPassword = (password: string, hashedPassword: string): Observable<boolean> => {
    return from(bcrypt.compare(password, hashedPassword));
  };

  signupUser(signUpRequest: CreateUserRequest): Observable<SignupResponse> {
    if (signUpRequest.password !== signUpRequest.confirmPassword) {
      throw new BadRequestException(CONSTANT_STRINGS.badRequest);
    }
    return this.generateHash(signUpRequest.password).pipe(
      switchMap((hashedPassword: string): Observable<UserResponse> => {
        return from(
          this.authenticationRepository.save({
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
  }

  validateUser(loginUserDto: LoginUserRequest): Observable<UserEntity> {
    return from(
      this.authenticationRepository.findOne({
        where: { email: loginUserDto.email },
      }),
    ).pipe(
      switchMap((user) => {
        if (!user) {
          return of(null);
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

  loginUser(loginUserDto: LoginUserRequest): Observable<Promise<{ token?: string } | { error: string }>> {
    return this.validateUser(loginUserDto).pipe(
      map(async (existingUser) => {
        if (!existingUser) {
          return { error: CONSTANT_STRINGS.invalidCredentialErrorMessage };
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
