import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: { id: number };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token tidak ditemukan');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: number }>(token);
      request.user = { id: payload.sub };
    } catch {
      throw new UnauthorizedException('Token tidak valid atau kedaluwarsa');
    }

    return true;
  }
}
