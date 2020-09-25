var express=require("express");
var app=express();
var passport=require("passport");
var mongoose=require("mongoose");
var Campground=require("./model/campground");
var Comment=require("./model/comment");
var User=require("./model/user");
var seedDB=require("./seeds");
var flash=require("connect-flash");
var localStrategy=require("passport-local"),
	methodOverride=require("method-override"),
	passportLocal=require("passport-local-mongoose");

var commentRoutes=require("./routes/comments"),
	campgroundRoutes=require("./routes/campgrounds"),
	authRoutes=require("./routes/index");
app.use(express.static("public"));

//seedDB(); //seed the database 
mongoose.connect("mongodb://Nandini:sne123@cluster0-shard-00-00.knzgk.mongodb.net:27017,cluster0-shard-00-01.knzgk.mongodb.net:27017,cluster0-shard-00-02.knzgk.mongodb.net:27017/yelp_camp?ssl=true&replicaSet=atlas-n7zeo1-shard-0&authSource=admin&retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true });
//mongodb://localhost:27017/yelp_camp
//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"This is the decryption key",
	resave: false,
	saveUninitialized: false
}))
app.use(flash()); //use this before passport configuration
app.use(methodOverride("_method"));
app.use(passport.initialize());  //use to use passport in our code
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var bodyParser=require("body-parser");
	app.use(bodyParser.urlencoded({extended:true}));
//MIDDLEWARE-- add this before all routes
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/",authRoutes);



function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login"); //if not logged in, go to login page
	}

app.listen(3000, function(){ 
  console.log('Server listening on port 3000');
});
