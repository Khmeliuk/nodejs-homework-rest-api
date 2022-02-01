const express = require("express");
const router = express.Router();
const { auth, signup, current, logout, login } = require("./ctrlUser");

require("dotenv").config();

router.post("/users/login", login);

router.post("/users/signup", signup);

router.get("/users/current", auth, current);

router.get("/users/logout", auth, logout);

module.exports = router;
