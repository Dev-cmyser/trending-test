const express = require('express');
const axios = require('axios');
const redis = require('redis');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const redisClient = redis.createClient({ host: 'redis' });

app.post('/auth', async (req, res) => {
  try {
    const { login, password } = req.body;

    console.log(req.body, login, password)

    const authResponse = await axios.post('https://trending.bid/login', {
      login,
      password,
    });

    // console.log(authResponse)
    if (authResponse.status === 200 ) {
      console.log(authResponse.data, authResponse.token)
      redisClient.set('auth_token', authResponse.data.token);
      return res.status(200).json({ message: 'Authentication successful' });
    } else {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/balance', async (req, res) => {
  try {
    // Получите токен из Redis
    const authToken = await new Promise((resolve, reject) => {
      redisClient.get('auth_token', (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });

    if (!authToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const balanceResponse = await axios.get('https://trending.bid/balance', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return res.status(200).json({ status: true, balance: balanceResponse.data });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
