var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../model/user");
var middleware=require("../middleware"); //no need of writing index .js as directory always calls index.js by default
router.get("/",function(req,res){
	res.redirect("/campgrounds");
});

//AUTH ROUTES
//show register form
router.get("/register",function(req,res){
	res.render("register.ejs");
})
//handle sign up logic
router.post("/register",function(req,res){
	
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err) {console.log(err); 
				 req.flash("error",err.message); //this prints the err as error on the screen. error object has many things and err.message gives us the problem occured
				return res.redirect("/register");} //in these cases always use res.redirect and not res.render as in res.render we dont go through the app.get route so the middlware where we specify req.error is not utilized
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to YelpCamp "+user.username);
			res.redirect("/campgrounds");
		})
	})
})

//show login form
router.get("/login", function(req,res){
	res.render("login.ejs");
})
//middleware
router.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect:"/login"
}),function(req,res){});
//LOGOUT 
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged You out");
	res.redirect("/campgrounds");
})


module.exports=router;