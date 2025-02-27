import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/config/db.js';
import { generateToken } from '../src/utils/jwtHelper.js';
import path from 'path';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';

// Test data
let adminToken, categoryId, productId;

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset database before tests

  // Create an admin user and generate a token
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'SecurePass123',
    role: 'admin',
  });

  adminToken = generateToken(adminUser);

  // Create a category
  const category = await Category.create({
    name: 'Electronics',
    description: 'Electronics category',
  });

  categoryId = category.id;
});

afterAll(async () => {
  await sequelize.close(); // Close DB connection after all tests
});

describe('Product API Tests', () => {
  it('should create a new product', async () => {
    const imagePath = path.join(__dirname, "test-image.jpg");
    
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('name', 'Laptop')
      .field('description', 'Gaming laptop')
      .field('price', 1200)
      .field('stock', 10)
      .field('categoryId', categoryId)
      .attach('image', imagePath);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Product created successfully');
    productId = res.body.data.id;
  });

  it('should fetch all products', async () => {
    const res = await request(app).get('/api/v1/products');

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('should fetch a single product by ID', async () => {
    const res = await request(app).get(`/api/v1/products/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('name', 'Laptop');
  });

  it('should update a product', async () => {
    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Laptop',
        price: 1100,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('name', 'Updated Laptop');
  });

  it('should delete a product', async () => {
    const res = await request(app)
      .delete(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product deleted successfully');
  });
});
