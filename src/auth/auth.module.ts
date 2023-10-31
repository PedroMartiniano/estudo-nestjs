import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "src/user/user.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [
        JwtModule.register({
            secret: '9ce7cf0a-066b-44ff-bbb3-9e4bdacbf8b0'
        }),
        UserService,
        PrismaModule
    ],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule { }