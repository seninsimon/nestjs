import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './models/user.schema';
import * as bcrypt from 'bcrypt'
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService : JwtService
    ) { }

    //register
    async register(name: string, email: string, password: string) {

        const existingUser = await this.userModel.findOne({ email })

        if (existingUser) {
            throw new BadRequestException("User already exists")
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await this.userModel.create({ name, email, password: hashedPassword })
        return {
            message: "User registered successfully",
            user: newUser
        }
    }

    //login
    async login(email: string, password: string) {
        const user = await this.userModel.findOne({ email })
        if (!user) {
            throw new BadRequestException("User not found")
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            throw new BadRequestException("Invalid credentials")
        }

        const payload = {sub : user._id , username : user.name}
        const token = this.jwtService.sign(payload)

        return {
            message: "Login successful",
            user,
            token
        }
    }
}
