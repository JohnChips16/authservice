const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const axios = require('axios');
const pool = require('../dbconfig/config.db.js')
const hash = require('../lib/build/Release/hash');
const rand = require('../lib/build/Release/random')
const Redis = require('ioredis');
const redis = new Redis();
// const {
//   sendConfirmationEmail,
//   generateUniqueUsername,
// } = require('../utils/controllerUtils');
const {
  validateEmail,
  validateFullName,
  validateUsername,
  validatePassword,
} = require('../utils/validations.utils.js');

module.exports.verifyJwt = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = jwt.decode(token, process.env.JWT_SECRET).id;
const user = await pool.query(
  `SELECT email, username, avatar, bio, fullname, website, gender, phone_code_area, country, id
   FROM user_credentials
   WHERE id = $1;`,
  [id]
);

      if (user) {
        return resolve(user);
      } else {
        reject('Not authorized.');
      }
    } catch (err) {
      return reject('Not authorized.');
    }
  });
};

module.exports.requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).send({ error: 'Not authorized.' });
  try {
    const user = await this.verifyJwt(authorization);
    // Allow other middlewares to access the authenticated user details.
    res.locals.user = user;
    return next();
  } catch (err) {
    return res.status(401).send({ error: err });
  }
};

module.exports.optionalAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    try {
      const user = await this.verifyJwt(authorization);
      // Allow other middlewares to access the authenticated user details.
      res.locals.user = user;
    } catch (err) {
      return res.status(401).send({ error: err });
    }
  }
  return next();
};

// module.exports.loginAuthentication = async (req, res, next) => {
//   const { authorization } = req.headers;
//   const { usernameOrEmail, password } = req.body;
//   if (authorization) {
//     try {
//       const user = await this.verifyJwt(authorization);
//       return res.send({
//         user,
//         token: authorization,
//       });
//     } catch (err) {
//       return res.status(401).send({ error: err });
//     }
//   }

//   if (!usernameOrEmail || !password) {
//     return res
//       .status(400)
//       .send({ error: 'Please provide both a username/email and a password.' });
//   }

//   try {
//     const user = await pool.query(`SELECT *
// FROM user_credentials
// WHERE username = $1 OR email = $1;

// `, [usernameOrEmail])
//     if (!user || !user.password) {
//       return res.status(401).send({
//         error: 'The credentials you provided are incorrect, please try again.',
//       });
//     }

    // bcrypt.compare(password, user.password, (err, result) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   if (!result) {
    //     return res.status(401).send({
    //       error:
    //         'The credentials you provided are incorrect, please try again.',
    //     });
    //   }

      // res.send({
      //   user: {
      //     _id: user._id,
      //     email: user.email,
      //     username: user.username,
      //     avatar: user.avatar,
      //   },
      //   token: jwt.encode({ id: user._id }, process.env.JWT_SECRET),
      // });
    // });
    
//     const pwd = hash(password).toString('hex');
    
//     const isMatch = (pwd === user.password)
    
//     if (isMatch) {
//         res.status(200).send({
//         user: {
//           _id: user.id,
//           email: user.email,
//           username: user.username,
//           avatar: user.avatar,
//         },
//         token: jwt.encode({ id: user.id }, process.env.JWT_SECRET),
//       });
//     } else {
//       return res.status(401).send('wrong credentials.')
//     }
    
    
//   } catch (err) {
//     next(err);
//   }
// };


  


module.exports.loginAuthentication = async (req, res, next) => {
  const { authorization } = req.headers;
  const { usernameOrEmail, password } = req.body;
  if (authorization) {
    try {
      const user = await this.verifyJwt(authorization);
      return res.send({
        user,
        token: authorization,
      });
    } catch (err) {
      return res.status(401).send({ error: err });
    }
  }

  if (!usernameOrEmail || !password) {
    return res
      .status(400)
      .send({ error: 'Please provide both a username/email and a password.' });
  }

  try {
    const user = await pool.query(`SELECT *
FROM user_credentials
WHERE username = $1 OR email = $1;

`, [usernameOrEmail])


await redis.set(req.originalUrl, JSON.stringify(user), 'EX', 60*5); // Cache for 5 minutes

    if (!user.rows[0] || !user.rows[0].password) {
      return res.status(401).send({
        error: 'The credentials you provided are incorrect, please try again.',
      });
    }

    const pwd = hash(password).toString('hex');
    
    const isMatch = (pwd === user.rows[0].password)
    
    if (isMatch) {
        res.status(200).send({
        user: {
          _id: user.rows[0].id,
          email: user.rows[0].email,
          username: user.rows[0].username,
          avatar: user.rows[0].avatar,
        },
        token: jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET),
      });
    } else {
      return res.status(401).send('wrong credentials.')
    }
    
  } catch (err) {
    next(err);
  }
};



// module.exports.register = async (req, res, next) => {
//   const { username, fullname, email, password, phone_code_area, phone_number, country, gender } = req.body;

//   let user = null;
//   let confirmationToken = null;

//   const usernameError = validateUsername(username);
//   if (usernameError) return res.status(400).send({ error: usernameError });

//   const fullNameError = validateFullName(fullname);
//   if (fullNameError) return res.status(400).send({ error: fullNameError });

//   const emailError = validateEmail(email);
//   if (emailError) return res.status(400).send({ error: emailError });

//   const passwordError = validatePassword(password);
//   if (passwordError) return res.status(400).send({ error: passwordError });

