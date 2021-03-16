import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcryptjs'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto) {
        const { username, password } = authCredentialsDto
        const user = this.create()
        user.username = username
        user.salt = await bcrypt.genSalt()
        user.password = await this.hashPassword(password, user.salt)
        try {
            await user.save()
        }
        catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists !')
            }
            else {
                throw new InternalServerErrorException()
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto) {
        const { username, password } = authCredentialsDto
        const user = await this.findOne({ username })
        if(user) {
            const result = await user.validatePassword(password)
            if(result){
                return username
            }
            else {
                return null
            }
        }
        else {
            return null
        }
    }

    async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }
}