import { createClient, type RedisClientType } from "redis";
import { env } from "@/env";

declare global {
  // Extend NodeJS global type
  // so TypeScript knows `global.redisClient` exists
  // and is a Redis client
  var redisClient: RedisClientType | undefined;
}

// Initialize Redis client if it doesn't exist
if (!global.redisClient) {
  global.redisClient = createClient({
    url: env.REDIS_URL,
  });

  // Handle connection errors
  global.redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
  });
}

const redisClient: RedisClientType = global.redisClient;

export default redisClient;
