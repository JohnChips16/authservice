const express = require('express');
const authRouter = express.Router();
const checkCache = require('../lib/redis/cache.redis')
const {
  loginAuthentication,
  register,
  // requireAuth,
  // changePassword,
} = require('../servicecontrol/auth.control.js');

authRouter.post('/login', loginAuthentication, checkCache);
authRouter.post('/register', register);
// authRouter.put('/password', requireAuth, changePassword);


authRouter.get('/test', async (req, res) => {
  try {
    res.send('Auth service success.')
  } catch (err) {
    res.send(err.message)
    console.error(err.message)
  }
})

module.exports = authRouter;