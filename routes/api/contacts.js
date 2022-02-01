const express = require("express");
const {
  get,
  getContact,
  post,
  remove,
  put,
  patch,
} = require("./controlRouter");
const { auth } = require("./ctrlUser");

const router = express.Router();

router.get("/", auth, get);

router.get("/:contactId", auth, getContact);

router.post("/", auth, post);

router.delete("/:contactId", auth, remove);

router.put("/:contactId", auth, put);

router.patch("/:contactId/favorite", auth, patch);

module.exports = router;
