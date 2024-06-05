import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis: Redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD || "redispassword",
  retryStrategy: (times: number): number => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("error", (err: Error) => {
  console.error("Redis error:", err);
});

export default redis;
