const { configDotenv } = require("dotenv");
const express = require("express");
const { default: mongoose } = require("mongoose");
const http = require("http"); // Add this line
const app = express();
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const config = require("./config/index.js");
const { notFound, errorHandler } = require("./middleware/common/error.js");
const userRoutes = require("./routes/userRoutes.js");
const loginRoutes = require("./routes/loginRoutes.js");
const inboxRoutes = require("./routes/inboxRoutes.js");
const moment = require("moment");

// connect with .env file
configDotenv();

app.use(cookieParser());

// Create an HTTP server and pass the express app to it
const server = http.createServer(app);

// socket creation
const io = require("socket.io")(server);
global.io = io;

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// set comment as app locals
app.locals.moment = moment;

// connect with mongodb
try {
  mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  console.log("connect with db ok.");
} catch (error) {
  console.log(error);
}

app.use(express.json());

// middleware
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

server.listen(config.environment.httpPort, () => console.log(`${process.env.APP_NAME} listening on port ${config.environment.httpPort}!`));
