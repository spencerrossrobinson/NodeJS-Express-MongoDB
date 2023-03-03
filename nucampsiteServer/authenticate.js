//importing passport localstrategy and user
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt; // object to extract token from req
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

//import config file
const config = require("./config.js");
//passport.use is how we apply the specific strategy plugin on how we want to implement authentication
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//whenever we use sessions and passport must serialize and deserialize
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//function that recieves function that contains user id for doc, returns token created by jwt.sign, set to expire in an hour
exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {}; //options for jwt strategy init as empty object
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //specifies how web token sh ould be extracted
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy( //takes in two arguments
    opts, //object with config options
    (jwt_payload, done) => {
      // verified callback funct
      console.log("JWT payload:", jwt_payload);
      //pulled from documentation of passport
      User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
          return done(err, false);
        } else if (user) {
          //no error and user was found
          return done(null, user);
        } else {
          //shows there was no error but no user was found,
          return done(null, false);
        }
      });
    }
  )
);

//used to verify req is coming from verified user, arg of jwt to show we want to use jwt strategy, session false means were not using sessions
exports.verifyUser = passport.authenticate("jwt", { session: false });
