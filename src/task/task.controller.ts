import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtAccessTokenGuard } from 'src/guard';
import { Role } from 'src/Task.enum';
import { TaskService } from './task.service';
import {TaskCreateDto} from 'src/dto/Task/TaskCreate.dto'
import { UserDocument } from 'src/schemas/User.schema';
import { TaskDeleteDto } from 'src/dto/Task/TaskDelete.dto';
@UseGuards(JwtAccessTokenGuard)
@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService){}    
        @Post('addTask')
        async CreateTask(@Body()  taskCreateDto : TaskCreateDto, @GetUser()  user: UserDocument ){
            
        return this.taskService.addTask(taskCreateDto, user)
        }



        @Post('RemoveTask')
        async removeTask(@Body()  TaskDeleteDto: TaskDeleteDto,@GetUser()  user: UserDocument){
        return this.taskService.removeTask(TaskDeleteDto, user)
        }

    
        
        

}