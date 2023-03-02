const express = require("express");
const User = require("../models/user");
const passport = require("passport");

const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", (req, res) => {
  //registering with passport
  User.register(
    //new user created with name from client
    new User({ username: req.body.username }),
    //second arg is password from incoming client req
    req.body.password,
    //third arg is callback that will receive error if there was one or null if there was no error
    (err) => {
      //checking to see if there was an error
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        //if made it through then authentication proceeds
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      }
    }
  );
});
//login authentication with passport, passport handles all validation for us, we just need status code, header, and boolean success and message
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, status: "You are successfully logged in!" });
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
