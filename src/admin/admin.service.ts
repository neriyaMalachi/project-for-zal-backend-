import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminToUserDto } from 'src/dto/Admin/AddTaskToUser.dto';
import { TaskCreateDto } from 'src/dto/Task/TaskCreate.dto';
import { TaskDeleteDto } from 'src/dto/Task/TaskDelete.dto';
import { TaskDocument } from 'src/schemas/Task.schema';
import { UserDocument } from 'src/schemas/User.schema';
import { taskDictionary } from 'src/Task.enum';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class AdminService {
    constructor(@InjectModel('UserAuth') private readonly userModel: Model<UserDocument>, 
    private readonly taskService: TaskService) {}
    
    async userDetails(){
        const users = await this.userModel.find().select("username")
        return users
    }

    async allUsersTasks() {
        let users = []
        users = [...await this.userModel.find({}).exec()]
        const userPop = []
        for await (const user of users) userPop.push(await user.populate('tasks'))
        const userData = []
        userPop.forEach(user => userData.push({"username": user.username, "tasks":user.tasks, "id":user.id}))
        return userData
      }

      async addTask(AdminToUserDto: AdminToUserDto, TaskCreatedto: TaskCreateDto) {
        const user = await this.userModel.findById(AdminToUserDto.ownerId)        
        return await this.taskService.addTask(TaskCreatedto, user)
      }

      async removeTask(AdminToUserDto: AdminToUserDto, TaskDeleteDto: TaskDeleteDto){
        
        const user = await this.userModel.findById(AdminToUserDto.ownerId)

        return await this.taskService.removeTask(TaskDeleteDto, user)
      }
}
