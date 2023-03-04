const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const authenticate = require("../authenticate");

const router = express.Router();

/* GET users listing. */
router.get(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  function (req, res, next) {
    res.send("respond with a resource");
  }
);

router.post("/signup", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    //adding in user to the params
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        //setting up check for firstname and lastname
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        //holy fucking refactoring jesus
        user.save((err) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
            return;
          }
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registration Successful!" });
          });
        });
      }
    }
  );
});
//login authentication with passport, passport handles all validation for us, we just need status code, header, and boolean success and message
router.post("/login", passport.authenticate("local"), (req, res) => {
  const token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!",
  });
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
