import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto, LogInUserDto, UpdateUserDto } from './dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authenticationService.createUser(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  loginUser(@Body() loginDto: LogInUserDto) {
    return this.authenticationService.loginUser(loginDto);
  }

  @Get()
  findAllUsers() {
    return this.authenticationService.findAllUsers();
  }

  @Get(':id')
  findOneUser(@Param('id') id: string) {
    return this.authenticationService.findOneUserById(id);
  }

  @Patch(':id')
  updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authenticationService.updateUserById(id, updateUserDto);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.authenticationService.deleteUserById(id);
  }
}
