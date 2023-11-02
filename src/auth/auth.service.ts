import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt'
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private readonly JWTSerivce: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UserService) { }

    createToken(user: User) {
        return this.JWTSerivce.sign({
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
            const data = this.JWTSerivce.verify(token, {
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
                email,
                user_password: password
            }
        })

        if (!user) {
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

        return true
    }

    async reset(password: string, token: string) {

        const id = 0

        const user = await this.prisma.user.update({
            where: {
                id
            },
            data: {
                user_password: password
            }
        })

        return this.createToken(user)
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