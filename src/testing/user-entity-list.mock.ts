import { Role } from "../enums/role.enum";
import { UserEntity } from "../user/entity/user.entity";

export const userEntityList: UserEntity[] = [
    {
        id: 1,
        birthAt: '2000-01-01',
        email: 'email@gmail.com',
        name: 'Pedro Paulino',
        user_password: '$2b$10$Izm65s.z2aIS75hhe7P8n.cnuhbdhyUQAUQQDD7BopavIebIQryVa',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        birthAt: '2000-01-01',
        email: 'email2@gmail.com',
        name: 'Pedro 2',
        user_password: '$2b$10$Izm65s.z2aIS75hhe7P8n.cnuhbdhyUQAUQQDD7BopavIebIQryVa',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 3,
        birthAt: '2000-01-01',
        email: 'email3@gmail.com',
        name: 'Pedro 3',
        user_password: '$2b$10$Izm65s.z2aIS75hhe7P8n.cnuhbdhyUQAUQQDD7BopavIebIQryVa',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date()
    },
]