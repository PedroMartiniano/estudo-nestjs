import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto copy";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async create({ name, email, password, birthAt }: CreateUserDTO) {
        try {

            // const isEmailExist = await this.emailExists(email)

            // if (isEmailExist) {
            //     throw new BadRequestException('Email already exists')
            // }

            console.log({ name, email, password, birthAt })

            const user = await this.prisma.user.create({
                data: {
                    name,
                    email,
                    user_password: password,
                    birthAt
                }
            })

            return user

        } catch {
            return null
        }
    }

    async readAll() {
        // quando você da o retorno diretamente em uma promise, automaticamente ele já adiciona o await junto com o return 
        return this.prisma.user.findMany()
    }

    async readOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        })

        return user
    }

    async update(id: number, { name, email, password, birthAt }: UpdatePutUserDTO) {

        await this.userExists(id)

        return this.prisma.user.update({
            where: {
                id
            },
            data: {
                name,
                email,
                user_password: password,
                birthAt: birthAt ? birthAt : null
            }
        })
    }

    async updatePartial(id: number, { name, email, password, birthAt }: UpdatePatchUserDTO) {

        await this.userExists(id)

        return this.prisma.user.update({
            where: {
                id
            },
            data: {
                name,
                email,
                user_password: password,
                birthAt
            }
        })
    }

    async delete(id: number) {

        await this.userExists(id)

        return this.prisma.user.delete({
            where: {
                id
            }
        })
    }

    async userExists(id: number) {
        const isUserExist = await this.prisma.user.count({
            where: {
                id
            }
        })

        if (!isUserExist) {
            throw new NotFoundException(`O usuário ${id} não existe`)
        }
    }

    async emailExists(email: string) {
        const isEmailExists = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        return (isEmailExists) ? true : false
    }
}