import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module';
import {UserModule} from './user/user.module';
import { TaskModule } from './task/task.module';
import { MongooseConfigService } from './mongoose.service';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),AuthModule,UserModule, TaskModule, MongooseModule.forRootAsync({useClass: MongooseConfigService}), 
  CacheModule.register({store: redisStore,
    host: 'localhost', //default host
    port: 6379, //default port
    isGlobal: true 
  }), AdminModule],
})
export class AppModule {}