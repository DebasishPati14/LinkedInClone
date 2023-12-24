import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post('create')
  create(@Body() createFeedDto: CreateFeedDto) {
    return this.feedService.createFeed(createFeedDto);
  }

  @Get('all-feeds')
  findAllFeeds() {
    return this.feedService.findAllFeeds();
  }

  @Get(':id')
  findFeedById(@Param('id') id: string) {
    return this.feedService.findFeedById(id);
  }

  @Patch('update/:id')
  updateFeedById(
    @Param('id') id: string,
    @Body() updateFeedDto: UpdateFeedDto,
  ) {
    return this.feedService.updateFeedById(id, updateFeedDto);
  }

  @Delete('delete/:id')
  deleteFeedById(@Param('id') id: string) {
    return this.feedService.deleteFeedById(id);
  }
}
