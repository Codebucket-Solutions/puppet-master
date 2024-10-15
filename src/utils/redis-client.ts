import { createClient } from 'redis';
import {queue} from "./queue-client";

export const redisClient = createClient(
    {
        url:  `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_TOKEN_DB_INDEX}`
    }
);

redisClient.on('error', err => console.log('Redis Client Error', err));

redisClient.connect().then(() => {
    console.log("Redis Client Connected");
}).catch(reason => {
    console.log("Redis Client Connection Failed", reason);
})