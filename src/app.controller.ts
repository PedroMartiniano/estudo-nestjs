import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

// aceita o parametro da rota do controller
@Controller('usuarios')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('1')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('2')
  setHello(): string {
    return `POST: Hello World!`;
  }
}
