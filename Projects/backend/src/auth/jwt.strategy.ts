import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // In a real app, use process.env.JWT_SECRET. 
      // For this assessment, we hardcode a fallback for simplicity if env is missing.
      secretOrKey: process.env.JWT_SECRET || 'secretKey', 
    });
  }

  async validate(payload: any) {
    // This attaches the "user" object to the Request
    return { userId: payload.sub, email: payload.username };
  }
}