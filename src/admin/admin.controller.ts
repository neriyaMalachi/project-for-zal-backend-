import { Controller , Get, Body, Post, UseGuards} from '@nestjs/common';
import { AdminToUserDto } from 'src/dto/Admin/AddTaskToUser.dto';
import { TaskCreateDto } from 'src/dto/Task/TaskCreate.dto';
import { TaskDeleteDto } from 'src/dto/Task/TaskDelete.dto';
import { JwtAdminAccessTokenGuard } from 'src/guard/AdminAccessToken.guard';
import { AdminService } from './admin.service';

@UseGuards(JwtAdminAccessTokenGuard)
@Controller('admin')
export class AdminController {
    constructor(private readonly  AdminService:  AdminService){} 
    @Get('userDetails')
    async userDetails(){
        return await this.AdminService.userDetails()
    }

    @Get('allUsersTasks')
    allUsersTasks(){
        console.log( this.AdminService.allUsersTasks());
    return this.AdminService.allUsersTasks()
    }
    @Post('addTask')
    async addTask(@Body() AdminToUserDto: AdminToUserDto, @Body() TaskCreatedto: TaskCreateDto ){
        return await this.AdminService.addTask(AdminToUserDto, TaskCreatedto)
    }

    @Post('removeTask')
    async removeTask(@Body() AdminToUserDto: AdminToUserDto, @Body()  TaskDeleteDto: TaskDeleteDto){
        return await this.AdminService.removeTask(AdminToUserDto, TaskDeleteDto)
    }
  }
