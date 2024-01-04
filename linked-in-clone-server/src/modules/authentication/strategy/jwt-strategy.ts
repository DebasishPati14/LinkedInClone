import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';

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

  async validate(requestPaylod: { user: UserEntity }) {
    const user: UserEntity = await this.authRepository.findOne({
      where: {
        id: requestPaylod.user.id,
      },
    });
    delete user.hash;

    return user;
  }
}
