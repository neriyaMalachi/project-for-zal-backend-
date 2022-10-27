import {
    MongooseModuleOptions,
    MongooseOptionsFactory,
  } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
    constructor(private config: ConfigService,) {}
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.config.get('DATABASE_URL')
    };
  }
}