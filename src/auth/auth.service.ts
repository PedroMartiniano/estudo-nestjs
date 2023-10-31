import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(private readonly JWTSerivce: JwtService, private readonly prisma: PrismaService) { }

    async createToken() {
        // return this.JWTSerivce.sign()
    }

    async checkToken(token: string) {
        // return this.JWTSerivce.verify()
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

        return user
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
        await this.prisma.user.update({
            where: {
                id
            },
            data: {
                user_password: password
            }
        })
    }
}