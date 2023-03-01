const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const campsiteRouter = require("./routes/campsiteRouter");
const promotionRouter = require("./routes/promotionRouter");
const partnerRouter = require("./routes/partnerRouter");

//add mongoose
const mongoose = require("mongoose");
//set up local host url
const url = "mongodb://localhost:27017/nucampsite";

//similar to mongoose exercise, setting property values
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// message is what we log to console if connection succeeds
connect.then(
  () => console.log("Connected correctly to server"),
  //console log error if connection is not completed, can add it as a second argument
  (err) => console.log(err)
);

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("12345-67890-09876-54321"));

function auth(req, res, next) {
  //signedCookies from cookie parser, will automatically parse signed cookie from req, if not properly signed will return false, user comes from us
  if (!req.signedCookies.user) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      //if authHeader is null returning a error message to let the client know they are not authenticated
      const err = new Error("You are not authenticated!");
      //this lets the client know the server is req authentication and the authentication is Basic
      res.setHeader("WWW-Authenticate", "Basic");
      //err code status
      err.status = 401;
      return next(err);
    }
    //buffer comes with node, from is static and used to decode username and password
    //split and toString belong to vanilla javascript

    const auth = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");
    const user = auth[0];
    const pass = auth[1];
    if (user === "admin" && pass === "password") {
      //express knows to use secret cookie from cookie parser  to sign cookie
      res.cookie("user", "admin", { signed: true });
      return next(); //authorized
    } else {
      //if not authorized returns error and trys authorization again
      const err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }
  } else {
    //checks for signed cookie
    if (req.signedCookies.user === "admin") {
      return next();
    } else {
      // returns error if cookie is not signed and prompts for login
      const err = new Error("You are not authenticated!");
      err.status = 401;
      return next(err);
    }
  }
}

app.use(auth);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/campsites", campsiteRouter);
app.use("/promotions", promotionRouter);
app.use("/partners", partnerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
