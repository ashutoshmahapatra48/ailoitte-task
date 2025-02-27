const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "API documentation for E-Commerce API",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }], // Applies authentication globally
    paths: {
      "/auth/sign-up": {
        post: {
          summary: "Register a new user",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "John Doe" },
                    email: { type: "string", example: "johndoe@example.com" },
                    password: { type: "string", example: "SecurePass123" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "User registered successfully" },
            400: { description: "Validation error" },
          },
        },
      },
      "/auth/sign-in": {
        post: {
          summary: "User login",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", example: "johndoe@example.com" },
                    password: { type: "string", example: "SecurePass123" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Login successful", content: { "application/json": { schema: { type: "object", properties: { token: { type: "string" } } } } } },
            401: { description: "Invalid credentials" },
          },
        },
      },
      
    },
  };
  
  export default swaggerDefinition;
  