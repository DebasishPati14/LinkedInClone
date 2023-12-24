import { Injectable } from '@nestjs/common';
import { CreateFeedDto, UpdateFeedDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedEntity } from './entities/feed.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedEntity)
    private feedRepository: Repository<FeedEntity>,
  ) {}

  async createFeed(createFeedDto: CreateFeedDto) {
    const result = await this.feedRepository.save(createFeedDto);
    return result ? result : { error: 'could not create' };
  }

  async findAllFeeds() {
    const count = await this.feedRepository.count();
    const result = await this.feedRepository.find({
      order: { createdAt: 'DESC' },
    });
    return result ? { count, result } : { error: 'No data found.' };
  }

  async findFeedById(id: string) {
    const result = await this.feedRepository.findOneBy({ id });
    return result ? result : { error: 'No data found with given id.' };
  }

  async updateFeedById(id: string, updateFeedDto: UpdateFeedDto) {
    const result = await this.feedRepository.update(id, updateFeedDto);
    return result
      ? result
      : { error: 'No data found to update with given id.' };
  }

  async deleteFeedById(id: string) {
    const result = await this.feedRepository.delete(id);
    return result
      ? result
      : { error: 'No data found to delete with given id.' };
  }
}
