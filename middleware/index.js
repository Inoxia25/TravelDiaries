var Campground=require("../model/campground");
var Comment=require("../model/comment");
var middlewareObj={};

//middleware to allow user to edit and delete the posts only if its created it
 middlewareObj.checkCampOwnership=function(req,res,next){
	if(req.isAuthenticated()){ //checking if logged in
		Campground.findById(req.params.id,function(err,foundCamp){
			if(err) {req.flash("error","Sorry Campground not found :(");res.redirect("back");}
			else{
				//does user own the campground
				if(foundCamp.author.id.equals(req.user._id))
					next();
				else {req.flash("error","You dont have the permission to do that!");res.redirect("back");}
			}
		
		})
	}
	else { req.flash("error","You need to be logged in to do that!");
		res.redirect("/login");}
}

 middlewareObj.checkCommentOwnership=function(req,res,next){
	if(req.isAuthenticated()){ //checking if logged in
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err) {req.flash("error","Comment not found!"); res.redirect("back");}
			else{
				//has user wriiten the comment
				if(foundComment.author.id.equals(req.user._id))
					next();
				else { req.flash("error","You dont have permission to do that!");res.redirect("back");}
			}
		
		})
	}
	else {req.flash("error","You need to be logged in to do that!"); res.redirect("back");}
}

middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be loged in first!");
	res.redirect("/login"); //if not logged in, go to login page
	}
module.exports=middlewareObj;