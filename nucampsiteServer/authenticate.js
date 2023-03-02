//importing passport localstrategy and user
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

//passport.use is how we apply the specific strategy plugin on how we want to implement authentication
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//whenever we use sessions and passport must serialize and deserialize
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
