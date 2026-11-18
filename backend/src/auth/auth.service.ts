import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    return {
      message: 'Endpoint register siap (belum terhubung database)',
      data: {
        name: registerDto.name,
        email: registerDto.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const payload = { sub: 'temp-user-id', email: loginDto.email };
    return {
      message: 'Endpoint login siap (belum terhubung database)',
      access_token: this.jwtService.sign(payload),
      user: {
        email: loginDto.email,
      },
    };
  }
}
