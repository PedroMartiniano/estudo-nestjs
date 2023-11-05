import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { FileModule } from "src/file/file.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entity/user.entity";

@Module({
    imports: [
        JwtModule.register({
            secret: String(process.env.JWT_SECRET)
        }),
        forwardRef(() => UserModule),
        FileModule,
        TypeOrmModule.forFeature([UserEntity])
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule { }