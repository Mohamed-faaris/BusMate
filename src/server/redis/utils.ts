import redisClient from "./redisClient";

export async function setKey(
  key: string,
  value: string,
  expirySeconds: number,
) {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }

  // Ensure client is connected
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  if (expirySeconds > 0) {
    await redisClient.set(key, value, { EX: expirySeconds });
  } else {
    await redisClient.set(key, value);
  }
}

export async function getValueAndTtl(key: string) {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }

  // Ensure client is connected
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  const value = await redisClient.get(key);
  const ttl = await redisClient.ttl(key);
  return { value, ttl };
}

export async function getAllKeys() {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }

  // Ensure client is connected
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  const keys = await redisClient.keys("*");
  return keys;
}

export async function getValue(key: string) {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }

  // Ensure client is connected
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  const value = await redisClient.get(key);
  return value;
}

export async function deleteKey(key: string) {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }

  // Ensure client is connected
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  await redisClient.del(key);
}

export async function connectRedis() {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }

  await redisClient.connect();
}

export async function disconnectRedis() {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }

  await redisClient.quit();
}
