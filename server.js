const app = require("./app");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const DB_URL =
  "mongodb+srv://Artem:1123581321f@cluster0.jzgju.mongodb.net/GOIT";

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
