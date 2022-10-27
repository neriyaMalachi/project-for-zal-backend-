import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema, Task } from 'src/schemas/Task.schema';
import { UserAuth, UserAuthSchema } from 'src/schemas/User.schema';
import { TaskService } from 'src/task/task.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [MongooseModule.forFeature([{name: UserAuth.name, schema: UserAuthSchema}]), JwtModule.register({}),
   MongooseModule.forFeature([{name: Task.name, schema: TaskSchema}])],
  controllers: [AdminController],
  providers: [AdminService, TaskService]
})
export class AdminModule {}
