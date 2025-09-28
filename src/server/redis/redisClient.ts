import { type RedisClientType } from "redis";

declare global {
  // Extend NodeJS global type
  // so TypeScript knows `global.redisClient` exists
  // and is a Redis client
  var redisClient: RedisClientType | undefined;
}

const redisClient: RedisClientType = global.redisClient;

export default redisClient;
