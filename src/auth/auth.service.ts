import { ForbiddenException, Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon from 'argon2'
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserDocument, UserAuth } from '../schemas/User.schema';
import { UserCreateDto } from '../dto/User/UserCreate.dto';
import {UserLoginDto} from '../dto/User/UserLogin.dto';
import { Cache } from 'cache-manager';
@Injectable()
export class AuthService {
    constructor(private jwt: JwtService,
      private config: ConfigService,
      @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,  
      @InjectModel('UserAuth') private readonly userModel: Model<UserDocument>) {}

      /**
       * @param userCreatedto  signup data about the user
       * @returns  the refreshToken and the accessToken
       */
    async signUp(userCreatedto: UserCreateDto): Promise<{access_token: string,refresh_token:string}> {
      try{
        userCreatedto.hash = await argon.hash(userCreatedto.password);
        delete userCreatedto.password

      const newUser = new this.userModel(userCreatedto);
      const result = await newUser.save();
      if(result.isAdmin) return this.generateAdminTokens(result.id, result.username)
      return this.generateTokens(result.id, result.username)

      }
      catch(error){
             console.log(error) 
           }
  }

  
  /**
   * @param userLoginDto login data about the user
   * @returns  the refreshToken and the accessToken
   */
  async login(userLoginDto: UserLoginDto) {
    const result = await this.userModel.find({username: userLoginDto.username}).exec()
    if(!result) return undefined

    const data = result[0]; // a way the access the user's features
    if(!data) return undefined
    const pwMatches = await argon.verify(data.hash,userLoginDto.password) // checks if the password entered matches with the matching user
      if(!pwMatches) return undefined
      if(data.isAdmin) return this.generateAdminTokens(data.id, data.username)
      return this.generateTokens(data.id, data.username)
    }


    // async signUp(username: string, password: string){
    //   try{
        
    //     const hash = await argon.hash(password)
    //     const user = new this.userModel({
    //       username,
    //       hash
    //     })
    //     const result = await user.save()
    //     return this.signToken(result.id, username)
    //   }
    //   catch(error){
    //     console.log(error)
    //   }
    // }



    // async login(username: string, password: string) {
    //   const result = await this.userModel.find({username: username}).exec()
    //   if(!result) throw new ForbiddenException('Credentials incorrect')
    //   const data = result[0];
    //   const pwMatches = await argon.verify(data.hash, password)
    //     if(!pwMatches) throw new ForbiddenException('Credentials incorrect')
    //     return this.signToken(data.id, data.username)
    //   }

    /**
     * @param user a verifed user data
     * @return a new accessToken
     */
    async refreshTokens(user): Promise<{access_token: string}> {
      if(user.isAdmin){
        console.log('admin');
        
        return this.generateAdminAccessToken(user._id, user.username)

      }
      
        return this.generateAccessToken(user._id, user.username)
      
     
    }



    /**
     * 
     * @param userId the id of the user
     * @param username the username
     * @returns a new accessToken
     */
    async generateAccessToken(userId: string, username: string): Promise<{access_token: string}>{
        const payload = {
          sub: userId, 
          username, 
      }
      const accsesSecret = this.config.get('JWT_SECRET')
      const accessToken = await this.jwt.signAsync(payload, {expiresIn: '1h',
      secret: accsesSecret})
      return {
        access_token: accessToken
      }

      }

      async generateAdminAccessToken(userId: string, username: string): Promise<{access_token: string}>{
        const payload = {
          sub: userId, 
          username, 
      }
      const accsesSecret = this.config.get('ADMIN_SECRET')
      const accessToken = await this.jwt.signAsync(payload, {expiresIn: '1h',
      secret: accsesSecret})
      return {
        access_token: accessToken
      }

      }


      /**
       * 
       * @param userId the id of the user
       * @param username the username
       * @returns a new refreshToken
       */
      async generateRefreshToken(userId: string, username: string): Promise<{refresh_token: string}>{
        const payload = {
          sub: userId, 
          username, 
      }

      const refreshSecret = this.config.get('REF_SECRET')
      const refreshToken = await this.jwt.signAsync(payload, {expiresIn: '1d',
      secret: refreshSecret})
      return {refresh_token: refreshToken}
      }

      async generateAdminRefreshToken(userId: string, username: string): Promise<{refresh_token: string}>{
        const payload = {
          sub: userId, 
          username, 
      }

      const refreshSecret = this.config.get('REF_ADMIN')
      const refreshToken = await this.jwt.signAsync(payload, {expiresIn: '1d',
      secret: refreshSecret})
      return {refresh_token: refreshToken}
      }


      /**
       * 
       * @param userId the id of the user
       * @param username the username
       * @returns a new refreshToken and accessToken
       */
      async generateTokens(userId: string, username: string): Promise<{access_token: string,refresh_token:string, isAdmin: boolean}>{
        const accessToken = (await this.generateAccessToken(userId, username)).access_token;
        const refreshToken = (await this.generateRefreshToken(userId, username)).refresh_token;
        // await this.cacheManager.set("access_token", {accessToken}, {ttl: 10000})
        // await this.cacheManager.set("refresh_token", {refreshToken}, {ttl: 10000})

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            isAdmin: false
        }
    }
      async generateAdminTokens(userId: string, username: string): Promise<{access_token: string,refresh_token:string, isAdmin: boolean}>{
        const accessToken = (await this.generateAdminAccessToken(userId, username)).access_token;
        const refreshToken = (await this.generateAdminRefreshToken(userId, username)).refresh_token;
        // await this.cacheManager.set("admin_access_token", {accessToken}, {ttl: 10000})
        // await this.cacheManager.set("admin_refresh_token", {refreshToken}, {ttl: 10000})
        
        return {
            access_token: accessToken,
            refresh_token: refreshToken, 
            isAdmin: true
        }
    }
}
