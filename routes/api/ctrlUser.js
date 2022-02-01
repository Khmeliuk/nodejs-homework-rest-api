const Joi = require("joi");
const passport = require("passport");
const User = require("../../models/user");
require("dotenv").config();
const secret = process.env.SECRET;
const jwt = require("jsonwebtoken");

const userSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
});

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    console.log(user, "user");
    console.log(req.headers.authorization !== "Bearer " + user.token);
    if (!user || err || req.headers.authorization !== "Bearer " + user.token) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
        data: "Unauthorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

const login = async (req, res, next) => {
  const validator = userSchema.validate(req.body);
  if (validator.error) {
    res.json({
      Status: 400,
      message: validator.error.message,
    });
    return;
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password",
      data: "Bad request",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  await User.updateOne({ _id: user.id }, { token });

  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

const signup = async (req, res, next) => {
  const validator = userSchema.validate(req.body);
  if (validator.error) {
    res.json({
      Status: 400,
      message: validator.error.message,
    });
    return;
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      status: "Conflict",
      code: 409,
      ResponseBody: { message: "Email in use" },
    });
  }

  try {
    const newUser = new User({ email });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        user: {
          email: "example@example.com",
          subscription: "starter",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const current = (req, res, next) => {
  const validator = loginSchema.validate(req.body);
  if (validator.error) {
    res.json({
      Status: 400,
      message: validator.error.message,
    });
    return;
  }
  const { email } = req.user;
  console.log(req.user);
  res.json({
    status: "success",
    code: 200,
    data: {
      message: `Authorization was successful: ${email}`,
    },
  });
};

const logout = async (req, res, next) => {
  console.log(req);
  await User.updateOne({ _id: req.user.id }, { token: null });
  res.json({
    status: "success",
    code: 200,
  });
};

module.exports = { auth, signup, current, logout, login };
