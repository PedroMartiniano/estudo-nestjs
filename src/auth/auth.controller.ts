import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  Headers,
  UseGuards,
  Req,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { AuthGuard } from '../guards/auth.guard';
import { FileService } from '../file/file.service';
import { User } from '../decorators/user.decorator';
import { UserEntity } from '../user/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    const accessToken = await this.authService.login(email, password);

    return { accessToken };
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    const accessToken = await this.authService.register(body);
    return { accessToken };
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDTO) {
    const accessToken = await this.authService.reset(password, token);
    return { accessToken };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@User() user: UserEntity) {
    return user;
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @User() user: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 100 }), // max 100Kb
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    // const [, imagefile] = photo.mimetype.split('/')

    const filename = `photo-${user.id}.jpeg`;

    const result = await this.fileService.upload(photo, filename);

    return photo;
    return { success: result };
  }

  // enviando diversas arquivos em um campo só
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('files')
  async uploadFiles(
    @User() user,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return files;
  }

  // enviando diversos arquivos de diferentes campos
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'photo',
        maxCount: 1,
      },
      {
        name: 'documents',
        maxCount: 10,
      },
    ]),
  )
  @UseGuards(AuthGuard)
  @Post('files-fields')
  async uploadFilesFields(
    @User() user,
    @UploadedFiles()
    files: { photo: Express.Multer.File; documents: Express.Multer.File[] },
  ) {
    return files;
  }
}
