import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: any) {
    // Check if user exists
    const existing = await (this.prisma as any).users.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('User already exists');

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await (this.prisma as any).users.create({
      data: {
        email: dto.email,
        password_hash: hashedPassword,
        full_name: dto.fullName,
      },
    });

    return { message: 'User registered successfully' };
  }

  async login(dto: any) {
    const user = await (this.prisma as any).users.findUnique({
      where: { email: dto.email },
    });

    // Validate password
    if (!user || !(await bcrypt.compare(dto.password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate Token
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.full_name }
    };
  }
}