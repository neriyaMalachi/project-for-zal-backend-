import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Task, TaskDocument} from '../schemas/Task.schema'
import {TaskCreateDto} from 'src/dto/Task/TaskCreate.dto'
import { Rank, Role, taskDictionary } from 'src/Task.enum';
import { TaskDeleteDto } from 'src/dto/Task/TaskDelete.dto';
@Injectable()
export class TaskService {
    constructor(@InjectModel('Task') private readonly taskModel: Model<TaskDocument>){}

    /**
     * 
     * @param TaskCreatedto information about a task to create it
     * @param owner the owner creating the task
     * @returns the task created
     */
    async addTask(TaskCreatedto: TaskCreateDto, owner): Promise<Task> {// 
      TaskCreatedto.owner = owner._id
      let newTask = new this.taskModel(TaskCreatedto);
      let newOwner = await owner.populate('tasks')

      
      if(newOwner.tasks.length>=1){
      for await (const task of newOwner.tasks){
        const flag = await this.areRangesOverLapping(newTask, task)        
        if( flag){          
          newTask.error = 'date_collision'
          return newTask
        }
      }
    }
      
        
      

      
      const result = await newTask.save();
      owner.tasks.push(result._id)
      const type = newTask.type
      const score = owner.score + taskDictionary[type]
      await owner.updateOne({score: score})
      await this.taskCalc(owner)
      await owner.save()
      return result;
  } 
 //(StartDate1 <= EndDate2) && (StartDate2 <= EndDate1)
  async areRangesOverLapping(a, b){    
    return Math.max(a.startDate,b.startDate) <=Math.min(a.endDate,b.endDate)
  }


  /**
   * 
   * @param TaskDeleteDto information about a task to delete it
   */

  async removeTask(TaskDeleteDto: TaskDeleteDto, owner){
   const task = await this.taskModel.findById(TaskDeleteDto.id);
    
   if(task){
   const type = task.type
   const score = owner.score - taskDictionary[type]
   await owner.updateOne({score: score})
   owner.tasks = owner.tasks.filter(t=> t._id.toString() !== TaskDeleteDto.id);
   
   await this.taskModel.findByIdAndDelete(TaskDeleteDto.id);
   await owner.save();
   return {id:TaskDeleteDto.id, ownerId:owner.id }
   }
   return undefined;
  }
  

   /**
    * 
    * @param user a verifed user data
    */ 
   async taskCalc(user) {
      const total = user.score
      switch(true){
        case total == 0:
          await user.updateOne({type: Rank.NOTHING})
          break
        case total <= 5:
          await user.updateOne({type: Rank.YOUNG})
          break
        case total <= 10:
          await user.updateOne({type: Rank.MID})
          break
        case total <= 20:
          await user.updateOne({type: Rank.LARGE})
          break
        case total >= 25:
          await user.updateOne({type: Rank.HUGE})
          break
      } 
    }
}
