import { Module} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserAuth, UserAuthSchema } from 'src/schemas/User.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: UserAuth.name, schema: UserAuthSchema}]), JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
