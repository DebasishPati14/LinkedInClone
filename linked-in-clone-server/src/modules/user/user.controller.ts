import { Controller, Get, Param, Delete, UseGuards, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../authentication/guards/jwt.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { saveImageConfig } from 'src/common/upload-image';
import { FileInterceptor } from '@nestjs/platform-express';

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
  uploadFile(@GetUser() user, @UploadedFile() file: Express.Multer.File) {
    console.log(file);
    this.userService.saveUserProfilePicture(user, file.filename);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
