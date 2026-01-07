// Node modules
import express from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

// Custom modules
import config from '@/config';
import limitter from '@/lib/express_rate_limit';
import { connectDB, disconnectDB } from '@/lib/mongoose';
import { logger } from '@/lib/winstone';

// Routes
import v1Routes from '@/routes/v1';

const app = express();

// Configure CORS options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // if (!origin) {
    //   return callback(null, true);
    // }
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELISTED_DOMAINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error: ${origin} not allowed by CORS`), false);
      logger.warn(`CORS Error: ${origin} not allowed by CORS`);
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
// extended: true allows for parsing of nested objects in form data
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Compression middleware to compress responses
// Threshold: 1KB
app.use(compression({ threshold: 1024 }));

// Helmet middleware for security
app.use(helmet());

// Rate limiting middleware
app.use(limitter);

/**
 * Swagger/OpenAPI configuration
 * You can document routes with JSDoc annotations under src/routes/**.ts
 */
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'My Express API (TypeScript)',
      version: '1.0.0',
      description:
        'API documentation generated with swagger-jsdoc & swagger-ui-express',
    },
    servers: [{ url: `http://localhost:${config.PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refreshToken', // replace with your actual cookie name
        },
      },
    },
    security: [{ bearerAuth: [] }], // apply globally (optional)
  },
  apis: [path.join(__dirname, '/routes/**/*.ts')], // scan route files for @swagger JSDoc
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI route
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      withCredentials: true,
      requestInterceptor: (req: any) => {
        console.log('Request cookies:', document.cookie);
        return req;
      },
      responseInterceptor: (res: any) => {
        if (res.headers['set-cookie']) {
          console.log('Set-Cookie:', res.headers['set-cookie']);
        }
        return res;
      },
    },
  }),
);

// Initial, basic implementation
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Hello World',
//   });
// });

// app.listen(config.PORT, () => {
//   console.log(`Server is running: http://localhost:${config.PORT}`);
// });

/*
 * Immediatly Invoked Async Function Expression (IIFE) to start server
 * - Defines the server configuration and starts the server
 * - Handles errors during server startup
 * - Gracefully handles errors in production environment
 */
(async () => {
  try {
    await connectDB();

    app.use('/api/v1', v1Routes);

    app.listen(config.PORT, () => {
      logger.info(`Server is running: http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

/**
 * Handel server shoutdown gracefully by disconnecting from db
 *
 * - Attempt to disconnect from the db before shutting down server.
 * - Logs any errors that occur during the disconnection process.
 * - Exits the process with a non-zero status code if an error occurs during disconnection.
 * - Logs a message indicating that the server has been shut down gracefully.
 * - Exits the process with a zero status code to indicate successful shutdown.
 */

const handelServerShutdown = async () => {
  try {
    await disconnectDB();

    // Close the server
    logger.warn('Server shut down gracefully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during server shutdown:', error);
    process.exit(1);
  }
};

/**
 * Listens for termination signals (SIGINT and SIGTERM) and gracefully shuts down the server.
 * - `SIGTERM` is sent by the operating system when the process is terminated.
 * - `SIGINT` is sent when the user presses `Ctrl+C` in the terminal.
 * - Listens for the `SIGINT` signal and logs a message indicating that the server is shutting down.
 * - Logs a message indicating that the server is shutting down.
 * - Calls the handelServerShutdown function to handle server shutdown gracefully.
 * - Logs a message indicating that the server has been shut down.
 * - Exits the process with a zero status code to indicate successful shutdown.
 */
process.on('SIGINT', () => {
  logger.warn('Server is shutting down...');
  handelServerShutdown();
  logger.info('Server shut down');
});

process.on('SIGTERM', () => {
  logger.warn('Server is shutting down...');
  handelServerShutdown();
  logger.info('Server shut down');
});
