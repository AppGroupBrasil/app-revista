import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

const APP_SLUG = 'app-revista';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { super(); }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const ok = (await super.canActivate(ctx)) as boolean;
    if (!ok) throw new UnauthorizedException();
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (user.role_global === 'superadmin') return true;
    const lic = (user.apps || []).find((a: { slug: string; status: string }) => a.slug === APP_SLUG);
    if (!lic || (lic.status !== 'ativa' && lic.status !== 'trial')) {
      throw new ForbiddenException('Sem licença ativa para App Revista');
    }
    return true;
  }
}
