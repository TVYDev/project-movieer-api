const mongoose = require('mongoose');
const request = require('supertest');
const { User, ROLE_CUSTOMER } = require('../../../models/User');
const { Membership } = require('../../../models/Membership');
let server;

describe('Authentication', () => {
  beforeAll(() => {
    server = require('../../../server');
  });

  afterAll(async () => {
    await server.close();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  describe('POST /api/v1/auth/register', () => {
    const data = {
      name: 'tvy',
      email: 'tvy@mail.com',
      password: '123456'
    };

    const exec = () => request(server).post('/api/v1/auth/register');

    it('should return 400 if name is not provided', async () => {
      const curData = { ...data };
      delete curData.name;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is not a string', async () => {
      const curData = { ...data };
      curData.name = 1;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is an empty string', async () => {
      const curData = { ...data };
      curData.name = '';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is more than 50 characters', async () => {
      const curData = { ...data };
      const name = new Array(52).join('a');
      curData.name = name;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is duplicated', async () => {
      const data2 = { ...data };
      data2.email = 'tvy2@mail.com';
      const res = await exec().send(data);

      const res2 = await exec().send(data2);

      expect(res.status).toBe(200);
      expect(res2.status).toBe(400);
    });

    it('should return 400 if email is not provided', async () => {
      const curData = { ...data };
      delete curData.email;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is not a string', async () => {
      const curData = { ...data };
      curData.email = 1;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is an empty string', async () => {
      const curData = { ...data };
      curData.email = '';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is not valid', async () => {
      const curData = { ...data };
      curData.email = 'tvymail.com';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is duplicated', async () => {
      const data2 = { ...data };
      data2.name = 'tvy2';
      const res = await exec().send(data);

      const res2 = await exec().send(data2);

      expect(res.status).toBe(200);
      expect(res2.status).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
      const curData = { ...data };
      delete curData.password;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is not a string', async () => {
      const curData = { ...data };
      curData.password = 1;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is an empty string', async () => {
      const curData = { ...data };
      curData.password = '';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if password has fewer than 6 characters', async () => {
      const curData = { ...data };
      curData.password = '12345';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 200, and save the registered user to database if request is valid', async () => {
      const res = await exec().send(data);

      const userInDb = User.find({ name: 'tvy', email: 'tvy@mail.com' });

      expect(res.status).toBe(200);
      expect(userInDb).not.toBeNull();
    });

    it('should return 200, and return the registerd user if request is valid', async () => {
      const res = await exec().send(data);
      const { data: dt } = res.body;

      expect(res.status).toBe(200);
      expect(dt).toHaveProperty('name', 'tvy');
      expect(dt).toHaveProperty('email', 'tvy@mail.com');
      expect(dt).toHaveProperty('role', ROLE_CUSTOMER);
      expect(dt).not.toHaveProperty('password');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    const data = {
      email: 'tvy@mail.com',
      password: '123456'
    };

    beforeEach(async () => {
      await User.create({
        name: 'tvy',
        email: data.email,
        password: data.password
      });
    });

    const exec = () => request(server).post('/api/v1/auth/login');

    it('should return 400 if email is not provided', async () => {
      const curData = { ...data };
      delete curData.email;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is not a string', async () => {
      const curData = { ...data };
      curData.email = 1;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is an empty string', async () => {
      const curData = { ...data };
      curData.email = '';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is not valid', async () => {
      const curData = { ...data };
      curData.email = 'tvymail.com';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
      const curData = { ...data };
      delete curData.password;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is not a string', async () => {
      const curData = { ...data };
      curData.password = 1;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is an empty string', async () => {
      const curData = { ...data };
      curData.password = '';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if email does not exist', async () => {
      const curData = { ...data };
      curData.email = 'tvy2@mail.com';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is not correct', async () => {
      const curData = { ...data };
      curData.password = '123455';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 200, and return the token if request is valid', async () => {
      const res = await exec().send(data);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('tokenExpiresAt');
    });
  });

  describe('POST /api/v1/auth/change-password', () => {
    let token;
    let user;

    const data = {
      oldPassword: '123456',
      newPassword: '123457'
    };

    beforeEach(async () => {
      user = await User.create({
        name: 'tvy',
        email: 'tvy@mail.com',
        password: data.oldPassword
      });

      token = user.generateJwtToken();
    });

    const exec = () =>
      request(server)
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${token}`);

    it('should return 400 if oldPassword is not provided', async () => {
      const curData = { ...data };
      delete curData.oldPassword;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if oldPassword is not a string', async () => {
      const curData = { ...data };
      curData.oldPassword = 1;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if oldPassword is an empty string', async () => {
      const curData = { ...data };
      curData.oldPassword = '';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if newPassword is not provided', async () => {
      const curData = { ...data };
      delete curData.newPassword;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if newPassword is not a string', async () => {
      const curData = { ...data };
      curData.newPassword = 1;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if newPassword is an empty string', async () => {
      const curData = { ...data };
      curData.newPassword = '';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if newPassword has fewer than 6 characters', async () => {
      const curData = { ...data };
      curData.newPassword = '12345';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if old and new password are the same', async () => {
      const curData = { ...data };
      curData.newPassword = curData.oldPassword;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if old password is not correct', async () => {
      const curData = { ...data };
      curData.oldPassword = '123123';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 200, and update the password if request is valid', async () => {
      const res = await exec().send(data);

      expect(res.status).toBe(200);
      expect(user.compareHashedPassword(data.newPassword)).toBeTruthy();
    });

    it('should return 200, and return data null if request is valid', async () => {
      const res = await exec().send(data);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeNull();
    });
  });

  describe('GET /api/v1/auth/me', () => {
    let token;
    let user;

    beforeEach(async () => {
      user = await User.create({
        name: 'tvy',
        email: 'tvy@mail.com',
        password: '123456'
      });

      token = user.generateJwtToken();
    });

    const exec = () =>
      request(server)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

    it('should return 200, and return the user if request is valid', async () => {
      const res = await exec();
      const { data: dt } = res.body;

      expect(res.status).toBe(200);
      expect(dt).toHaveProperty('_id', user._id.toHexString());
      expect(dt).toHaveProperty('name', 'tvy');
      expect(dt).toHaveProperty('email', 'tvy@mail.com');
      expect(dt).toHaveProperty('role', ROLE_CUSTOMER);
    });

    it('should return 200, and return the user with populated membership if request is valid', async () => {
      const membership = await Membership.create({
        name: 'Silver',
        description: 'Free drinks every purchase'
      });
      const user2 = await User.create({
        name: 'qwe',
        email: 'qwe@mail.com',
        password: '123456',
        membership: membership._id
      });
      token = user2.generateJwtToken();

      const res = await exec();
      const { data: dt } = res.body;

      expect(res.status).toBe(200);
      expect(dt).toHaveProperty('_id', user2._id.toHexString());
      expect(dt).toHaveProperty('name', 'qwe');
      expect(dt).toHaveProperty('email', 'qwe@mail.com');
      expect(dt).toHaveProperty('role', ROLE_CUSTOMER);
      expect(dt).toHaveProperty('membership');
      expect(dt.membership).toHaveProperty('_id', membership._id.toHexString());
      expect(dt.membership).toHaveProperty('name', 'Silver');
      expect(dt.membership).toHaveProperty(
        'description',
        'Free drinks every purchase'
      );
    });
  });
});