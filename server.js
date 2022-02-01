const app = require("./app");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require("dotenv").config();

const DB_URL = process.env.DB_URL;
async function startApp() {
  try {
    mongoose.connect(DB_URL);
    app.listen(3000, () => {
      console.log(`Database connection successful`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
startApp();

module.exports = startApp;
