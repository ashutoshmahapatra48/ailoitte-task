import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from "../src/config/db.js";
import { generateToken } from '../src/utils/jwtHelper.js';
import Cart from '../src/models/Cart.js';
import Product from '../src/models/Product.js';
import Category from '../src/models/Category.js';
import User from '../src/models/User.js';

describe('Cart API', () => {
  let token, userId, categoryId, productId, product;

  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset DB before running tests

    const user = await User.create({
        name: 'User',
        email: 'user@example.com',
        password: 'SecurePass123',
        role: 'user',
      });
    token = generateToken(user);

    const category = await Category.create({
      name: 'Electronics',
      description: 'Electronics category',
    });

    categoryId = category.id;
    product = await Product.create({
      name: 'Test Product',
      description: 'Test description',
      stock: 10,
      categoryId,
      price: 500,
      imageUrl: 'image.jpg',
    });
    console.log("Product created",product);
    
    productId = product.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should add a product to the cart', async () => {
    const res = await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Cart updated');

    const cartItem = await Cart.findOne({ where: { productId } });
    expect(cartItem).not.toBeNull();
    expect(cartItem.quantity).toBe(2);
  });

  it('should fetch cart items for the user', async () => {
    const res = await request(app).get('/api/v1/cart').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it('should remove a product from the cart', async () => {
    const res = await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 0 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Cart updated');
  });

  it('should return empty cart if no items are found', async () => {
    const res = await request(app).get('/api/v1/cart').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(0);
  });
});
