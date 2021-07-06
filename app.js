var express = require("express");
var app = express();
var passport = require("passport");
var mongoose = require("mongoose");
var User = require("./model/user");
var flash = require("connect-flash");
var localStrategy = require("passport-local"),
  methodOverride = require("method-override");
var port = process.env.PORT || 3000;

var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  authRoutes = require("./routes/index");
app.use(express.static("public"));

mongoose.connect(
  "mongodb://Nandini:sne123@cluster0-shard-00-00.knzgk.mongodb.net:27017,cluster0-shard-00-01.knzgk.mongodb.net:27017,cluster0-shard-00-02.knzgk.mongodb.net:27017/yelp_camp?ssl=true&replicaSet=atlas-n7zeo1-shard-0&authSource=admin&retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true } 
);

//PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "This is the decryption key", //This is the secret used to sign the session ID cookie.
    resave: false, //Forces the session to be saved back to the session store, even if the session was never modified during the request.
    saveUninitialized: false, //Forces a session that is “uninitialized” to be saved to the store. A session is uninitialized when it is new but not modified.
  })
);
app.use(flash()); //use this after setting up the session as session is needed for flash
app.use(methodOverride("_method")); //lets use PUT or DELETE in places where the client doesn’t support it
app.use(passport.initialize()); //is a middle-ware that initialises Passport.
app.use(passport.session()); //middleware that alters the request object and change the 'user' value that is currently the session id (from the client cookie) into the true deserialized user object.

passport.use(new localStrategy(User.authenticate())); //used to authenticate User model with passport 
passport.serializeUser(User.serializeUser()); // used to serialize the user for the session
passport.deserializeUser(User.deserializeUser()); // used to deserialize the user

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));//parses incoming request bodies to json objects and lets us create objects from forms

//MIDDLEWARE-- add this before all routes
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", authRoutes);

app.listen(port, function () {
  console.log("Server listening on port");
});
