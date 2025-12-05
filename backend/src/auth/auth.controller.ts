import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.validateGoogleUser(req.user);
    const { access_token, refresh_token } = await this.authService.login(user);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    res.redirect(`http://localhost:5173/auth/callback?token=${access_token}`);
  }

  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refresh_token = req.cookies['refresh_token'];

    if (!refresh_token) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    try {
      const { access_token } =
        await this.authService.refreshAccessToken(refresh_token);

      return res.json({ access_token });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('refresh_token', { path: '/auth/refresh' });

    return res.json({ message: 'Logged out successfully' });
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
