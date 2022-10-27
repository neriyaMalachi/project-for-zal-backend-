import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task, TaskSchema } from '../schemas/Task.schema'
import { JwtModule } from '@nestjs/jwt';



@Module({
    imports: [MongooseModule.forFeature([{name: Task.name, schema: TaskSchema}])],
    providers: [TaskService],
    controllers: [TaskController]
})
export class TaskModule {}
