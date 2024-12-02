import request from 'supertest';
import express from 'express';
import routes from '@shared/infra/http/routes/index.routes';

describe('Index Routes', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(routes);
  });

  it('should return a message from GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Olá mundo' });
  });

  it('should return a message from GET /helloworld', async () => {
    const response = await request(app).get('/helloworld');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Olá mundo' });
  });

  it('should return 404 for an unknown route', async () => {
    const response = await request(app).get('/unknown');
    expect(response.status).toBe(404);
  });
});
