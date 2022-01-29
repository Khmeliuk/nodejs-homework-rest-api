const mongoose = require("mongoose");
const Shema = mongoose.Schema;

const contacts = new Shema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const Contacts = mongoose.model("contact", contacts);

module.exports = Contacts;
