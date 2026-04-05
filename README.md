# Finance Data Processing and Access Control Backend

A production-quality RESTful API backend for a finance dashboard system, built with **Node.js**, **Express**, and **MongoDB**. Features role-based access control, financial record management, dashboard analytics, JWT authentication, soft deletes, pagination, search, and rate limiting.

---



---

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Runtime        | Node.js                           |
| Framework      | Express.js                        |
| Database       | MongoDB with Mongoose ODM         |
| Authentication | JWT (jsonwebtoken)                |
| Validation     | Zod                               |
| Documentation  | Swagger UI (swagger-jsdoc)        |
| Rate Limiting  | express-rate-limit                |
| Security       | helmet, bcryptjs, cors            |

---

## Project Structure

```
src/
├── app.js                    # Entry point — server, middleware, routes
├── config/
│   ├── database.js           # MongoDB connection
│   └── swagger.js            # OpenAPI/Swagger configuration
├── controllers/
│   ├── authController.js     # Register, login, getMe
│   ├── userController.js     # User CRUD + password change
│   ├── recordController.js   # Financial record CRUD + restore
│   └── dashboardController.js# Analytics endpoints
├── middlewares/
│   ├── auth.js               # JWT authentication + role authorization
│   ├── errorHandler.js       # Global error handler + AppError class
│   ├── validate.js           # Zod schema validation middleware
│   └── rateLimiter.js        # API & auth rate limiters
├── models/
│   ├── User.js               # User schema (name, email, password, role, isActive)
│   └── FinancialRecord.js    # Record schema (amount, type, category, soft delete)
├── routes/
│   ├── authRoutes.js         # /api/auth/*
│   ├── userRoutes.js         # /api/users/*
│   ├── recordRoutes.js       # /api/records/*
│   └── dashboardRoutes.js    # /api/dashboard/*
├── services/
│   ├── authService.js        # Registration and login logic
│   ├── userService.js        # User business logic
│   ├── recordService.js      # Record business logic + soft delete
│   └── dashboardService.js   # Aggregation queries for analytics
├── utils/
│   ├── seeder.js             # Database seeder with demo data
└── validators/
    └── schemas.js            # All Zod validation schemas
```

---

## Features

### Core
- ✅ JWT-based authentication (register, login, get current user)
- ✅ Role-based access control (Viewer / Analyst / Admin)
- ✅ Financial records CRUD (create, read, update, delete)
- ✅ Dashboard analytics (summary, category totals, monthly & weekly trends)
- ✅ User management (create, list, update role/status, delete)

### Enhanced
- ✅ **Soft Delete** — records are flagged as deleted, not removed; restorable by admin
- ✅ **Pagination** — all list endpoints support `page` and `limit`
- ✅ **Search** — full-text search across title, notes, category on records
- ✅ **Filtering** — by type, category, date range on records; by role/status on users
- ✅ **Rate Limiting** — 100 req/15min globally; 10 req/15min on auth routes
- ✅ **API Documentation** — Swagger UI at `/api/docs`
- ✅ **Input Validation** — Zod schemas on all write endpoints
- ✅ **Consistent Error Responses** — structured JSON with appropriate HTTP status codes
- ✅ **Security Headers** — via helmet
- ✅ **Password Hashing** — bcrypt with salt rounds

---

## Roles & Access Control

| Action                         | Viewer | Analyst | Admin |
|-------------------------------|--------|---------|-------|
| View financial records        | ✅     | ✅      | ✅    |
| Search & filter records       | ✅     | ✅      | ✅    |
| Create / Update / Delete records | ❌  | ❌      | ✅    |
| View dashboard summary        | ❌     | ✅      | ✅    |
| View category totals          | ❌     | ✅      | ✅    |
| View monthly/weekly trends    | ❌     | ✅      | ✅    |
| View recent activity          | ❌     | ✅      | ✅    |
| List / manage users           | ❌     | ❌      | ✅    |
| Change own password           | ✅     | ✅      | ✅    |
| Update own name               | ✅     | ✅      | ✅    |
| Restore soft-deleted records  | ❌     | ❌      | ✅    |
| Hard delete records           | ❌     | ❌      | ✅    |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd finance-backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 4. (Optional) Seed demo data
npm run seed

