import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Data Processing API',
      version: '1.0.0',
      description: `
## Finance Data Processing and Access Control Backend

A RESTful API for managing financial records with role-based access control.

### Roles
- **Viewer**: Read-only access to records and dashboard
- **Analyst**: Read access + summary/insights endpoints
- **Admin**: Full access — manage users, records, and all data

### Authentication
All protected routes require a Bearer token in the Authorization header.
\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

### Getting Started
1. Register a user via \`POST /api/auth/register\`
\n
2. Login via \`POST /api/auth/login\` to get a JWT token
\n
3. Use the token in the Authorization header for all subsequent requests
      `,
      contact: {
        name: 'API Support',
        email: 'majidkhan0899@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '664a1b2c3d4e5f6789abcdef' },
            name: { type: 'string', example: 'Majid Khan' },
            email: { type: 'string', example: 'majid@example.com' },
            role: { type: 'string', enum: ['viewer', 'analyst', 'admin'], example: 'analyst' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        FinancialRecord: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '664a1b2c3d4e5f6789abcdef' },
            title: { type: 'string', example: 'Office Rent' },
            amount: { type: 'number', example: 1500.00 },
            type: { type: 'string', enum: ['income', 'expense'], example: 'expense' },
            category: { type: 'string', example: 'operations' },
            date: { type: 'string', format: 'date', example: '2024-04-01' },
            notes: { type: 'string', example: 'Monthly office rent payment' },
            isDeleted: { type: 'boolean', example: false },
            createdBy: { type: 'string', example: '664a1b2c3d4e5f6789abcdef' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 100 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalPages: { type: 'integer', example: 10 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js', './src/docs/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export {swaggerSpec}