import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../authentication/guards/jwt.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';

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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
