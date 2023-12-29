import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CONSTANTS } from 'src/common/constant';
import { Match } from 'src/common/decorator/match.decorator';
import { RolesEnum } from 'src/modules/user/entities/user.entity';

export class CreateUserRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @Match('password', { message: CONSTANTS.passwordsNotMatching })
  @IsNotEmpty()
  @ApiProperty()
  confirmPassword: string;

  @IsOptional()
  role?: RolesEnum;
}
