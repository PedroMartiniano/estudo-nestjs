import { BadGatewayException, BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt'
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import * as bcrypt from 'bcrypt'
import { MailerService } from "@nestjs-modules/mailer/dist";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { UserEntity } from "../user/entity/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private readonly JWTService: JwtService,
        private readonly userService: UserService,
        private readonly mailer: MailerService,
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>
    ) { }

    createToken(user: any) {
        const accessToken = this.JWTService.sign({
            id: user.id,
            name: user.name,
            email: user.email
        },
            {
                expiresIn: '7d',
                subject: String(user.id),
                issuer: 'Login',
                audience: 'Users'
            })

        return accessToken
    }

    checkToken(token: string) {
        try {
            // para validar o token ele precisa estar com as mesmas informações de audience, issuer e outras também, de quando foi criado
            const data = this.JWTService.verify(token, {
                audience: 'Users',
                issuer: 'Login'
            })

            return data
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    isValidToken(token: string) {
        try {
            this.checkToken(token)
            return true
        } catch (e) {
            return false
        }
    }

    async login(email: string, password: string) {
        const user = await this.usersRepository.findOne({
            where: {
                email
            }
        })

        if (!user) {
            throw new UnauthorizedException('Email ou senha incorretos.')
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.user_password)

        if (!isPasswordCorrect) {
            throw new UnauthorizedException('Email ou senha incorretos.')
        }

        return this.createToken(user)
    }

    async forget(email: string) {

        const user = await this.usersRepository.findOne({
            where: {
                email
            }
        })

        if (!user) {
            throw new UnauthorizedException('Email incorreto.')
        }

        const token = this.JWTService.sign({ id: user.id }, { expiresIn: '30 minutes', issuer: 'forget', audience: 'users' })

        try {
            await this.mailer.sendMail({
                subject: 'Recuperação de Senha',
                to: 'pedropmartiniano@gmail.com',
                template: 'forget',
                context: {
                    name: user.name,
                    token
                }
            })

            return true
        } catch (e) {
            throw new BadGatewayException(e)
        }
    }

    async reset(password: string, token: string) {

        try {
            // para validar o token ele precisa estar com as mesmas informações de audience, issuer e outras também, de quando foi criado
            const data: any = this.JWTService.verify(token, {
                issuer: 'forget',
                audience: 'users'
            })

            const id = Number(data.id)

            if (isNaN(id)) {
                throw new BadRequestException("Token inválido")

            }

            const salt = await bcrypt.genSalt()

            const hashPassword = await bcrypt.hash(password, salt)

            await this.usersRepository.update(id, {
                user_password: hashPassword
            })

            const user = await this.userService.readOne(id)

            return this.createToken(user)
        } catch (e) {
            throw new BadRequestException(e)
        }

    }

    async register(data: AuthRegisterDTO) {
        try {
            delete data.role

            const user = await this.userService.create(data)

            if (user instanceof BadRequestException) {
                throw new BadRequestException('Erro ao cadastrar usuário.')
            }

            const token = this.createToken(user)

            return token
        } catch (e) {
            return e
        }


    }
}