import request from "supertest";
import app from "../src/app.js";
import { sequelize } from "../src/config/db.js";
import User from "../src/models/User.js";

// Before running tests, sync the database (clears old test data)
beforeAll(async () => {
  await sequelize.sync({ force: true }); // `force: true` resets the DB
});

// After all tests, close DB connection
afterAll(async () => {
  await sequelize.close();
});

// Group all auth API tests
describe("Auth APIs", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/v1/auth/sign-up").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "SecurePass123",
      role: "user",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");

    // Verify user exists in the database
    const user = await User.findOne({ where: { email: "johndoe@example.com" } });
    expect(user).not.toBeNull();
  });

  it("should not register a user with an existing email", async () => {
    const res = await request(app).post("/api/v1/auth/sign-up").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "SecurePass123",
      role: "user",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "User already exists");
  });

  it("should login and return a token", async () => {
    const res = await request(app).post("/api/v1/auth/sign-in").send({
      email: "johndoe@example.com",
      password: "SecurePass123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data.token");
    expect(typeof res.body.data.token).toBe("string");
  });

  it("should not login with invalid credentials", async () => {
    const res = await request(app).post("/api/v1/auth/sign-in").send({
      email: "johndoe@example.com",
      password: "WrongPassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });

  it("should return validation error for missing fields", async () => {
    const res = await request(app).post("/api/v1/auth/sign-in").send({
      email: "",
      password: "",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);
  });
});
