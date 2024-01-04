import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../authentication/guards/jwt.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { saveImageConfig } from 'src/common/upload-image';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserEntity } from './entities/user.entity';
import { UserResponse } from './types';
import { Observable } from 'rxjs';
import { FriendRequestResponse, ResponseFriendRequestBody } from './dto/friend-request.dto';
import { ErrorResponse, SuccessResponse } from 'src/common/constant';
import { ApiResponse } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RolesGuard)
  @Get('all-users')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Post('save-profile-image')
  @UseInterceptors(FileInterceptor('file', saveImageConfig))
  @ApiResponse({ status: 400, description: 'Success', type: SuccessResponse })
  uploadFile(@GetUser() user: UserResponse, @UploadedFile() file: Express.Multer.File) {
    this.userService.saveUserProfilePicture(user, file.filename);
  }

  @Post('friend-request/send/:receiverId')
  @ApiResponse({ status: 200, description: 'Success', type: FriendRequestResponse })
  @ApiResponse({ status: 400, description: 'Success', type: ErrorResponse })
  sendFriendRequest(
    @GetUser() user: UserEntity,
    @Param('receiverId') receiverId: string,
  ): Observable<FriendRequestResponse | ErrorResponse> {
    return this.userService.sendFriendRequest(user, receiverId);
  }

  @Get('friend-request/received')
  @ApiResponse({ status: 200, description: 'Success', type: [FriendRequestResponse] })
  receivedFriendRequests(@GetUser() user: UserEntity): Observable<FriendRequestResponse[]> {
    return this.userService.receivedFriendRequests(user);
  }

  @Get('friend-request/received/:requestId')
  @ApiResponse({ status: 200, description: 'Success', type: [FriendRequestResponse] })
  receivedFriendRequestDetail(
    @GetUser() user: UserEntity,
    @Param('requestId') requestId: number,
  ): Observable<FriendRequestResponse> {
    return this.userService.receivedFriendRequestDetail(user, requestId);
  }

  @Put('friend-request/response')
  @ApiResponse({ status: 200, description: 'Success', type: SuccessResponse })
  @ApiResponse({ status: 400, description: 'Error', type: ErrorResponse })
  responseFriendRequest(
    @GetUser() user: UserEntity,
    @Body() reqBody: ResponseFriendRequestBody,
  ): Observable<SuccessResponse | ErrorResponse> {
    return this.userService.responseFriendRequest(user, reqBody);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Success' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
