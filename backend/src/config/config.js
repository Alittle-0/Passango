import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.NODE_PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || '24h',
    database: {
        // MongoDB configuration
        uri: process.env.MONGO_URI ,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
    cors: {
        origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    },
    email: {
        host: process.env.EMAIL_HOST,
        port_email: process.env.EMAIL_PORT || 587,
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD
    },
    app: {
        port_app: process.env.PYTHON_PORT || 8000,
    },
};

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export default config;