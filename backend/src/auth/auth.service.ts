// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateGoogleUser(googleUser: any) {
    const { googleId, email, name, avatar } = googleUser;

    let user = await this.userRepository.findOne({
      where: { googleId },
    });

    if (!user) {
      user = this.userRepository.create({
        googleId,
        email,
        name,
        avatar,
      });
      await this.userRepository.save(user);
    }

    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }

  async refreshAccessToken(refresh_token: string) {
    try {
      const payload = this.jwtService.verify(refresh_token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const access_token = this.jwtService.sign(
        { email: payload.email, sub: payload.sub },
        { expiresIn: '15m' },
      );

      return { access_token };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