# 5. Start the server
npm run dev     # Development with nodemon
npm start       # Production
```

The server starts at **http://localhost:5000**

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

| Variable              | Description                                  | Default       |
|-----------------------|----------------------------------------------|---------------|
| `PORT`                | Port the server listens on                   | `5000`        |
| `MONGODB_URI`         | MongoDB connection string                    | required      |
| `JWT_SECRET`          | Secret key for signing JWT tokens            | required      |
| `JWT_EXPIRES_IN`      | Token expiry duration                        | `7d`          |
| `NODE_ENV`            | Environment (`development` / `production`)   | `development` |
| `RATE_LIMIT_WINDOW_MS`| Rate limit window in milliseconds            | `900000`      |
| `RATE_LIMIT_MAX`      | Max requests per window                      | `100`         |

---

## Seeding Demo Data

```bash
npm run seed
```

This creates 3 demo users and 6 months of sample financial records:

| Role    | Email                   | Password    |
|---------|-------------------------|-------------|
| Admin   | admin@finance.com       | admin123    |
| Analyst | analyst@finance.com     | analyst123  |
| Viewer  | viewer@finance.com      | viewer123   |

---

## API Reference

Interactive documentation is available at:
**http://localhost:5000/api/docs**

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

### Auth Endpoints

| Method | Endpoint             | Auth | Description              |
|--------|----------------------|------|--------------------------|
| POST   | `/auth/register`     | ❌   | Register a new user      |
| POST   | `/auth/login`        | ❌   | Login and get JWT token  |
| GET    | `/auth/me`           | ✅   | Get current user info    |

#### POST /auth/register
```json
{
  "name": "Majid Khan",
  "email": "majid@example.com",
  "password": "secret123",
  "role": "analyst"
}
```

#### POST /auth/login
```json
{
  "email": "majid@example.com",
  "password": "secret123"
}
```

---

### User Endpoints

| Method | Endpoint                    | Role    | Description               |
|--------|-----------------------------|---------|---------------------------|
| GET    | `/users`                    | Admin   | List all users (paginated)|
| GET    | `/users/:id`                | Admin   | Get user by ID            |
| PATCH  | `/users/:id`                | Any*    | Update user               |
| DELETE | `/users/:id`                | Admin   | Delete user               |
| PATCH  | `/users/me/change-password` | Any     | Change own password       |

*Non-admins can only update their own name; role/status changes are admin-only.

#### Query Parameters (GET /users)
| Param    | Type    | Description                      |
|----------|---------|----------------------------------|
| page     | integer | Page number (default: 1)         |
| limit    | integer | Items per page (default: 10)     |
| search   | string  | Search by name or email          |
| role     | string  | Filter by role                   |
| isActive | boolean | Filter by active/inactive status |

---

### Financial Record Endpoints

| Method | Endpoint                  | Role    | Description                      |
|--------|---------------------------|---------|----------------------------------|
| GET    | `/records`                | All     | List records (filters/pagination)|
| GET    | `/records/:id`            | All     | Get single record                |
| POST   | `/records`                | Admin   | Create a record                  |
| PATCH  | `/records/:id`            | Admin   | Update a record                  |
| DELETE | `/records/:id`            | Admin   | Soft delete a record             |
| DELETE | `/records/:id/hard-delete`| Admin   | Permanently delete a record      |
| GET    | `/records/deleted`        | Admin   | List soft-deleted records        |
| PATCH  | `/records/:id/restore`    | Admin   | Restore a soft-deleted record    |

#### Query Parameters (GET /records)
| Param     | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| page      | int    | Page number (default: 1)                |
| limit     | int    | Items per page (default: 10)            |
| type      | string | `income` or `expense`                   |
| category  | string | Filter by category                      |
| startDate | date   | Filter from date (YYYY-MM-DD)           |
| endDate   | date   | Filter to date (YYYY-MM-DD)             |
| search    | string | Search in title, notes, category        |
| sortBy    | string | Field to sort by (default: `date`)      |
| sortOrder | string | `asc` or `desc` (default: `desc`)       |

#### POST /records (body)
```json
{
  "title": "Monthly Salary",
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "date": "2024-04-01",
  "notes": "April salary payment"
}
```

---

### Dashboard Endpoints

| Method | Endpoint                      | Role           | Description                      |
|--------|-------------------------------|----------------|----------------------------------|
| GET    | `/dashboard`                  | Analyst, Admin | Full overview (all combined)     |
| GET    | `/dashboard/summary`          | Analyst, Admin | Income, expenses, net balance    |
| GET    | `/dashboard/categories`       | Analyst, Admin | Totals grouped by category       |
| GET    | `/dashboard/trends/monthly`   | Analyst, Admin | Monthly income vs expense trends |
| GET    | `/dashboard/trends/weekly`    | Analyst, Admin | Last 8 weeks of activity         |
| GET    | `/dashboard/recent`           | Analyst, Admin | Recent transactions              |

#### Sample GET /dashboard/summary Response
```json
{
  "success": true,
  "data": {
    "totalIncome": 35450.00,
    "totalExpenses": 12800.00,
    "netBalance": 22650.00,
    "totalIncomeTransactions": 18,
    "totalExpenseTransactions": 24,
    "totalTransactions": 42
  }
}
```

---

### Error Response Format

All errors follow a consistent structure:

```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": ["field.path: validation detail"]
}
```

| HTTP Status | Meaning                         |
|-------------|---------------------------------|
| 200         | OK                              |
| 201         | Created                         |
| 400         | Bad Request / Validation Failed |
| 401         | Unauthorized (missing/bad token)|
| 403         | Forbidden (insufficient role)   |
| 404         | Resource Not Found              |
| 409         | Conflict (e.g. duplicate email) |
| 429         | Too Many Requests (rate limit)  |
| 500         | Internal Server Error           |

---

## Assumptions & Tradeoffs

### Assumptions

1. **Role assignment on registration** — In a real system, self-registration would default to `viewer`. For demo/assessment purposes, the `role` field is accepted at registration time to make testing all roles easier.

2. **Categories are open-ended** — Rather than enforcing a strict enum for categories, they are stored as lowercase strings. This gives the system flexibility to accommodate new categories without schema migrations. Common defaults are seeded.

3. **Soft delete as default delete** — The `DELETE /records/:id` endpoint performs a soft delete. This preserves data integrity and audit history. Hard delete is available separately for admins.

4. **Dashboard access** — Viewers can read financial records but cannot access the dashboard/analytics endpoints. The rationale is that raw records are operational data, while analytics are business intelligence that require the `analyst` or `admin` role.

5. **Pagination defaults** — Page size defaults to 10. This is easily configurable per request.

6. **Date handling** — Dates are stored as MongoDB `Date` objects. ISO 8601 strings and `YYYY-MM-DD` format are both accepted on input.

### Tradeoffs

| Decision                        | Reasoning                                                                 |
|---------------------------------|---------------------------------------------------------------------------|
| MongoDB over relational DB      | Schema flexibility for financial records with varying metadata; aggregation pipeline is well-suited for analytics |
| Zod over Joi/express-validator  | Type-safe schemas, excellent TypeScript support, clean error messages      |
| Soft delete via Mongoose middleware | Applying a global pre-find filter ensures deleted records are never accidentally returned without explicit opt-in |
| Services layer separation       | Controllers are thin; all business logic lives in services for testability and reuse |
| JWT over sessions               | Stateless; better suited for API-first architecture                       |
| No refresh tokens               | Acceptable scope for this assessment; production would add refresh token rotation |
| Swagger from JSDoc comments     | Keeps documentation co-located with route definitions, easier to maintain |