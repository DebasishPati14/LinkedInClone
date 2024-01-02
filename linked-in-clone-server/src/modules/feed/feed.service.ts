import { Injectable } from '@nestjs/common';
import { CreateFeedRequest, UpdateFeedPostRequest } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedEntity } from './entities/feed.entity';
import { CONSTANT_STRINGS } from 'src/common/constant';
import { Observable, from } from 'rxjs';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedEntity)
    private feedRepository: Repository<FeedEntity>,
  ) {}

  async createFeed(createFeedDto: CreateFeedRequest, user: UserEntity) {
    const feedPostData = {
      post: createFeedDto.post,
      author: user,
    };
    return from(this.feedRepository.save(feedPostData));
  }

  async findAllFeeds() {
    const count = await this.feedRepository.count();
    const result = await this.feedRepository.find({
      order: { createdAt: 'DESC' },
    });
    return result ? { count, result } : { error: CONSTANT_STRINGS.feedErrorMessage };
  }

  findFeedById(id: string): Observable<FeedEntity> {
    // return result ? result : { error: CONSTANTS.feedErrorMessage };
    return from(this.feedRepository.findOne({ where: { id }, relations: ['author'] }));
  }

  async updateFeedById(id: string, updateFeedDto: UpdateFeedPostRequest) {
    const result = await this.feedRepository.update(id, updateFeedDto);
    return result.affected > 0
      ? { success: CONSTANT_STRINGS.successMessage }
      : { error: CONSTANT_STRINGS.feedErrorMessage };
  }

  async deleteFeedById(id: string) {
    const result = await this.feedRepository.delete(id);
    return result.affected > 0
      ? { success: CONSTANT_STRINGS.successMessage }
      : { error: CONSTANT_STRINGS.feedErrorMessage };
  }
}
