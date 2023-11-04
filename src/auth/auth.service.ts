import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt'
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt'
import { MailerService } from "@nestjs-modules/mailer/dist";
import { NOTFOUND } from "dns";

@Injectable()
export class AuthService {
    constructor(
        private readonly JWTService: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly mailer: MailerService
    ) { }

    createToken(user: User) {
        return this.JWTService.sign({
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
        const user = await this.prisma.user.findFirst({
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
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            }
        })

        if (!user) {
            throw new UnauthorizedException('Email incorreto.')
        }

        const token = this.JWTService.sign({ id: user.id }, { expiresIn: '30 minutes', issuer: 'forget', audience: 'users' })

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
    }

    async reset(password: string, token: string) {

        try {
            // para validar o token ele precisa estar com as mesmas informações de audience, issuer e outras também, de quando foi criado
            const data: any = this.JWTService.verify(token, {
                issuer: 'forget',
                audience: 'users'
            })

            if (isNaN(Number(data.id))) {
                throw new BadRequestException("Token inválido")

            }

            const salt = await bcrypt.genSalt()

            const hashPassword = await bcrypt.hash(password, salt)

            const user = await this.prisma.user.update({
                where: {
                    id: Number(data.id)
                },
                data: {
                    user_password: hashPassword
                }
            })

            return { token: this.createToken(user) }
        } catch (e) {
            throw new BadRequestException(e)
        }

    }

    async register(data: AuthRegisterDTO) {
        try {
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