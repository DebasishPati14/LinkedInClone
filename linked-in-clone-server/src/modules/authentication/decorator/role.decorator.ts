import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'src/common/constant';
import { RolesEnum } from 'src/modules/user/entities/user.entity';

export const Role = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
