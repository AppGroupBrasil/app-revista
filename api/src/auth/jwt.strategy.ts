import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export interface JwtUser {
  sub: string;            // usuarios.id (auth-central)
  email: string;
  nome: string;
  role_global: 'superadmin' | 'usuario';
  apps: Array<{ slug: string; role: string; status: string; expira_em: string | null }>;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
      ignoreExpiration: false,
    });
  }
  async validate(payload: JwtUser) {
    return payload;
  }
}
