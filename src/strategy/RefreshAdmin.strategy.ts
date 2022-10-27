import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import {
  ExtractJwt,
  Strategy, 
} from 'passport-jwt';
import { UserDocument } from 'src/schemas/User.schema';


@Injectable()
export class JwtAdminRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'ref-admin',
) {
  constructor(
    config: ConfigService,
      @InjectModel('UserAuth') private readonly userModel: Model<UserDocument>) 
   {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('REF_ADMIN'),
    });
  }

  /**
   * 
   * @param payload the data included in the token 
   * @returns the verified user
   */
  async validate(payload: {
    sub: number;
    username: string;
  }) {
    const result = await this.userModel.findById(payload.sub)
    const user = result;
    if(user.hash) delete user.hash;
    return user;
  }
}