var mongoose=require("mongoose");

var campgroundSchema=new mongoose.Schema({
	name: String, url: String, description: String,
	price:String,
	author: {id: { type: mongoose.Schema.Types.ObjectId,
				 ref:"User"},
			username:String},
	comments: [{
	type: mongoose.Schema.Types.ObjectId, //embedding the reference to ids of comments
	ref: "Comment" //the model name
}]
});
module.exports=mongoose.model("Campground",campgroundSchema);// changing var Campground to this an returning it