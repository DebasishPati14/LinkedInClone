import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ApiResponse } from '@nestjs/swagger';
import { LoginResponse, SignupResponse } from './types';
import { CreateUserRequest } from '../user/dto';
import { LoginUserRequest } from './dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  @ApiResponse({ status: 200, description: 'Success', type: SignupResponse })
  createUser(@Body() signupReq: CreateUserRequest) {
    return this.authenticationService.signupUser(signupReq);
  }

  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  @ApiResponse({ status: 200, description: 'Success', type: LoginResponse })
  loginUser(@Body() loginDto: LoginUserRequest) {
    return this.authenticationService.loginUser(loginDto);
  }

  // @Get(':id')
  // @ApiResponse({ status: 200, description: 'Success', type: UserResponse })
  // findOneUser(@Param('id') id: string) {
  //   return this.authenticationService.findOneUserById(id);
  // }

  // @Patch(':id')
  // @ApiResponse({ status: 200, description: 'Success', type: UserResponse })
  // updateUserById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.authenticationService.updateUserById(id, updateUserDto);
  // }

  // @Delete(':id')
  // @ApiResponse({ status: 200, description: 'Success', type: SuccessResponse })
  // deleteUserById(@Param('id') id: string) {
  //   return this.authenticationService.deleteUserById(id);
  // }
}
