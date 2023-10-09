import { createClient } from "redis";

export default async function createRedisClient() {
    const client = createClient();

    client.on('error', error => console.log('Redis client error', error));

    await client.connect();

    return client;
}
