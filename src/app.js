import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'

import connectDB from './config/database.js'
import { apiLimiter } from './middlewares/rateLimiter.js'
import { swaggerSpec } from './config/swagger.js'


// Route import 
import userRoutes from './routes/userRoute.js'
import authRoutes from './routes/authRoute.js'
import recordRoutes from './routes/recordRoutes.js'
import dashboardRoutes from './routes/dashboardRoute.js'


const app=express()

// ─── Global Middlewares ────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


dotenv.config()


// Apply rate limiter to all API routes
app.use('/api', apiLimiter);

// ─── API Documentation ─────────────────────────────────────────────
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Finance API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
    },
  })
);

// Expose raw OpenAPI JSON
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─── Routes ───────────────────────────────────────────────────────
app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/records',recordRoutes);
app.use('/api/dashboard',dashboardRoutes);


// ─── Health Check ─────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Finance API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────
// Catches any request that didn't match a route above
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});



// ─── Connect to Database ───────────────────────────────────────────
connectDB();


const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
    console.log(`📄 API Docs:  http://localhost:${PORT}/api/docs`);
  console.log(`💚 Health:    http://localhost:${PORT}/health`);
})