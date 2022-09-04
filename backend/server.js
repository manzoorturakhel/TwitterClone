const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: `${__dirname}/config.env`,
});
const app = require("./app");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then((con) => {
    app.listen(8800, () => {
      console.log("listening to port 8800");
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
