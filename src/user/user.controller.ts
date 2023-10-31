import { Body, Controller, Get, Param, Post, Put, Patch, Delete, ParseIntPipe, Res, UseInterceptors } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto copy";
import { UserService } from "./user.service";
import { Response } from "express";
import { LogInterceptor } from "src/interceptors/log.interceptor";
import { ParamId } from "src/decorators/param-id.decorator";

// interceptor pode ser usado em um controller, um metodo, ou até globalmente
// @UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post()
    async create(@Body() data: CreateUserDTO, @Res() res: Response) {
        const user = await this.userService.create(data)

        if (!user) {
            return res.status(400).json(user)
        }

        return res.status(201).json(user)
    }

    @Get()
    async read(@Res() res: Response) {
        const user = await this.userService.readAll()

        return res.status(200).json(user)
    }

    @Get(':id')
    //ParamId decorator personalizado
    async readOne(@ParamId() id: number, @Res() res: Response) {
        const user = await this.userService.readOne(id)

        if (!user) {
            return res.status(400).json(user)
        }

        return res.status(201).json(user)
    }

    @Put(':id')
    async update(@Body() data: UpdatePutUserDTO, @ParamId() id: number) {
        return this.userService.update(id, data)
    }

    @Patch(':id')
    async updatePartial(@Body() data: UpdatePatchUserDTO, @ParamId() id: number) {
        return this.userService.updatePartial(id, data)

    }

    @Delete(':id')
    //transformar o id em number sem o decorator personalizado
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id)
    }
}