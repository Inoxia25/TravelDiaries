var express=require("express");
var router=express.Router({mergeParams:true});
var middleware=require("../middleware"); //no need of writing index .js as directory always calls index.js by default
var Campground=require("../model/campground");
router.get("/",function(req,res){
	//get all campgrouns from database
	Campground.find({},function(err,campgrounds){
		if(err)
			console.log(err);
		else
			res.render("campgrounds/campground.ejs",{campground: campgrounds});
	
	})
});
	
router.get("/new",middleware.isLoggedIn,function(req,res){
	
	res.render("campgrounds/adding.ejs");
});
router.post("/",middleware.isLoggedIn,function(req,res){
	
	var name=req.body.name1;
	var image=req.body.image;
	var des=req.body.description;
	var pr=req.body.price;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var Camp={name: name, url: image, description: des, price:pr,author:author};
	Campground.create(Camp,function(err,newlyCreated){
		if(err)
		{req.flash("error","Unable to create campground!");console.log(err);}
		else
		{req.flash("success","Campground successfully created");res.redirect("/campgrounds");}
	});			 	
});
//SHOW- shows more info abt the campsite
router.get("/:id",function(req,res)
	   {
	//findng the campground by id
	Campground.findById(req.params.id).populate("comments").exec(function(err,found){ //as Campgrounds has comments in form of id, we populate it and put in actual comments and then exec the callback function
		if(err)
		{req.flash("error","Cant find campground"); console.log(err);}
			else
				res.render("campgrounds/show.ejs",{campground: found});
	});
});
//edit route
	router.get("/:id/edit",middleware.checkCampOwnership,function(req,res){
		Campground.findById(req.params.id,function(err,foundCamp){
			if(err) console.log(err);
			else
				res.render("campgrounds/edit.ejs",{campground:foundCamp})
		})
		
	})
//update route
router.put("/:id",middleware.checkCampOwnership,function(req,res){
	var newCamp={
		name: req.body.name1,
		url: req.body.image,
		description: req.body.description,
		price: req.body.price
	}
	Campground.findByIdAndUpdate(req.params.id,newCamp,function(err,updatedCamp){
		if(err) {req.flash("error","Sorry could not find the campground!");console.log(err);}
		else
		{req.flash("success","Campground successfully updated!");
			res.redirect("/campgrounds/"+req.params.id);}
	})
})
//delete route
router.delete("/:id",middleware.checkCampOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){req.flash("error","Sorry could not find your campground :("); res.redirect("/campgrounds");}
		else
		{req.flash("success","Campground successfully deleted!");res.redirect("/campgrounds");}
	})
})


module.exports=router;