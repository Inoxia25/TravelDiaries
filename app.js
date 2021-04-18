var express=require("express");
var app=express();
var passport=require("passport");
var mongoose=require("mongoose");
var Campground=require("./model/campground");
var Comment=require("./model/comment");
var User=require("./model/user");
var flash=require("connect-flash");
var localStrategy=require("passport-local"),
	methodOverride=require("method-override");
var port = process.env.PORT || 3000
	//passportLocal=require("passport-local-mongoose");
//for spotify auth
var cookieParser = require('cookie-parser');
//const cookieSession = require('cookie-session');
var querystring = require('querystring');
var request = require('request'); // "Request" library

var commentRoutes=require("./routes/comments"),
	campgroundRoutes=require("./routes/campgrounds"),
	authRoutes=require("./routes/index");
app.use(express.static("public"));


mongoose.connect("mongodb://Nandini:sne123@cluster0-shard-00-00.knzgk.mongodb.net:27017,cluster0-shard-00-01.knzgk.mongodb.net:27017,cluster0-shard-00-02.knzgk.mongodb.net:27017/yelp_camp?ssl=true&replicaSet=atlas-n7zeo1-shard-0&authSource=admin&retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true });

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

/*function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login"); //if not logged in, go to login page
	}*/


//spotify authorization
var access_token;
var  s1,
    s2,
    a1,
    a2,
    p1,
    p2;
	app.use(cookieParser());
var client_id = '70ec80564b4d47e5ac8f94596023370a'; 
var client_secret = '4f50f5a4ab2e4440af4ae0dec9ddb94c'; 
var redirect_uri = 'https://travel-diariess.herokuapp.com/auth/spotify/callback'; 
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
var stateKey = 'spotify_auth_state';

app.get('/auth/spotify', function(req, res) {
	var state = generateRandomString(16);
   res.cookie(stateKey, state);
  
	// your application requests authorization
	var scope = 'user-read-private user-read-email';
	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
		  response_type: 'code',
		  client_id: client_id,
		  scope: scope,
		  redirect_uri: redirect_uri,
		  state: state
		}));
  });

  app.get('/auth/spotify/callback', function(req, res) {  
	var code = req.query.code || null;
	var state = req.query.state || null;
	var storedState = req.cookies ? req.cookies[stateKey] : null;
  
	if (state === null || state !== storedState) {
	  
	  res.redirect('/#' +
		querystring.stringify({
		  error: 'state_mismatch'
		}));
	} else {
	  console.log("Hey");
	  res.clearCookie(stateKey);
	  var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
		  code: code,
		  redirect_uri: redirect_uri,
		  grant_type: 'authorization_code'
		},
		headers: {
		  'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
		},
		json: true
	  };
  
	  request.post(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) {
  
		  access_token = body.access_token;
			var refresh_token = body.refresh_token;
  
		  var options = {  
			url: 'https://api.spotify.com/v1/me', 
			headers: { 'Authorization': 'Bearer ' + access_token },
			json: true
		  };
		  // use the access token to access the Spotify Web API
		  request.get(options, function(error, response, body) {
		
		   songs={};
			res.render("songs.ejs",{name:body.display_name,songs:songs});
		  });
		} else {
		  res.redirect('/#' +
			querystring.stringify({
			  error: 'invalid_token'
			}));
		}
	  });
	}
	
  });

// send id of spotify recommendations
app.get("/spotify/:name/:emotion", function(req, res) {
	var name=req.params.name;
	var emotion=req.params.emotion;
	var options = {  
		url:  'https://api.spotify.com/v1/search?q='+emotion+'k&type=playlist&limit=2',
		headers: { 'Authorization': 'Bearer ' + access_token },
		json: true
	  };
	  // use the access token to access the Spotify Web API
	  request.get(options, function(error, response, body) {
		
		p1=body.playlists.items[0].id;
		p2=body.playlists.items[1].id;
	 //getting the tracks
	 var options = {  
	  url:  'https://api.spotify.com/v1/search?q='+emotion+'k&type=track&limit=2',
	  headers: { 'Authorization': 'Bearer ' + access_token },
	  json: true
	};
	request.get(options, function(error, response, body) {

	  s1=body.tracks.items[0].id;
	  s2=body.tracks.items[1].id;

	var options = {  
	  url:  'https://api.spotify.com/v1/search?q='+emotion+'k&type=album&limit=2',
	  headers: { 'Authorization': 'Bearer ' + access_token },
	  json: true
	};
	request.get(options, function(error, response, body) {
	
	  a1=body.albums.items[0].id;
	  a2=body.albums.items[1].id;
	  var songs={
		  s1:s1,
		  s2:s2,
		  p1:p1,
		  p2:p2,
		  a1:a1,
		  a2:a2
	  }
	  res.render("songs.ejs",{name:name,songs:songs});
	});
	
	});
	  });
}
)
app.listen(port, function(){ 
  console.log('Server listening on port');
});
