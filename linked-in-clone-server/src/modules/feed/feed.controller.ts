import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { SuccessResponse } from 'src/common/constant';
import { PostResponse } from './types';
import { ApiResponse } from '@nestjs/swagger';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post('create')
  @ApiResponse({ status: 200, description: 'Success', type: PostResponse })
  create(@Body() createFeedDto: CreateFeedDto) {
    return this.feedService.createFeed(createFeedDto);
  }

  @Get('all-feeds')
  @ApiResponse({ status: 200, description: 'Success', type: [PostResponse] })
  findAllFeeds() {
    return this.feedService.findAllFeeds();
  }

  @Get('feedById/:id')
  @ApiResponse({ status: 200, description: 'Success', type: PostResponse })
  findFeedById(@Param('id') id: string) {
    return this.feedService.findFeedById(id);
  }

  @Patch('updateById/:id')
  @ApiResponse({ status: 200, description: 'Success', type: SuccessResponse })
  updateFeedById(@Param('id') id: string, @Body() updateFeedDto: UpdateFeedDto) {
    return this.feedService.updateFeedById(id, updateFeedDto);
  }

  @Delete('deleteById/:id')
  @ApiResponse({ status: 200, description: 'Success', type: SuccessResponse })
  deleteFeedById(@Param('id') id: string) {
    return this.feedService.deleteFeedById(id);
  }
}
