import { Module, forwardRef, UseGuards } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entity/user.entity';
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
    forwardRef(() => AuthModule),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'mabelle.waelchi@ethereal.email',
          pass: 'ppYurtYUwjEQz1GunX'
        }
      },
      defaults: {
        from: '"PEDRO PAULINO" <mabelle.waelchi@ethereal.email>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      }
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UserEntity],
      synchronize: (process.env.ENV === 'dev')
    })
  ],
  controllers: [AppController],
  // para passar o guard do throttler no provider é necessário realizar essa configuração do objeto
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})
export class AppModule { }
