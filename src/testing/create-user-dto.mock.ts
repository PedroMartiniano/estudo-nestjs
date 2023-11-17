import { Role } from "../enums/role.enum";
import { createUserDTO } from "../user/dto/create-user.dto";

export const createUserDtoMock: createUserDTO = {
    birthAt: '2000-01-01',
    email: 'email@gmail.com',
    name: 'Pedro Paulino',
    password: '123456',
    role: Role.User
}