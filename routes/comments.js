//=======COMMENT SECTION========
//*************************************************
var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../model/campground");
var Comment=require("../model/comment");
var middleware=require("../middleware"); //no need of writing index .js as directory always calls index.js by default
//showing form to add new comment
router.get("/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCamp){
		if(err) console.log(err);
		else res.render("comments/new.ejs",{ campground:foundCamp});
	})
	
})
//posting a new comment
router.post("/",middleware.isLoggedIn,function(req,res){ //to prevent posting of data if not logged in, possible thru postman
	//lookup campground using id
	Campground.findById(req.params.id,function(err,found){
		if(err){
			req.flash("error","Sorry Campground not found");
		    console.log(err); 
			res.redirect("/campgrounds");}
		else
			//create new comments
		{Comment.create(req.body.comment, function(err, newComment)
						  {
				if (err) {req.flash("error","Unable to create new comment");console.log(err); res.redirect("back");}
				else
				{ newComment.author.id=req.user._id;
				 newComment.author.username=req.user.username;
				 newComment.save();
					//add comment to campground
					found.comments.push(newComment);
				 //save comment
				found.save();
					//redirect to campground show page
				 req.flash("success","Comment successfully created!");
				 res.redirect("/campgrounds/"+req.params.id);
				}
			})}
	})
})
//edit route for comment
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	//looking up campground by id
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
		if(err) { req.flash("error","Campground not found!");console.log(err);}
		else{
			foundCamp.comments.forEach(function(comment){
				if(comment._id.equals(req.params.comment_id)){
				   res.render("comments/edit.ejs",{campground:foundCamp,foundComment:comment});
				   }		
			})
		}
	})
})
//update route for comment
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	//looking up campground by id
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
		if(err) {req.flash("error","Campground not found!");console.log(err);}
		else{
			foundCamp.comments.forEach(function(comment){
				if(comment._id.equals(req.params.comment_id)){
				 comment.text=req.body.text;
					comment.save();
					req.flash("success","Comment successfully updated");
					res.redirect("/campgrounds/"+req.params.id);
				   }		
			})
		}
	})
})
//delete route for comments
router.delete("/:comment_id",function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err) { req.flash("error","Comment not found!");res.redirect("back");}
		else
			{req.flash("success","Comment successfully deleted!");
			res.redirect("/campgrounds/"+req.params.id);}
	})
})


module.exports=router;