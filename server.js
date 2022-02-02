const app = require("./app");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require("dotenv").config();
const fs = require("fs").promises;

const isAccessible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async (folder) => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

const DB_URL = process.env.DB_URL;
async function startApp() {
  try {
    mongoose.connect(DB_URL);
    app.listen(3000, () => {
      console.log(`Database connection successful`);
      createFolderIsNotExist("tmp");
      createFolderIsNotExist("./public/avatars");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
startApp();

module.exports = startApp;
