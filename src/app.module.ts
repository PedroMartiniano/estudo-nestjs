import { Module, forwardRef, UseGuards } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

// decorator responsavel por passar os argumentos/parametros para a classe AppModule
@Module({
  imports: [
    ConfigModule.forRoot(),
    // throttler serve para verificar quantas requisições estão sendo feitas na api, podendo definir uma quantidade maxima dentro de um tempo limite, caso essa requisição maxima passar, ele bloqueará a requisição
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule)
  ],
  controllers: [AppController],
  // para passar o guard do throttler no provider é necessário realizar essa configuração do objeto
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})
export class AppModule { }
