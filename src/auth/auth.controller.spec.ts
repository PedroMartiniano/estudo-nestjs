import { Test, TestingModule } from "@nestjs/testing"
import { userServiceMock } from "../testing/user-service.mock"
import { AuthGuard } from "../guards/auth.guard"
import { guardMock } from "../testing/guar.mock"
import { RoleGuard } from "../guards/role.guard"
import { Response } from "express";
import { createUserDtoMock } from "../testing/create-user-dto.mock"
import { userEntityList } from "../testing/user-entity-list.mock"
import { updatePutUserDtoMock } from "../testing/update-put-user-dto.mock"
import { updatePatchUserDtoMock } from "../testing/update-patch-user-dto.mock"
import { AuthController } from "./auth.controller"
import { FileService } from "../file/file.service"
import { authServiceMock } from "../testing/auth-service.mock"
import { fileServiceMock } from "../testing/file-service.mock"
import { authLoginDtoMock } from "../testing/auth-login-dto.mock copy"
import { accessToken } from "../testing/token.mock"
import { authRegisterDtoMock } from "../testing/auth-register-dto.mock"
import { authForgetDtoMock } from "../testing/auth-forget-dto.mock"
import { authResetDtoMock } from "../testing/auth-reset-dto.mock"
import { getPhoto } from "../testing/get-photo.mock"


describe('AuthController', () => {

    let authController: AuthController
    let fileService: FileService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [authServiceMock, fileServiceMock]
        })
            .overrideGuard(AuthGuard)
            .useValue(guardMock)
            .compile()

        authController = module.get<AuthController>(AuthController)
    })

    test('validação de definição', () => {
        expect(authController).toBeDefined()
    })

    describe('Fluxo de autenticação', () => {
        test('login method', async () => {
            const res = await authController.login(authLoginDtoMock)

            expect(res).toEqual({ accessToken })
        })

        test('register method', async () => {
            const res = await authController.register(authRegisterDtoMock)

            expect(res).toEqual({ accessToken })
        })

        test('forget method', async () => {
            const res = await authController.forget(authForgetDtoMock)

            expect(res).toEqual(true)
        })

        test('reset method', async () => {
            const res = await authController.reset(authResetDtoMock)

            expect(res).toEqual({ accessToken })
        })
    })

    describe('Rotas autenticadas', () => {
        test('me method', async () => {
            const res = await authController.me(userEntityList[0])
            expect(res).toEqual(userEntityList[0])

        })

        test('upload photo method', async () => {
            const photo = await getPhoto()
            const res = await authController.uploadPhoto(userEntityList[0], photo)
            expect(res).toEqual(photo)

        })
    })
})