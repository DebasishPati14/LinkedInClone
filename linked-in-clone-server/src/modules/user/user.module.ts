import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FriendRequestEntity } from './entities/friend-request.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FriendRequestEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
