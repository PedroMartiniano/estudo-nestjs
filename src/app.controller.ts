import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

// aceita o parametro da rota do controller
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  setHello(): string {
    return `POST: Hello World!`;
  }
}
