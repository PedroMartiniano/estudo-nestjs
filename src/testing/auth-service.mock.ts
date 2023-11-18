import { AuthService } from "../auth/auth.service";
import { FileService } from "../file/file.service";
import { jwtPayloadMock } from "./jwt-payload.mock";
import { accessToken } from "./token.mock";

export const authServiceMock = {

    provide: AuthService,
    useValue: {
        createToken: jest.fn().mockReturnValue(accessToken),
        checkToken: jest.fn().mockReturnValue(jwtPayloadMock),
        isValidToken: jest.fn().mockReturnValue(true),
        login: jest.fn().mockResolvedValue(accessToken),
        forget: jest.fn().mockResolvedValue(true),
        reset: jest.fn().mockResolvedValue(accessToken),
        register: jest.fn().mockResolvedValue(accessToken),
    }
}