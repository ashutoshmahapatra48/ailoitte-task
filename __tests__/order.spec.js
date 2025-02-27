import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/config/db.js';
import { generateToken } from '../src/utils/jwtHelper.js';
import Product from '../src/models/Product.js';
import Category from '../src/models/Category.js';
import User from '../src/models/User.js';

let token, categoryId, productId, product2Id;

beforeAll(async () => {
    jest.setTimeout(20000);
  await sequelize.sync({ force: true }); // Reset DB before running tests

  // Create test user
  const user = await User.create({
    name: 'User',
    email: 'user@example.com',
    password: 'SecurePass123',
    role: 'user',
  });
  token = generateToken(user);

  // Create test products
  const category = await Category.create({
    name: 'Electronics',
    description: 'Electronics category',
  });

  categoryId = category.id;
  const product = await Product.create({
    name: 'Test Product',
    description: 'Test description',
    stock: 10,
    categoryId,
    price: 500,
    imageUrl: 'image.jpg',
  });

  productId = product.id;

  const product2 = await Product.create({
    name: 'Test Product 2',
    description: 'Test description',
    stock: 5,
    categoryId,
    price: 800,
    imageUrl: 'image2.jpg',
  });

  product2Id = product2.id;
});

afterAll(async () => {
  await sequelize.close(); // Close DB connection after tests
});

describe('Order API Tests', () => {
  it('should place an order successfully', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [
          { productId, quantity: 2 },
          { productId: product2Id, quantity: 1 },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Order placed successfully');
  });

  it('should return error for invalid product ID', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: 'invalid-uuid', quantity: 1 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation errors');
  });

  it('should return error for insufficient stock', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [
          { productId, quantity: 20 }, // Stock is only 10
        ],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Insufficient stock');
  });

  it('should fetch order history successfully', async () => {
    const res = await request(app)
      .get('/api/v1/orders/history')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('totalAmount');
    expect(res.body.data[0]).toHaveProperty('status');
  });
});
