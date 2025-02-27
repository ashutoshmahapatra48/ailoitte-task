const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'E-Commerce API',
    version: '1.0.0',
    description: 'API documentation for E-Commerce API',
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ BearerAuth: [] }], // Applies authentication globally
  paths: {
    '/auth/sign-up': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', example: 'johndoe@example.com' },
                  password: { type: 'string', example: 'SecurePass123' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/auth/sign-in': {
      post: {
        summary: 'User login',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'johndoe@example.com' },
                  password: { type: 'string', example: 'SecurePass123' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { token: { type: 'string' } } },
              },
            },
          },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/categories': {
      post: {
        summary: 'Create a new category',
        tags: ['Category'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Electronics' },
                  description: { type: 'string', example: 'Category for electronic items' },
                },
                required: ['name'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Category created successfully' },
          400: { description: 'Validation error or category already exists' },
        },
      },
      get: {
        summary: 'Get all categories',
        tags: ['Category'],
        responses: {
          200: { description: 'Categories fetched successfully' },
        },
      },
    },
    '/categories/{id}': {
      get: {
        summary: 'Get a single category by ID',
        tags: ['Category'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
        ],
        responses: {
          200: { description: 'Category fetched successfully' },
          404: { description: 'Category not found' },
        },
      },
      put: {
        summary: 'Update a category',
        tags: ['Category'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Updated Electronics' },
                  description: { type: 'string', example: 'Updated category description' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Category updated successfully' },
          404: { description: 'Category not found' },
        },
      },
      delete: {
        summary: 'Delete a category',
        tags: ['Category'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
        ],
        responses: {
          200: { description: 'Category deleted successfully' },
          404: { description: 'Category not found' },
        },
      },
    },
    '/products': {
      post: {
        summary: 'Create a new product',
        tags: ['Products'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Laptop' },
                  description: { type: 'string', example: 'High-performance laptop' },
                  price: { type: 'number', example: 1200.99 },
                  stock: { type: 'integer', example: 10 },
                  categoryId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                  image: { type: 'string', format: 'binary' },
                },
                required: ['name', 'description', 'price', 'stock', 'categoryId', 'image'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Product created successfully' },
          400: { description: 'Validation error or missing fields' },
          404: { description: 'Category not found' },
        },
      },
      get: {
        summary: 'Get all products with filters, search, and pagination',
        tags: ['Products'],
        parameters: [
          {
            name: 'minPrice',
            in: 'query',
            schema: { type: 'number' },
            description: 'Minimum price filter',
          },
          {
            name: 'maxPrice',
            in: 'query',
            schema: { type: 'number' },
            description: 'Maximum price filter',
          },
          {
            name: 'categoryId',
            in: 'query',
            schema: { type: 'integer' },
            description: 'Filter by category',
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Search by product name',
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
            description: 'Page number',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 },
            description: 'Items per page',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: { type: 'string', default: 'name' },
            description: 'Sort by field',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: { type: 'string', default: 'asc' },
            description: 'Sort order (asc/desc)',
          },
        ],
        responses: {
          200: { description: 'Products retrieved successfully' },
        },
      },
    },
    '/products/{id}': {
      get: {
        summary: 'Get a single product by ID',
        tags: ['Products'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
        ],
        responses: {
          200: { description: 'Product retrieved successfully' },
          404: { description: 'Product not found' },
        },
      },
      put: {
        summary: 'Update an existing product',
        tags: ['Products'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Updated Laptop' },
                  description: { type: 'string', example: 'Updated description' },
                  price: { type: 'number', example: 1299.99 },
                  stock: { type: 'integer', example: 8 },
                  categoryId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                  image: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Product updated successfully' },
          400: { description: 'Validation error' },
          404: { description: 'Product not found' },
        },
      },
      delete: {
        summary: 'Delete a product',
        tags: ['Products'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
        ],
        responses: {
          200: { description: 'Product deleted successfully' },
          404: { description: 'Product not found' },
        },
      },
    },
    '/cart': {
      post: {
        summary: 'Add a product to the cart or update quantity',
        tags: ['Cart'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  productId: { type: 'integer', example: 1 },
                  quantity: { type: 'integer', example: 2 },
                },
                required: ['productId', 'quantity'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Cart updated successfully' },
          400: { description: 'Validation error' },
          404: { description: 'Product not found' },
        },
      },
      get: {
        summary: 'View cart items',
        tags: ['Cart'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Cart retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      productId: { type: 'integer', example: 1 },
                      quantity: { type: 'integer', example: 2 },
                      Product: {
                        type: 'object',
                        properties: {
                          name: { type: 'string', example: 'Laptop' },
                          price: { type: 'number', example: 1200.99 },
                          imageUrl: { type: 'string', example: 'https://example.com/image.jpg' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/orders': {
      post: {
        summary: 'Place an Order',
        description: 'Places a new order for the authenticated user.',
        tags: ['Orders'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                        quantity: { type: 'integer', example: 2 },
                      },
                      required: ['productId', 'quantity'],
                    },
                  },
                },
                required: ['items'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Order placed successfully',
          },
          400: {
            description: 'Bad request (e.g., insufficient stock)',
          },
          404: {
            description: 'Product not found',
          },
        },
      },
    },
    '/orders/history': {
      get: {
        summary: 'Get Order History',
        description: 'Fetches the order history for the authenticated user.',
        tags: ['Orders'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Order history retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      totalAmount: { type: 'number' },
                      createdAt: { type: 'string', format: 'date-time' },
                      orderItems: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            productId: { type: 'integer' },
                            quantity: { type: 'integer' },
                            priceAtOrder: { type: 'number' },
                            product: {
                              type: 'object',
                              properties: {
                                name: { type: 'string' },
                                imageUrl: { type: 'string' },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerDefinition;