//   try {
//     // user = new User({ username, fullName, email, password });
//     const confirmationToken = crypto.randomBytes(20).toString('hex');
    


// const user = {
//     text: `INSERT INTO user_credentials (username, fullname, email, password, phone_code_area, phone_number, country, gender)
// VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
//     values: [username, fullname, email, password,  phone_code_area, phone_number, country, gender],
//   };

// const { rows: userRows } = await pool.query(user);
//   const userId = userRows[0].id;

//     confirmationToken = await pool.query(`INSERT INTO confirmation_tokens(user_id, token) VALUES($1, $2)`, [userId, confirmationToken])
    
//     res.send('Register service succesful')
//     res.status(201).send({
//       user: {
//         email: user.email,
//         username: user.username,
//         gender: user.gender,
//         country: user.country,
//         fullname: user.fullname
//       },
//       token: jwt.encode({ id: user._id }, process.env.JWT_SECRET),
//     });
//   } catch (err) {
//     next(err);
//   }
//   // sendConfirmationEmail(user.username, user.email, confirmationToken.token);
// };



module.exports.register = async (req, res, next) => {
const { username, fullname, email, password, phone_code_area, phone_number, country, gender } = req.body;
let user = null;
let confirmationToken = null;

//need for validating more.


const fullNameError = validateFullName(fullname);
  if (fullNameError) return res.status(304).send({ error: fullNameError,
   message: "full name error"
  });

const usernameError = validateUsername(username);

if (usernameError) return res.status(400).send({ error: usernameError });

const emailError = validateEmail(email);
if (emailError) return res.status(400).send({ error: emailError });

const passwordError = validatePassword(password);
if (passwordError) return res.status(400).send({ error: passwordError });

try {
  // Generate a random token for confirmation
  const confirmationToken = rand.generateRandomString();
// const saltRounds = 10;
// const salt = bcrypt.genSaltSync(saltRounds);
// //need for c++ lib.
const hashed = hash(password);
const pwd = hashed.toString('hex')
  // Insert new user into the users table
  const userInsertQuery = {
    text: `INSERT INTO user_credentials (username, fullname, email, password, phone_code_area, phone_number, country, gender)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    values: [username, fullname, email, pwd,  phone_code_area, phone_number, country, gender],
  };

  const { rows: userRows } = await pool.query(userInsertQuery);
  const userId = userRows[0].id;

  // Insert confirmation token into confirmationToken table
  const confirmationTokenInsertQuery = {
    text: 'INSERT INTO confirmation_tokens(user_id, token) VALUES($1, $2)',
    values: [userId, confirmationToken],
  };

  await pool.query(confirmationTokenInsertQuery);

  // Generate JWT token for the user
  const authToken = jwt.sign({ id: userId }, process.env.JWT_SECRET);

  res.status(201).send({
    user: {
      email: email,
      username: username,
      gender: gender,
      fullname: fullname,
      country: country,
      phone_code_area: phone_code_area,
      phone_number: phone_number,
    },
    token: authToken,
  });
} catch (err) {
  next(err);
}
  // sendConfirmationEmail(user.username, user.email, confirmationToken.token);
};






module.exports.githubLoginAuthentication = async (req, res, next) => {
  const { code, state } = req.body;
  if (!code || !state) {
    return res
      .status(400)
      .send({ error: 'Please provide a github access code and state.' });
  }

  try {
    // Exchange the temporary code with an access token
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        state,
      }
    );
    const accessToken = response.data.split('&')[0].split('=')[1];

    // Retrieve the user's info
    const githubUser = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` },
    });

    // Retrieve the user's email addresses
    // Private emails are not provided in the previous request
    const emails = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `token ${accessToken}` },
    });
    const primaryEmail = emails.data.find((email) => email.primary).email;

    const userDocument = await User.findOne({ githubId: githubUser.data.id });
    if (userDocument) {
      return res.send({
        user: {
          _id: userDocument._id,
          email: userDocument.email,
          username: userDocument.username,
          avatar: userDocument.avatar,
          bookmarks: userDocument.bookmarks,
        },
        token: jwt.encode({ id: userDocument._id }, process.env.JWT_SECRET),
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: primaryEmail }, { username: githubUser.data.login }],
    });

    if (existingUser) {
      if (existingUser.email === primaryEmail) {
        return res.status(400).send({
          error:
            'A user with the same email already exists, please change your primary github email.',
        });
      }
      if (existingUser.username === githubUser.data.login.toLowerCase()) {
        const username = await generateUniqueUsername(githubUser.data.login);
        githubUser.data.login = username;
      }
    }

    const user = new User({
      email: primaryEmail,
      fullName: githubUser.data.name,
      username: githubUser.data.login,
      githubId: githubUser.data.id,
      avatar: githubUser.data.avatar_url,
    });

    await user.save();
    return res.send({
      user: {
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        bookmarks: user.bookmarks,
      },
      token: jwt.encode({ id: user._id }, process.env.JWT_SECRET),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = res.locals.user;
  let currentPassword = undefined;

  try {
    const userDocument = await User.findById(user._id);
    currentPassword = userDocument.password;

    const result = await bcrypt.compare(oldPassword, currentPassword);
    if (!result) {
      return res.status('401').send({
        error: 'Your old password was entered incorrectly, please try again.',
      });
    }

    const newPasswordError = validatePassword(newPassword);
    if (newPasswordError)
      return res.status(400).send({ error: newPasswordError });

    userDocument.password = newPassword;
    await userDocument.save();
    return res.send();
  } catch (err) {
    return next(err);
  }
};
