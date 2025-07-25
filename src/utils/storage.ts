import type { FileStorage, UploadKey } from "../types";
import redis from "./redis";

const REDIS_PREFIX = "xell-customizer";

export const uploadKeys = {
  save: async (uploadKey: UploadKey): Promise<void> => {
    await redis.hset(`${REDIS_PREFIX}:upload:${uploadKey.id}`, "key", uploadKey.key);
    await redis.expire(`${REDIS_PREFIX}:upload:${uploadKey.id}`, 300);
  },
  find: async (id: string): Promise<UploadKey | null> => {
    const key = await redis.hget(`${REDIS_PREFIX}:upload:${id}`, "key");
    return key ? { id, key } : null;
  },
  delete: async (id: string): Promise<void> => {
    await redis.del(`${REDIS_PREFIX}:upload:${id}`);
  },
};

export const fileStorage = {
  save: async (storage: FileStorage): Promise<void> => {
    await redis.hset(`${REDIS_PREFIX}:file:${storage.id}`, {
      file: storage.file,
      filename: storage.filename,
    });
    await redis.expire(`${REDIS_PREFIX}:file:${storage.id}`, 300);
  },
  find: async (id: string): Promise<FileStorage | null> => {
    const data = await redis.hgetall(`${REDIS_PREFIX}:file:${id}`);
    return Object.keys(data).length > 0 ? { id, file: data.file, filename: data.filename } : null;
  },
  delete: async (id: string): Promise<void> => {
    await redis.del(`${REDIS_PREFIX}:file:${id}`);
  },
};
