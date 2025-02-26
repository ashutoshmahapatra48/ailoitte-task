import request from "supertest";
import app from "../src/app.js";
import { sequelize } from "../src/config/db.js";

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
  let token = "";

  it("should register a new user", async () => {
    const res = await request(app).post("/api/v1/auth/sign-up").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "SecurePass123",
      role: "user",
    });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

  it("should login and return a token", async () => {
    const res = await request(app).post("/api/v1/auth/sign-in").send({
      email: "johndoe@example.com",
      password: "SecurePass123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data.token");

    token = res.body.token; // Store token for protected route tests
  });

  // it("should deny access without token", async () => {
  //   const res = await request(app).get("/api/v1/protected-route");
  //   expect(res.statusCode).toBe(401);
  // });

  // it("should allow access with valid token", async () => {
  //   const res = await request(app)
  //     .get("/api/v1/protected-route")
  //     .set("Authorization", `Bearer ${token}`);

  //   expect(res.statusCode).toBe(200);
  // });
});