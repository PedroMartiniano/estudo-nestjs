import { Body, Controller, Post, Get, Res, Headers, UseGuards, Req, BadRequestException, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from "@nestjs/common";
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
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { FileService } from "src/file/file.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly fileService: FileService
    ) { }

    @Post('login')
    async login(@Body() { email, password }: AuthLoginDTO, @Res() res: Response) {
        const token = await this.authService.login(email, password)

        return res.status(201).json({ token })
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDTO, @Res() res: Response) {
        const token = await this.authService.register(body)

        if (token instanceof BadRequestException) {
            return res.status(400).json(token.getResponse())
        }

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
    async me(@User() user) {
        return { user }
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadPhoto(@User() user, @UploadedFile(new ParseFilePipe({
        validators: [
            new FileTypeValidator({ fileType: 'image/*' }),
            new MaxFileSizeValidator({maxSize: 1024 * 100}) // max 100Kb
        ]
    })) photo: Express.Multer.File) {

        const [, imagefile] = photo.mimetype.split('/')

        const path = join(__dirname, '../../storage/photos', `photo-${user.id}.${imagefile}`)

        const result = await this.fileService.upload(photo, path)

        return { photo }
        return { success: result }
    }

    // enviando diversas arquivos em um campo só
    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuard)
    @Post('files')
    async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]) {
        return files
    }

    // enviando diversos arquivos de diferentes campos
    @UseInterceptors(FileFieldsInterceptor([{
        name: 'photo',
        maxCount: 1
    }, {
        name: 'documents',
        maxCount: 10
    }
    ]))
    @UseGuards(AuthGuard)
    @Post('files-fields')
    async uploadFilesFields(@User() user, @UploadedFiles() files: { photo: Express.Multer.File, documents: Express.Multer.File[] }) {
        return files
    }
}