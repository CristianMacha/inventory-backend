import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth endpoints (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 400 when body is empty', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 400 when idToken is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ wrongField: 'value' });

      expect(res.status).toBe(400);
    });

    it('should return 401 when idToken is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ idToken: 'invalid-firebase-token' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/health', () => {
    it('should return 200 on health check', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/health');

      expect(res.status).toBe(200);
    });
  });
});
