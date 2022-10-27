import { Task } from "src/schemas/Task.schema"
import { IsNotEmpty , IsIn, IsEnum, IsString, IsNumber} from "class-validator"


export class UserCreateDto{
    @IsNotEmpty()
    @IsString()
    id: string
    
    @IsNotEmpty()
    @IsString()
    username: string
    
    
    @IsNotEmpty()
    @IsString()
    password: string
    
    
    @IsNotEmpty()
    @IsString()
    hash: string
    
    
    tasks: Task[]
    
    
    score: Number

    isAdmin: boolean
}