import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.REDIS_URL;
console.log("Redis URL:", url);

const redisClient = createClient({
  url: url || 'redis://localhost:6379',
  socket: {
    tls: url?.startsWith('rediss://') || false
  }
});



export default redisClient;
