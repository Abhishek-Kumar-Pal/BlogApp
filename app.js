var express=require("express"),
	app=express(),
	bodyParser=require("body-parser"),
	mongoose=require("mongoose"),
	expressSanitizer=require("express-sanitizer"),
	methodOverride=require("method-override");

//Mongoose Warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//APP CONFIG
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost:27017/blog_app");

//Mongoose Schema and model
var blogSchema=mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created:{type:Date,default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title:"Test blog",
// 	image :"https://www.outsideonline.com/sites/default/files/styles/width_1200/public/2018/05/31/favorite-free-camping-apps_h.jpg?itok=C1-xTIws",
// 	body:"It is a cool place to visit"
// });

//Routes
app.get("/",function(req,res){
	res.redirect("/blogs");
});

//Index
app.get("/blogs",function(req,res){
	Blog.find(function(err,blogs){
		if(err){
			console.log("Error!");
		} else {
			res.render("index",{blogs:blogs});
		}
	});
});

//New
app.get("/blogs/new",function(req,res){
	res.render("new");
});

//Create
app.post("/blogs",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,blog){
		if(err){
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	});
});

//Show
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show",{blog:blog});
		}
	});
});

//Edit
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit",{blog : foundBlog});
		}
	});
});

//Update
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//Delete
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});

app.listen(process.env.PORT || 3000,process.env.IP,function(){
	console.log("Server has started");
});

