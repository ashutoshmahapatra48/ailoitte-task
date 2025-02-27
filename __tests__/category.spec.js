import request from "supertest";
import app from "../src/app.js";
import { sequelize } from "../src/config/db.js";
import { generateToken } from "../src/utils/jwtHelper.js";

// Dummy user tokens
const adminToken = generateToken({ id: "admin-uuid", role: "admin" });
const userToken = generateToken({ id: "user-uuid", role: "user" });

let categoryId; // To store created category ID

// Setup before tests
beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset database
});

// Cleanup after tests
afterAll(async () => {
  await sequelize.close();
});

describe("Category APIs", () => {
  // ✅ Create Category
  it("should create a new category (Admin only)", async () => {
    const res = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Electronics",
        description: "All electronic items",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("id");

    categoryId = res.body.data.id; // Store ID for further tests
  });

  // ❌ Create Category without Auth
  it("should fail to create category without authentication", async () => {
    const res = await request(app)
      .post("/api/v1/categories")
      .send({ name: "Books", description: "All books" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  // ❌ Create Category without Admin Role
  it("should fail to create category with non-admin role", async () => {
    const res = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Books", description: "All books" });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Access denied: Insufficient permissions");
  });

  // ✅ Get All Categories
  it("should fetch all categories", async () => {
    const res = await request(app).get("/api/v1/categories");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // ✅ Get Single Category by ID
  it("should fetch a category by ID", async () => {
    const res = await request(app).get(`/api/v1/categories/${categoryId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe("Electronics");
  });

  // ❌ Get Category with Invalid ID
  it("should return error for invalid category ID", async () => {
    const res = await request(app).get(`/api/v1/categories/invalid-id`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Validation errors");
  });

  // ✅ Update Category
  it("should update a category (Admin only)", async () => {
    const res = await request(app)
      .put(`/api/v1/categories/${categoryId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Updated Electronics" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe("Updated Electronics");
  });

  // ❌ Update Category without Auth
  it("should fail to update category without authentication", async () => {
    const res = await request(app)
      .put(`/api/v1/categories/${categoryId}`)
      .send({ name: "Unauthorized Update" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  // ✅ Delete Category
  it("should delete a category (Admin only)", async () => {
    const res = await request(app)
      .delete(`/api/v1/categories/${categoryId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Category deleted successfully");
  });

  // ❌ Delete Non-Existent Category
  it("should return error when deleting a non-existent category", async () => {
    const res = await request(app)
      .delete(`/api/v1/categories/${categoryId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Category not found");
  });
});
