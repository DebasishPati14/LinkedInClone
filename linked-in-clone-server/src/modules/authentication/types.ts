import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  role: 'user' | 'admin' | 'premium';
}

export class LoginResponse {
  @ApiProperty()
  token: string;
}
