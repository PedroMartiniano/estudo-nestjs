import { Role } from "../enums/role.enum";
import { UpdatePutUserDTO } from "../user/dto/update-put-user.dto";

export const updatePutUserDtoMock: UpdatePutUserDTO = {
    birthAt: '2000-01-01',
    email: 'email@gmail.com',
    name: 'Pedro Paulino',
    password: '123456',
    role: Role.User
}