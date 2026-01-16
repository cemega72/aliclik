import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async list() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
      orderBy: { id: 'desc' },
    });
  }

  async get(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(input: { email: string; password: string; name?: string }) {
    const exists = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (exists) throw new BadRequestException('Email already in use');

    const passwordHash = await bcrypt.hash(input.password, 12);
    return this.prisma.user.create({
      data: { email: input.email, name: input.name, passwordHash },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });
  }

  async update(id: number, input: { email?: string; password?: string; name?: string }) {
    await this.get(id);

    let passwordHash: string | undefined;
    if (input.password) passwordHash = await bcrypt.hash(input.password, 12);

    return this.prisma.user.update({
      where: { id },
      data: {
        email: input.email,
        name: input.name,
        ...(passwordHash ? { passwordHash } : {}),
      },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });
  }

  async delete(id: number) {
    await this.get(id);
    await this.prisma.user.delete({ where: { id } });
    return { ok: true };
  }
}
