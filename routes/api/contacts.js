const express = require("express");
const {
  get,
  getContact,
  post,
  remove,
  put,
  patch,
} = require("./controlRouter");

const router = express.Router();

router.get("/", get);

router.get("/:contactId", getContact);

router.post("/", post);

router.delete("/:contactId", remove);

router.put("/:contactId", put);

router.patch("/:contactId/favorite", patch);

module.exports = router;
