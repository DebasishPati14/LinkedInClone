import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, from, map, switchMap } from 'rxjs';
import { FeedService } from '../feed.service';
import { FeedEntity } from '../entities/feed.entity';
import { UserService } from 'src/modules/user/user.service';
import { RolesEnum, UserEntity } from 'src/modules/user/entities/user.entity';

@Injectable()
export class IsAuthorGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private feedService: FeedService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params }: { user: UserEntity; params: { id: string } } = request;

    if (user.role === RolesEnum.ADMIN) return true;

    return from(
      this.userService.findUserById(user.id).pipe(
        switchMap((user: UserEntity) => {
          return this.feedService.findFeedById(params.id).pipe(
            map((feedPost: FeedEntity) => {
              return user.id === feedPost.author.id;
            }),
          );
        }),
      ),
    );
  }
}
