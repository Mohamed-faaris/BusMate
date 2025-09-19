import { createClient, type RedisClientType } from "redis";

declare global {
  // Extend NodeJS global type
  // so TypeScript knows `global.redisClient` exists
  // and is a Redis client
   
  var redisClient: RedisClientType | undefined;
}

let redisClient: RedisClientType;

if (!global.redisClient) {
  global.redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : undefined,
      username: process.env.REDIS_USER || undefined,
    },
    password: process.env.REDIS_PASSWORD || undefined,
  });

  global.redisClient.on("error", (err: Error) =>
    console.error("Redis error:", err),
  );
  global.redisClient.connect().catch(console.error);
}

redisClient = global.redisClient;

export default redisClient;
