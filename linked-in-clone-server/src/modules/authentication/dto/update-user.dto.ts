import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './index';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Role } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  role?: Role;
}
