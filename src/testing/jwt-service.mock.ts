import { accessToken } from './token.mock';
import { JwtService } from '@nestjs/jwt';
import { jwtPayloadMock } from './jwt-payload.mock';

export const jwtServiceMock = {
  provide: JwtService,
  useValue: {
    sign: jest.fn().mockReturnValue({
      accessToken,
    }),
    verify: jest.fn().mockReturnValue(jwtPayloadMock),
  },
};
