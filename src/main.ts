import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { LogInterceptor } from './interceptors/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()

  app.useGlobalPipes(new ValidationPipe())
  
  // para adicionar o interceptor de log de tempo de execução globalmente(em todas as rotas)
  app.useGlobalInterceptors(new LogInterceptor())

  await app.listen(3000)
}
bootstrap()
