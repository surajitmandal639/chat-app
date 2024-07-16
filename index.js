/**
 *
 */

const { configDotenv } = require("dotenv");
const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const nunjucks = require("./node_modules/nunjucks/index.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const config = require("./config/index.js");
const { notFound, errorHandler } = require("./middleware/common/error.js");
const userRoutes = require("./routes/userRoutes.js");
const loginRoutes = require("./routes/loginRoutes.js");
const inboxRoutes = require("./routes/inboxRoutes.js");

// connect with .env file
configDotenv();

app.use(cookieParser());

// connect with mongodb
try {
  mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  console.log("connect with db ok.");
} catch (error) {
  console.log(error);
}

app.use(express.json());

// middlewire
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "njk");


// Configure Nunjucks
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

// routing
app.use("/", loginRoutes);
app.use("/users", userRoutes);
// app.use("/api/users", userRoutes);
app.use("/inbox", inboxRoutes);

// app.get("/", function (req, res) {
//   res.render("index.html", { title: "Home Page", message: "This is home/ index page" });
// });

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(config.environment.httpPort, () => console.log(`${process.env.APP_NAME} listening on port ${config.environment.httpPort}!`));
