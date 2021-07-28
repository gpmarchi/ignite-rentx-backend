import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('CreateCategoryController', () => {
  beforeAll(async () => {
    connection = await createConnection('test-connection');

    await connection.query('DROP TABLE IF EXISTS rentals');
    await connection.query('DROP TABLE IF EXISTS car_images');
    await connection.query('DROP TABLE IF EXISTS specifications_cars');
    await connection.query('DROP TABLE IF EXISTS cars');
    await connection.query('DROP TABLE IF EXISTS categories');
    await connection.query('DROP TABLE IF EXISTS specifications');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM categories');
    await connection.query('DELETE FROM users');

    const id = uuid();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, is_admin, created_at, driver_license)
				VALUES('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXX')
			`,
    );
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to create a new category', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const insertionResponse = await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(insertionResponse.status).toBe(201);

    const listResponse = await request(app).get('/categories');

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.length).toBe(1);
    expect(listResponse.body[0]).toHaveProperty('id');
    expect(listResponse.body[0].name).toEqual('Category Supertest');
  });

  it('should not be able to create a new category if name already exists', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
