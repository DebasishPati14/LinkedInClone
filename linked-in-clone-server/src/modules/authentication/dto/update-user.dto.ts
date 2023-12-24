import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './index';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Role } from '../entities/user.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional()
  email?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  password?: string;

  @IsOptional()
  @ApiPropertyOptional()
  role?: Role;
}
