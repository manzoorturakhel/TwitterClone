const express = require("express");
const morgan = require("morgan");

//routes
const userRoutes = require("./routes/userRoutes");
const mainRoutes = require("./routes/tweetRoutes");

// controllers
const globalErrorController = require("./controllers/globalErrorController");

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(morgan("dev"));

// routes
app.use("/api", mainRoutes);
app.use("/api/users", userRoutes);

app.use(globalErrorController);

app.use("*", (req, res, next) => {
  res.status(500).json({
    status: `this path ${req.originalUrl} is not found! `,
  });
});

module.exports = app;
