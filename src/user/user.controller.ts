import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Patch,
  Param,
  Headers,
  Delete,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../authentication/decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('findbymail/:email')
  async findByEmail(@Param('email') email: any) {
    console.log(email);
    const user = await this.userService.findByEmail(email);
    return user;
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: CreateUserDto): Promise<any> {
    const user = await this.userService.validateUser(loginDto);
    const token = await this.userService.generateToken(user);
    return { token };
  }
  @Public()
  @Post('register')
  async register(@Body() registrationDto: CreateUserDto): Promise<any> {
    console.log(registrationDto);
    const user = await this.userService.register(registrationDto);
    return { message: 'Registration successful', user };
  }

  @Get('login')
  async getlogin(@Headers('authorization') token: string, @Res() res) {
    console.log(token);
    try {
      const verif = this.userService.verify(token);
      res.json(verif);
    } catch (error) {
      throw new UnauthorizedException('Data not found');
    }
  }
  @Post()
  create(@Body() createUserDto: CreateUserDto) {}

  @Public()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
