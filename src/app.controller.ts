import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}

  //works
  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);
    return this.appService.create({
      name,
      email,
      password: hashedPassword,
    });
  }
  //works with jwt
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.appService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    console.log(user);

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });

    //storing into cookie

    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      message: 'Login succ3esfully',
    };
  }
  //works
  @Get('users')
  async getAllUsers() {
    return this.appService.findAll();
  }
  //works
  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.appService.findOneById(id);
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserData: any) {
    console.log(id,updateUserData)
    return this.appService.update(id, updateUserData);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.appService.remove(id);
  }
}
