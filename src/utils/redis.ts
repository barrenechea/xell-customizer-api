import { RedisClient } from "bun";

const redis = new RedisClient(process.env.REDIS_URL ?? "redis://localhost:6379");

export default redis;
