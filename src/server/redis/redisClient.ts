import { createClient, type RedisClientType } from "redis";

declare global {
  // Extend NodeJS global type
  // so TypeScript knows `global.redisClient` exists
  // and is a Redis client
  var redisClient: RedisClientType | undefined;
}

const redisClient: RedisClientType;

if (!global.redisClient) {
  global.redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  global.redisClient.on("error", (err: Error) =>
    console.error("Redis error:", err),
  );

  global.redisClient.connect().catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });
}

redisClient = global.redisClient;

export default redisClient;
