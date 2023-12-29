import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { SuccessResponse } from 'src/common/constant';
import { FeedPostResponse } from './types';
import { ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from '../authentication/guards/jwt.guard';
import { Role } from '../authentication/decorator/role.decorator';
import { IsAuthorGuard } from './guards/is-author.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { RolesEnum, UserEntity } from '../user/entities/user.entity';
import { CreateFeedRequest, UpdateFeedPostRequest } from './dto';
import { GetUser } from '../../common/decorator/get-user.decorator';

@UseGuards(JwtGuard)
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Role(RolesEnum.ADMIN, RolesEnum.PREMIUM)
  @UseGuards(RolesGuard)
  @Post('create')
  @ApiResponse({ status: 200, description: 'Success', type: FeedPostResponse })
  create(@Body() createFeedDto: CreateFeedRequest, @GetUser() user: UserEntity) {
    return this.feedService.createFeed(createFeedDto, user);
  }

  @Get('all-feeds')
  @ApiResponse({ status: 200, description: 'Success', type: [FeedPostResponse] })
  findAllFeeds() {
    return this.feedService.findAllFeeds();
  }

  @Get('feedById/:id')
  @ApiResponse({ status: 200, description: 'Success', type: FeedPostResponse })
  findFeedById(@Param('id') id: string) {
    return this.feedService.findFeedById(id);
  }

  @Patch('updateById/:id')
  @UseGuards(IsAuthorGuard)
  @ApiResponse({ status: 200, description: 'Success', type: SuccessResponse })
  updateFeedById(@Param('id') id: string, @Body() updateFeedDto: UpdateFeedPostRequest) {
    return this.feedService.updateFeedById(id, updateFeedDto);
  }

  @Delete('deleteById/:id')
  @ApiResponse({ status: 200, description: 'Success', type: SuccessResponse })
  deleteFeedById(@Param('id') id: string) {
    return this.feedService.deleteFeedById(id);
  }
}
