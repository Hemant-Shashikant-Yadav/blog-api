import express from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

import config from '@/config';
import limitter from '@/lib/express_rate_limit';

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
      console.log(`CORS Error: ${origin} not allowed by CORS`);
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
// extended: true allows for parsing of nested objects in form data
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Compression middleware to compress responses
// Threshold
app.use(compression({ threshold: 1024 }));

// Helmet middleware for security
app.use(helmet());

// Rate limiting middleware
app.use(limitter);

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World',
  });
});

app.listen(config.PORT, () => {
  console.log(`Server is running: http://localhost:${config.PORT}`);
});
