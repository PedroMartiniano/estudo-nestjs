import { UserService } from "../user/user.service";
import { userEntityList } from "./user-entity-list.mock";

export const userServiceMock = {

    provide: UserService,
    useValue: {
        readAll: jest.fn().mockResolvedValue(userEntityList),
        readOne: jest.fn().mockResolvedValue(userEntityList[0]),
        create: jest.fn().mockResolvedValue(userEntityList[0]),
        update: jest.fn().mockResolvedValue(userEntityList[0]),
        updatePartial: jest.fn().mockResolvedValue(userEntityList[0]),
        delete: jest.fn().mockResolvedValue(true),
        userExists: jest.fn().mockResolvedValue(true),
        emailExists: jest.fn().mockResolvedValue(true),
    }
}