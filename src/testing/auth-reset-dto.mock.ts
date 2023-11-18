import { AuthResetDTO } from "../auth/dto/auth-reset.dto";
import { resetToken } from "./reset-token.mock";

export const authResetDtoMock: AuthResetDTO = {
    password: '1234567',
    token: resetToken
}