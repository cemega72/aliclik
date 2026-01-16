import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(input: { email: string; password: string; name?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new BadRequestException('Email already registered');

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.prisma.user.create({
      data: { email: input.email, name: input.name, passwordHash },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    const token = await this.signToken(user.id, user.email);
    return { user, token };
  }

  async login(input: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const safeUser = { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
    const token = await this.signToken(user.id, user.email);
    return { user: safeUser, token };
  }

  async signToken(userId: number, email: string) {
    return this.jwt.signAsync({ sub: userId, email });
  }

  async getUserSafe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}
