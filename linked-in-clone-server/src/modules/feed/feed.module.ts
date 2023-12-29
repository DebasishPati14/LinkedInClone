import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedEntity } from './entities/feed.entity';
import { IsAuthorGuard } from './guards/is-author.guard';
import { JwtGuard } from '../authentication/guards/jwt.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [TypeOrmModule.forFeature([FeedEntity]), AuthenticationModule],
  controllers: [FeedController],
  providers: [FeedService, RolesGuard, JwtGuard, IsAuthorGuard],
})
export class FeedModule {}
