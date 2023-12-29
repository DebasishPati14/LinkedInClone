import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/common/constant';
import { RolesEnum } from 'src/modules/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const reflectorInstance = this.reflector.getAllAndOverride<RolesEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!reflectorInstance) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    return reflectorInstance.some((role) => user.role?.includes(role));
  }
}
