import { Body, Controller, Post, Get, Res, Headers, UseGuards, Req } from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { AuthMeDTO } from "./dto/auth-me.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decorators/user.decorator";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() { email, password }: AuthLoginDTO, @Res() res: Response) {
        const token = await this.authService.login(email, password)

        return res.status(201).json({ token })
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDTO, @Res() res: Response) {
        const token = await this.authService.register(body)

        return res.status(201).json({ token })
    }

    @Post('forget')
    async forget(@Body() { email }: AuthForgetDTO) {
        return this.authService.forget(email)
    }

    @Post('reset')
    async reset(@Body() { password, token }: AuthResetDTO) {
        return this.authService.reset(password, token)
    }

    @UseGuards(AuthGuard)
    @Get('me')
    async me(@User('emaila') email) {
        return { email: email }
    }
}