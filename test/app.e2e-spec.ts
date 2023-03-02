import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { not } from 'joi';

const gql = '/graphql';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmZkZjUzY2JiMDU0ZmI0MzJkM2FjMSIsImlhdCI6MTY3Nzc3MTg1NywiZXhwIjoxNjc4MTE3NDU3fQ.h-P2AsvgK1QQtCuFiQ3PXBf4HPsa_7azoCFf9SkfLpo';

describe('GraphQL AppResolver (e2e) {Supertest}', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe(gql, () => {
    describe('Login', () => {
      it('should login', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            operationName: 'Login',
            query: `mutation Login($loginInput: LoginInput!) {
              login(loginInput: $loginInput) {
                token
                user {
                  _id
                  fullName
                  email
                  isActive
                  updatedAt
                  createdAt
                  roles
                }
              }
            }`,
            variables: {
              loginInput: {
                email: "leoerickp@gmail.com",
                password: "123456"
              }
            }
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.login.token).toBeDefined();
            expect(res.body.data.login.user).toBeDefined();
          })
      })
      it('should not login when password is incorrect', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            operationName: 'Login',
            query: `mutation Login($loginInput: LoginInput!) {
              login(loginInput: $loginInput) {
                token
                user {
                  _id
                  fullName
                  email
                  isActive
                  updatedAt
                  createdAt
                  roles
                }
              }
            }`,
            variables: {
              loginInput: {
                email: "leoerickp@gmail.com",
                password: "xxxxxx"
              }
            }
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data).toBeNull();
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toBe('Email / Password do not match');
          })
      })
    })
    describe('Users', () => {
      it('should get all users array', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `query Users {
            users {
              _id
              email
              fullName
            }
          }`
          })
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.users).toBeDefined();
          })
      });

    })
  })
});
