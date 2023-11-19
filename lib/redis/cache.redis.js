const Redis = require('ioredis');
const redis = new Redis();

// Exporting the function directly
module.exports = async function checkCache(req, res, next) {
  try {
    const cachedData = await redis.get(req.originalUrl);

    if (cachedData) {
      res.status(200).send('Data retrieved from Redis cache');
      return res.json(JSON.parse(cachedData));
    }

    next();
  } catch (error) {
    console.error('Error checking Redis cache:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
