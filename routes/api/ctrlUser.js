const Joi = require("joi");
const passport = require("passport");
const User = require("../../models/user");
require("dotenv").config();
const secret = process.env.SECRET;
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const transporter = require("../../config/mail");

const userSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
});

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
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

async function patchAvatar(id, patch) {
  return await User.findByIdAndUpdate({ _id: id }, patch, { new: true });
}

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

  if (!user || !user.validPassword(password) || !user.verify) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password or you email is not verify",
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
      ResponseBody: { message: email },
    });
  }

  try {
    const avatarURL = gravatar.url(email);
    const verificationToken = uuidv4();

    const emailOptions = {
      from: "bigsmash@ukr.net",
      to: req.body.email,
      subject: "verificationToken",
      text: "http://127.0.0.1:3000/users/verify/" + verificationToken,
    };
    try {
      transporter.sendMail(emailOptions);
    } catch (error) {
      console.log(error);
    }

    const newUser = new User({ email, avatarURL, verificationToken });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        user: {
          email: email,
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
  res.json({
    status: "success",
    code: 200,
    data: {
      message: `Authorization was successful: ${email}`,
    },
  });
};

const logout = async (req, res, next) => {
  await User.updateOne({ _id: req.user.id }, { token: null });
  res.json({
    status: "success",
    code: 200,
  });
};

const addAvatar = async (req, res, next) => {
  await Jimp.read(req.file.path)
    .then((avatar) => {
      return avatar.resize(256, 256).write(req.file.path);
    })
    .catch((err) => {
      console.error(err);
    });
  const { description } = req.body;
  const { path: temporaryName, originalname } = req.file;
  const newPathFile = path.join(process.cwd(), "./public/avatars");
  const fileName = path.join(newPathFile, `${req.user.email}${originalname}`);
  patchAvatar(req.user._id, { avatarURL: fileName });
  try {
    await fs.rename(temporaryName, fileName);
  } catch (err) {
    await fs.unlink(temporaryName);
    return next(err);
  }
  res.json({ description, message: fileName, status: 200 });
};

const verify = async (req, res, next) => {
  try {
    const verificationToken = req.params.verificationToken.toString();

    const user = await User.findOne({ verificationToken });
    if (user) {
      patchAvatar(user._id, { verify: true, verificationToken: null });
      res.json({ message: "Verification successful", status: 200 });
    } else
      res.json({
        Status: 404,
        message: "User not found",
      });
  } catch (error) {
    console.log(error);
  }
};

const reverify = async (req, res, next) => {
  try {
    const validator = loginSchema.validate(req.body);
    if (validator.error) {
      res.json({
        Status: 400,
        message: validator.error.message,
      });
      return;
    }

    const email = req.body.email;
    const user = await User.findOne({ email });
    if (user) {
      if (user.verificationToken) {
        const emailOptions = {
          from: "bigsmash@ukr.net",
          to: req.body.email,
          subject: "verificationToken",
          text: "http://127.0.0.1:3000/users/verify/" + user.verificationToken,
        };
        try {
          transporter.sendMail(emailOptions);
        } catch (error) {
          console.log(error);
        }
        res.json({ message: "Verification email sent", status: 200 });
      } else
        res.json({
          message: "Verification has already been passed",
          status: 400,
        });
    } else res.json({ message: "email is not exist" });
  } catch (error) {
    res.json({
      message: error,
    });
    console.error(error);
  }
};

module.exports = {
  auth,
  signup,
  current,
  logout,
  login,
  addAvatar,
  verify,
  reverify,
};
