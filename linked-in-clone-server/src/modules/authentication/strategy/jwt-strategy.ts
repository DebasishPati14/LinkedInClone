import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from, map } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'JwtGuard') {
  constructor(
    @InjectRepository(UserEntity)
    private authRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(requestPaylod: { sub: string; email: string }): Observable<UserEntity> {
    return from(
      this.authRepository.findOne({
        where: {
          id: requestPaylod.sub,
        },
      }),
    ).pipe(
      map((user: UserEntity) => {
        delete user.hash;
        return user;
      }),
    );
  }
}
