import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { userRepositoryMock } from '../testing/user-respository.mock';
import { jwtServiceMock } from '../testing/jwt-service.mock';
import { userServiceMock } from '../testing/user-service.mock';
import { mailerServiceMock } from '../testing/mailer-service.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { accessToken } from '../testing/token.mock';
import { jwtPayloadMock } from '../testing/jwt-payload.mock';
import { resetToken } from '../testing/reset-token.mock';
import { authRegisterDtoMock } from '../testing/auth-register-dto.mock';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        userRepositoryMock,
        jwtServiceMock,
        userServiceMock,
        mailerServiceMock,
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  test('Validar a definição', () => {
    expect(authService).toBeDefined();
  });

  describe('token', () => {
    test('createToken method', () => {
      const result = authService.createToken(userEntityList[0]);

      expect(result).toEqual({ accessToken });
    });

    test('checkToken method', () => {
      const result = authService.checkToken(accessToken);

      expect(result).toEqual(jwtPayloadMock);
    });

    test('isValidToken method', () => {
      const result = authService.isValidToken(accessToken);

      expect(result).toEqual(true);
    });
  });

  describe('Autenticação', () => {
    test('login method', async () => {
      const result = await authService.login('email@gmail.com', '123456');

      expect(result).toEqual({ accessToken });
    });

    test('forget method', async () => {
      const result = await authService.forget('email@gmail.com');

      expect(result).toEqual(true);
    });

    test('reset method', async () => {
      const result = await authService.reset('1234567', resetToken);

      expect(result).toEqual({ accessToken });
    });

    test('register method', async () => {
      const result = await authService.register(authRegisterDtoMock);

      expect(result).toEqual({ accessToken });
    });
  });
});
