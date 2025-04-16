import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from 'redis';

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

export const passwordResetLimiter = rateLimit({
    store: new RedisStore({
        client: redisClient,
        prefix: 'password_reset:'
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: 'Too many password reset requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false
});

export const loginLimiter = rateLimit({
    store: new RedisStore({
        client: redisClient,
        prefix: 'login:'
    }),
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 login attempts per hour
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false
}); 