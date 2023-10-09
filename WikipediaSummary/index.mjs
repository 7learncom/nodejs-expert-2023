import express from 'express';
import { load } from 'cheerio';
import createRedisClient from './cache.mjs';

const CACHED_TOPIC_PREFIX = 'topic-';

const app = express();
const redisClient = await createRedisClient();

app.get('/topic/:topic', async (req, res) => {
    const topic = req.params.topic;

    const cacheKey = `${CACHED_TOPIC_PREFIX}${topic}`;
    const cachedSummery = await redisClient.get(cacheKey);

    if (cachedSummery) {
        res.send(cachedSummery);
        return;
    }

    const response = await fetch(`https://en.wikipedia.org/wiki/${topic}`);
    const data = await response.text();
    const $ = load(data);
    const summary = $('#mw-content-text > div.mw-parser-output > table.infobox + p').text();

    if (summary.length < 1) {
        res.status(404).send(`Topic "${topic}" not found!`);
        return;
    }

    await redisClient.set(cacheKey, summary, {
        EX: 60 * 30,
    });

    res.send(summary);
});

app.listen(3000, () => {
    console.log('WikipediaSummary is running on port 3000');
});
