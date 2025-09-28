import redisClient from "./redisClient";

export async function setKey(
  key: string,
  value: string,
  expirySeconds: number,
) {
  if (expirySeconds > 0) {
    await redisClient.set(key, value, { EX: expirySeconds });
  } else {
    await redisClient.set(key, value);
  }
}

export async function getValueAndTtl(key: string) {
  const value = await redisClient.get(key);
  const ttl = await redisClient.ttl(key);
  return { value, ttl };
}

export async function getAllKeys() {
  const keys = await redisClient.keys("*");
  return keys;
}

export async function getValue(key: string) {
  const value = await redisClient.get(key);
  return value;
}

export async function deleteKey(key: string) {
  await redisClient.del(key);
}

export async function connectRedis() {
  await redisClient.connect();
}

export async function disconnectRedis() {
  await redisClient.quit();
}
