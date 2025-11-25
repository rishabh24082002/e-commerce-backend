import redis from '../cache/redisClient.js';


export const cacheGet = async (key) => {
const data = await redis.get(key);
if (!data) return null;
try { return JSON.parse(data); } catch (err) { return null; }
};


export const cacheSet = async (key, value, ttlSeconds = 60) => {
await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
};


export const cacheDel = async (key) => {
await redis.del(key);
};