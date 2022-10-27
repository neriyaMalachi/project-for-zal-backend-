import { Module} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessTokenStrategy, JwtRefreshTokenStrategy, JwtAdminAccessTokenStrategy,JwtAdminRefreshTokenStrategy } from '../strategy';
import {UserAuth} from '../schemas/User.schema'
import {UserAuthSchema} from '../schemas/User.schema'

@Module({ 
    // חיבור לאטלס לפי סיסמא זהות וip
  imports: [MongooseModule.forFeature([{name: UserAuth.name, schema: UserAuthSchema}]),JwtModule.register({}) ],
  controllers: [AuthController],
  providers: [AuthService,JwtAccessTokenStrategy, JwtRefreshTokenStrategy,JwtAdminAccessTokenStrategy, JwtAdminRefreshTokenStrategy]
})
export class AuthModule {}
