const express = require("express");
const router = express.Router();
const multer = require("../../config/multer.js");
const {
  auth,
  signup,
  current,
  logout,
  login,
  addAvatar,
  verify,
  reverify,
} = require("./ctrlUser");

require("dotenv").config();

router.post("/users/login", login);

router.post("/users/signup", signup);

router.get("/users/current", auth, current);

router.get("/users/logout", auth, logout);

router.patch("/users/avatars", auth, multer.single("picture"), addAvatar);

router.get("/users/verify/:verificationToken", verify);

router.post("/users/verify", reverify);

module.exports = router;
