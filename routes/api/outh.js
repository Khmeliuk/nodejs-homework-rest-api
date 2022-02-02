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
} = require("./ctrlUser");

require("dotenv").config();

router.post("/users/login", login);

router.post("/users/signup", signup);

router.get("/users/current", auth, current);

router.get("/users/logout", auth, logout);

router.patch("/users/avatars", auth, multer.single("picture"), addAvatar);

module.exports = router;
