const express = require("express");
const User = require("../models/user");

const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", (req, res, next) => {
  //static method to check if a username already exists
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        // if this evaluates as truthy a matching username has been found
        const err = new Error(`User ${req.body.username} already exists!`);
        err.status = 403;
        return next(err);
      } else {
        //if no username was matched creates a username and password
        User.create({
          username: req.body.username,
          password: req.body.password,
        })
          //returns succes message
          .then((user) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ status: "Registration Successful!", user: user });
          })
          //error catch
          .catch((err) => next(err));
      }
    })
    //error for findone method returning rejected promise, it would mean something went wrong with method and error was encountered
    .catch((err) => next(err));
});

//req res next middleware function
router.post("/login", (req, res, next) => {
  //if sessions user is not authorized return authorization prompt
  if (!req.session.user) {
    const authHeader = req.headers.authorization;
    //copy and paste form previous setup, looking for authHeader
    if (!authHeader) {
      const err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }
    //once we have authHeader and parse username and password out of it
    const auth = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");
    const username = auth[0];
    const password = auth[1];
    //looking for matching username and password
    User.findOne({ username: username })
      .then((user) => {
        if (!user) {
          //username does not exist if no match
          const err = new Error(`User ${username} does not exist!`);
          err.status = 401;
          return next(err);
        } else if (user.password !== password) {
          //error for incorrect password
          const err = new Error("Your password is incorrect!");
          err.status = 401;
          return next(err);
        } else if (user.username === username && user.password === password) {
          //success message for authentication
          req.session.user = "authenticated";
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("You are authenticated!");
        }
      })
      .catch((err) => next(err));
  } else {
    //returns success
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("You are already authenticated!");
  }
});

router.get("/logout", (req, res, next) => {
  //checking for if a session exists
  //if it does were destroying the session, clear the cookie, and redirect it to the base page
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    //returns message saying they were never logged in
    const err = new Error("You are not logged in!");
    err.status = 401;
    return next(err);
  }
});

module.exports = router;
