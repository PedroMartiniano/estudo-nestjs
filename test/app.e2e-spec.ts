import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { authRegisterDtoMock } from '../src/testing/auth-register-dto.mock';
import { accessToken } from '../src/testing/token.mock';
import { Role } from '../src/enums/role.enum';
import dataSource from '../typeorm/data-source';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('Registrar um novo usuário', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(authRegisterDtoMock)
      .expect(201);

    expect(res.statusCode).toEqual(201);
    expect(typeof res.body.accessToken).toEqual('string');
  });

  it('Tentar fazer login com o novo usuário', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: authRegisterDtoMock.email,
        password: authRegisterDtoMock.password,
      })
      .expect(201);

    expect(res.statusCode).toEqual(201);
    expect(typeof res.body.accessToken).toEqual('string');

    token = res.body.accessToken;
  });

  it('Obter os dados do usuário logado', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(typeof res.body.id).toEqual('number');
    expect(res.body.role).toEqual(Role.User);
  });

  it('Registrar um novo usuário como adm', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...authRegisterDtoMock,
        role: Role.Admin,
        email: 'test@gmail.com',
      })
      .expect(201);

    expect(res.statusCode).toEqual(201);
    expect(typeof res.body.accessToken).toEqual('string');

    token = res.body.accessToken;
  });

  it('validar a Role do usuário logado como user padrão', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(typeof res.body.id).toEqual('number');
    expect(res.body.role).toEqual(Role.User);

    userId = res.body.id;
  });

  it('Tentar ver a lista de todos os usuários, com erro', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);

    expect(res.body.error).toEqual('Forbidden');
  });

  it('Alterando manualmente o usuário para a função administrador', async () => {
    const db = await dataSource.initialize();

    const queryRunner = db.createQueryRunner();

    await queryRunner.query(`
    UPDATE users SET role = ${Role.Admin} WHERE id = ${userId};
  `);

    const rows = await queryRunner.query(`
    SELECT * FROM users WHERE id = ${userId};
  `);

    db.destroy();

    expect(rows.length).toEqual(1);
    expect(rows[0].role).toEqual(Role.Admin);
  });

  it('Tentar ver a lista de todos os usuários, agora com acesso', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.length).toEqual(2);
  });
});
