const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
const PORT=process.env.PORT || 3000;
const homeStartingContent = "Choosing between Goa and Manali for your travel adventure depends on your preferences. If you crave sandy shores, vibrant nightlife, and a tropical vibe, opt for Goa. Enjoy beach parties, water sports, and Portuguese-inspired architecture. Alternatively, if you're drawn to mountains, serene landscapes, and cooler weather, Manali is ideal. Trek in lush forests, visit Rohtang Pass, and relish local culture. Both offer distinct experiences – Goa for a sun-soaked beach getaway, and Manali for a mountain retreat. Consider your desire for relaxation or adventure, warm or cool climate, and beach or mountain scenery when making your decision.";




const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser:true},{ useUnifiedTopology: true });

const postsSchema = mongoose.Schema({
	title: String,
	content: String
});

const Posts = mongoose.model('Post', postsSchema);


app.get('/', function(req,res){
	Posts.find({},function(err,found){
		if (!err){
			res.render('home',{
				homeStartingContent: homeStartingContent,
				posts: found
			});
		}
	});
});

app.get('/about',function(req,res){
	res.render('about',{aboutContent:aboutContent});
});

app.get('/contact',function (req,res) {
	res.render('contact',{contactContent:contactContent});
});


app.get('/compose', function(req,res){
	res.render('compose');
});

app.post('/compose', function (req,res) {

	const post =new Posts( {
		title: req.body.postTitle, 
		content: req.body.postBody
	});
	post.save();
	res.redirect('/');
});

app.get('/posts/:postID', function(req,res){
	const postedID = req.params.postID;

	Posts.findOne({_id: postedID},function(err,found){
		if(!err){
			res.render('post',{
				postTitle: found.title,
				postContent: found.content
			});
		}else{
			console.log(err);
		}
	});
});




app.listen(PORT, function() {
  console.log("Server started on port 3000");
});