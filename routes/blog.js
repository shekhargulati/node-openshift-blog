var db_name = process.env.OPENSHIFT_APP_NAME || "nodeapp";

var connection_string = '127.0.0.1:27017/' + db_name;
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

var mongojs = require("mongojs");

var db = mongojs(connection_string, [db_name]);
var blogs = db.collection("blogs");


exports.new = function(req , res){
	res.render("blogs/create" , {"title" :"Create a new Blog"});
};

exports.save = function(req , res){


	var title = req.body.title ,
		description = req.body.description;
		
	var blog = {
				"title" : title,
				"description" : description,
				"createdOn" : new Date()
			};
	
	blogs.save(blog , function(err , saved){
				if(err || !saved){
					res.send("Blog not saved");
				
				}else{
					res.redirect('/blogs');
				}
	});
	

};

exports.list = function(req, res){
	blogs.find().limit(20).sort({createdOn: -1} , function(err , docs){
		if(!err){
			res.render("blogs/showall", {"title" : "Recently created "+docs.length+" blog(s)", "docs": docs});
		}else{
			res.send("Error "+err);
		}
	});
  	
};