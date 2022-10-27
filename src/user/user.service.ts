import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schemas/User.schema';
import { Rank, Role } from 'src/Task.enum';

@Injectable()
export class UserService {
    constructor(@InjectModel('UserAuth') private readonly userModel: Model<UserDocument>) {}

    /**
     * 
     * @returns all the users sorted by their score
     */
    async getUsers() {
      
        return this.userModel.find({}).sort('-score').exec();
      }
    /**
     * 
     * @param user verifed user data
     * @returns all the tasks the user has
     */
    async getTasks(user) {
      const userPopulated = await user.populate('tasks')
      return userPopulated.tasks
    }

    async getUser(user) {
      return {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    }
  }



 