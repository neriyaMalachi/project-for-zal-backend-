import { Body, Controller, Get,HttpCode,Post ,UseGuards } from '@nestjs/common';
import { UserCreateDto } from 'src/dto//User/UserCreate.dto';
import { UserLoginDto } from 'src/dto/User/UserLogin.dto';
import { UserDocument } from 'src/schemas/User.schema';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { JwtRefreshTokenGuard , JwtRefreshAdminTokenGuard} from '../guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    async signup(@Body()  userCreatedto : UserCreateDto){
        return this.authService.signUp(userCreatedto);
    }
    
    @Post('login')
    async login(@Body() userLoginDto: UserLoginDto){
        return this.authService.login(userLoginDto);
    }

    // @UseGuards(JwtRefreshTokenGuard)
    // @Get('logout')
    // logout(){

    // }
        


    @UseGuards(JwtRefreshTokenGuard)
    @HttpCode(201)
    @Get('refresh')
    refresh(@GetUser() user: UserDocument) {
    return this.authService.refreshTokens(user)
    }
}

    // @Post('login')
    // async login(
    //     @Body ('username') username:string,
    //     @Body ('password') password:string,
    //     ){
    //     return this.authService.login(username, password)
    // }
    // @Post('signup')
    // async signup(
    // @Body ('username') username:string,
    // @Body ('password') password:string,){
    //     return this.authService.signUp(username, password)
    // }

