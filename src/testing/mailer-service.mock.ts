import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../user/user.service';

export const mailerServiceMock = {
  provide: MailerService,
  useValue: {
    sendMail: jest.fn(),
  },
};
