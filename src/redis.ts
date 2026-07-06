import { createClient } from "redis";
import type { RedisClientType } from "redis";

const client: RedisClientType = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("error", (err) => console.error("Redis Client Error", err));
client.on("connect", () => console.log("Connected to Redis"));

export const connectRedis = async () => {
  await client.connect();
};

export default client;
