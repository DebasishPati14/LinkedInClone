import { ApiProperty } from '@nestjs/swagger';

export class SignupResponse {
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
}

export class LoginResponse {
  @ApiProperty()
  token: string;
}
