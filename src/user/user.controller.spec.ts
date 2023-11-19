import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { userServiceMock } from '../testing/user-service.mock';
import { AuthGuard } from '../guards/auth.guard';
import { guardMock } from '../testing/guar.mock';
import { RoleGuard } from '../guards/role.guard';
import { UserService } from './user.service';
import { createUserDTO } from './dto/create-user.dto';
import { Response } from 'express';
import { createUserDtoMock } from '../testing/create-user-dto.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { updatePutUserDtoMock } from '../testing/update-put-user-dto.mock';
import { updatePatchUserDtoMock } from '../testing/update-patch-user-dto.mock';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .overrideGuard(RoleGuard)
      .useValue(guardMock)
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  test('validação de definição', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('teste da aplicação dos guards', () => {
    test('Se os guards estão aplicados', () => {
      const guards = Reflect.getMetadata('__guards__', UserController);

      expect(guards.length).toEqual(2);
      expect(new guards[0]()).toBeInstanceOf(AuthGuard);
      expect(new guards[1]()).toBeInstanceOf(RoleGuard);
    });
  });

  describe('Create', () => {
    test('Create method', async () => {
      const res = await userController.create(createUserDtoMock);

      expect(res).toEqual(userEntityList[0]);
    });
  });

  describe('Read', () => {
    test('ReadAll method', async () => {
      const res = await userController.read();

      expect(res).toEqual(userEntityList);
    });

    test('ReadOne method', async () => {
      const res = await userController.readOne(1);

      expect(res).toEqual(userEntityList[0]);
    });
  });

  describe('Update', () => {
    test('update method', async () => {
      const res = await userController.update(updatePutUserDtoMock, 1);

      expect(res).toEqual(userEntityList[0]);
    });

    test('updatePartial method', async () => {
      const res = await userController.updatePartial(updatePatchUserDtoMock, 1);

      expect(res).toEqual(userEntityList[0]);
    });
  });

  describe('Delete', () => {
    test('delete method', async () => {
      const res = await userController.delete(1);

      expect(res).toEqual({ success: true });
    });
  });
});
