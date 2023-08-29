import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users, userSchema } from './models/user.schema';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<Users>,
    private readonly jwtService: JwtService,
  ) {}
  async findByEmail(email: string): Promise<Users> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async register(registrationDto: CreateUserDto): Promise<Users> {
    const { email } = registrationDto;

    // Check if the user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = new this.userModel(registrationDto);
    return newUser.save();
  }

  async validateUser(loginDto: CreateUserDto): Promise<Users> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (user && user.password === password) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async generateToken(user: Users): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  create(createUserDto: CreateUserDto) {
    var model = new this.userModel(createUserDto);
    return model.save();
  }
  verify(token: string) {
    try {
      token = token.replace('Bearer ', '');
      const verif = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (verif) {
        const data = { message: 'Success' };
        return data;
      }
    } catch (err) {
      return err.message;
    }
  }

  findAll(): Promise<Users[]> {
    return this.userModel.find().exec();
  }

  findOne(id: string): Promise<Users> {
    return this.userModel.findById(id).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
