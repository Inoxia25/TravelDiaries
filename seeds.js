
var mongoose=require("mongoose");
var Campground=require("./model/campground");
var Comment   = require("./model/comment");
var seeds = [
           {
        name: "Cloud's Rest", 
        url: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
            },
	{
		name: "Desert Mesa", 
        url: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
	{
		
        name: "Canyon Floor", 
        url : "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
	}
	]
function seedDB()
{   // remove Campgrounds
	Campground.remove({},function(err){
		/*if(err) console.log(err);
		else {console.log("Campgrounds removed");

	           //remove comments
	            Comment.remove({},function(err){
		         if(err) console.log(err);
		         else { console.log("Comments removed");
	
	                 //adding campgrounds to Campgrounds
	                   seeds.forEach(function(seed){
		               Campground.create(seed,function(err,newlyAdded){
			            if(err) console.log (err);
			             else {
				                console.log("Campground added");
				                //adding comments to campground
							     Comment.create(
                                    { author: "Homer",
                                    text: "This place is great, but I wish there was internet"
                                   
                                      }, function(err,comment){
										                       if(err) console.log(err);
										                        else{
																	newlyAdded.comments.push(comment);
																	newlyAdded.save();
																	console.log("Comment created");
																}
									  });
									 
						 }
		});
	});
					  }
				}
							   );
			 }*/
	})
}
				
					module.exports=seedDB;
