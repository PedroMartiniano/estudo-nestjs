import { Body, Controller, Get, Param, Post, Put, Patch, Delete, ParseIntPipe, Res, UseInterceptors, BadRequestException, UseGuards } from "@nestjs/common";
import { createUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto copy";
import { UserService } from "./user.service";
import { Response } from "express";
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import { RoleGuard } from "../guards/role.guard";
import { AuthGuard } from "../guards/auth.guard";
import { Role } from "../enums/role.enum";
import { Roles } from "../decorators/role.decorator";
import { ParamId } from "../decorators/param-id.decorator";

// interceptor pode ser usado em um controller, um metodo, ou até globalmente
// @UseInterceptors(LogInterceptor)
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) { }

    // para sobreescrever a configuração enviada no module geral do throttler apenas para essa requisição
    @Throttle(20, 60)
    @Roles(Role.Admin)
    @Post()
    async create(@Body() data: createUserDTO) {
        return this.userService.create(data)

        // if (user instanceof BadRequestException) {
        //     return res.status(400).json(user.getResponse())
        // }

        // return res.status(201).json(user)
    }

    // para ignorar a requisição limite do throttler
    @SkipThrottle()
    @Roles(Role.Admin)
    @Get()
    async read() {
        return this.userService.readAll()

        // return res.status(200).json(user)
    }

    @Get(':id')
    //ParamId decorator personalizado
    async readOne(@ParamId() id: number) {
        return this.userService.readOne(id)

        // if (!user) {
        //     return res.status(400).json(user)
        // }

        // return res.status(201).json(user)
    }

    @Roles(Role.Admin)
    @Put(':id')
    async update(@Body() data: UpdatePutUserDTO, @ParamId() id: number) {
        return this.userService.update(id, data)
    }

    @Roles(Role.Admin)
    @Patch(':id')
    async updatePartial(@Body() data: UpdatePatchUserDTO, @ParamId() id: number) {
        return this.userService.updatePartial(id, data)

    }

    @Roles(Role.Admin)
    @Delete(':id')
    //transformar o id em number sem o decorator personalizado
    async delete(@Param('id', ParseIntPipe) id: number) {
        return {
            success: await this.userService.delete(id)
        }
    }
}