// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
	var formidable = require('formidable');
	var fs = require('fs-extra');
	var multer     =       require('multer');
	var done       =       false;
	
    // configuration =================

    mongoose.connect('mongodb://localhost:27017/sample');     // connect to mongoDB database on modulus.io
	app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
	app.use(multer({ dest: './public/images/',
		rename: function (fieldname, filename) {
			return filename+Date.now();
		},
		onFileUploadStart: function (file) {
			console.log(file.originalname + ' is starting ...')
		},
		onFileUploadComplete: function (file) {
			console.log(file.fieldname + ' uploaded to  ' + file.path)
			done=true;
		}
	}));
	
    app.listen(3000);
    console.log("App listening on port 3000");
	
	//Categories Table
	var Categories = mongoose.model('Categories', {
        name : String,
		avatar : String,
		active : Boolean,
		bgcolor : String,
		order : Number,
		createdBy : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'users'
		},
		date : {
			type : Date,
			default : Date.now
		}
    });
	
	//Subcategories Table
	var SubCategories	=	mongoose.model('SubCategories',{
		name : String,
		category_id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Categories'
		},
		avatar : String,
		active : Boolean,
		bgcolor : String,
		order : Number,
		createdBy : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'users'
		},
		date : {
			type : Date,
			default : Date.now
		}
	});
	
	//Site Configurations Table
	var SiteConfig = mongoose.model('siteconfig', {
        name : String,
		avatar : String,
		active : Boolean,
		createdBy : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'users'
		},
		date : {
			type : Date,
			default : Date.now
		}
    });
	
	var Pages	=	mongoose.model('pages',{
		name : String,
		content : String,
		category_id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Categories'
		},
		subcategory_id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'SubCategories'
		},
		active : Boolean,
		order : Number,
		createdBy : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'users'
		},
		attachments : [{name : String}],
		images : [{name :  String}],
		date : {
			type : Date,
			default : Date.now
		}
	});
	
	
	var Users	=	mongoose.model('users',{
		name : String,
		email : String,
		lid	: String,
		password : String,
		email : String,
		contact1 : String,
		contact2 :  String,
		role : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'userroles'
		},
		avatar : String,
		active : Boolean,
		date : {
			type : Date,
			default : Date.now
		}
	});
	
	var UserRoles	=	mongoose.model('userroles',{
		name : String,
		active : Boolean,
		date : {
			type : Date,
			default : Date.now
		}
	});
	
	/*Categories */
	
	//Get All categories
	app.get('/api/categories', function(req, res) {
		Categories.find({})
			.populate('createdBy')
			.exec(function(error, data) {
               res.json(data);
		});
    });
	
	//Get All Active categories
	app.get('/api/activecategories', function(req, res) {
		Categories.find({active:true})
			.populate('createdBy')
			.sort('order')
			.exec(function(error, data) {
               res.json(data);
		});
    });
	
	//Get Category by Id
	app.get('/api/categories/:cat_id', function(req, res) {
		Categories.findOne({_id:req.params.cat_id})
			.populate('createdBy')
			.exec(function(error, data) {
               res.json(data);
		});
    });
	
	//Add a New Category
    app.post('/api/categories', function(req, res) {
		Categories.create({
			name : req.body.name,
			avatar : req.body.avatar,
			active : true,
			createdBy : req.body.createdBy,
			bgcolor : req.body.bgcolor,
			order: 100,
            done : false
        }, function(err, data) {
			Categories.find({})
				.populate('createdBy')
				.exec(function(error, data) {
                res.json(data);
			});
        });
	});
	
	//delete a category By Id
    app.delete('/api/categories/:cat_id', function(req, res) {
        Categories.remove({
            _id : req.params.cat_id
        }, function(err, curr) {
            if (err)
                res.send(err);
			Categories.find()
				.populate('createdBy')
				.exec(function(error, data) {
				   res.json(data);
			});
        });
    });
	
	//Update a category By Id
	app.post('/api/categories/:id',function(req,res){
		Categories.findOne({ _id: req.params.id }, function (err, doc){
			doc.name = req.body.name;
			doc.avatar = req.body.avatar;
			doc.date = new Date;
			doc.save();
		});
		res.json('Category Updated');
	});
	
	//Update a category order By Id
	app.post('/api/updateCategoryOrder/:id',function(req,res){
		Categories.findOne({ _id: req.body._id }, function (err, doc){
			console.log(req.body._id);
			doc.order = req.params.id;
			doc.save();
		});
		res.json('Category Updated');
	});
	
	//Activate a category
	app.post('/api/activeCategory/',function(req,res){
		Categories.findOne({ _id: req.body._id }, function (err, doc){
			doc.active = req.body.active;
			doc.save();
		});
		res.json('Category Status Updated');
	});
	
	
	/*SiteConfig*/
	
	//Get All Site Config
	app.get('/api/siteconfig',function(req,res){
		SiteConfig.find(function(err,data){
			if(err)
				res.send(err);
			res.json(data);
		})
	});
	
	//Get Site Config By Id
	app.get('/api/siteconfig/:id',function(req,res){
		SiteConfig.findOne({ _id: req.params.id }, function (err, data){
			res.json(data);
		});
	});
	
	//Create a Site Configuration
	app.post('/api/createSiteConfig',function(req,res){
		SiteConfig.create({
			name : req.body.name,
			avatar : req.body.avatar,
			active : false,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);
			SiteConfig.find(function(err, data) {
                if (err)
                    res.send(err)
                res.json(data);
            });
        });
	});
	
	//Delete a Site Configuration
	app.delete('/api/siteconfig/:id', function(req, res) {
        SiteConfig.remove({
            _id : req.params.id
        }, function(err, curr) {
            if (err)
                res.send(err);
			SiteConfig.find(function(err, data) {
                if (err)
                    res.send(err)
                res.json(data);
            });
        });
    });
	
	//Update a Site configuration by Id
	app.post('/api/siteconfig/:id',function(req,res){
		SiteConfig.findOne({ _id: req.params.id }, function (err, doc){
			doc.name = req.body.name;
			doc.avatar = req.body.avatar;
			doc.date = new Date;
			doc.save();
		});
		res.json('site Config Updated');
	});
	
	//Activate a Site
	app.post('/api/activeSite/',function(req,res){
		SiteConfig.findOne({ _id: req.body._id }, function (err, doc){
			doc.active = req.body.active;
			doc.save();
		});
		res.json('site Status Updated');
	});
	
	
	
	/*Files Management*/
	
	//Upload a file
	app.post('/api/upload',function(req,res){
		if(done==true){
			res.json(req.files);
		}
	});
	
	//Delete a file
	app.delete('/api/deleteFile/:fileName',function(req,res){
		fs.remove('./public/images/'+req.params.fileName, function (err) {
			res.json("deleted successfully");
		});
	});
	
	//Load a default page
	app.get('/',function(req,res){
		  res.sendfile("index.html");
	});

	//Subcategories 
	
	//Get All Subcategories
	app.get('/api/subcategories', function(req, res) {
		SubCategories.find({})
            .populate('category_id')
			.populate('createdBy','-password')
            .exec(function(error, data) {
                res.json(data);
			});
    });
	
	//Get All Active subcategories
	app.get('/api/activesubcategories', function(req, res) {
		SubCategories.find({active:true})
			.populate('createdBy')
			.sort('order')
			.exec(function(error, data) {
               res.json(data);
		});
    });
	//Get Sub Category by Id
	app.get('/api/subcategories/:id', function(req, res) {
		SubCategories.findOne({_id:req.params.id})
			.populate('category_id')
			.populate('createdBy','-password')
            .exec(function(error, data) {
                res.json(data);
			});
    });
	//Create a new Subcategory
	app.post('/api/subcategories', function(req, res) {
		SubCategories.create({
			name : req.body.name,
			category_id : req.body.category_id,
			avatar : req.body.avatar,
			active : true,
			createdBy : req.body.createdBy,
			bgcolor : req.body.bgcolor,
			order: 100,
            done : false
        }, function(err, data) {
			SubCategories.find({})
            .populate('category_id')
			.populate('createdBy','-password')
            .exec(function(error, data) {
                res.json(data);
            })
        });
	});
	
	//delete a Sub category By Id
    app.delete('/api/subcategories/:id', function(req, res) {
        SubCategories.remove({
            _id : req.params.id
        }, function(err, curr) {
            if (err)
                res.send(err);
			SubCategories.find({})
            .populate('category_id')
			.populate('createdBy','-password')
            .exec(function(error, data) {
                res.json(data);
            })
        });
    });
	
	//Update a sub category By Id
	app.post('/api/subcategories/:id',function(req,res){
		SubCategories.findOne({ _id: req.params.id }, function (err, doc){
			doc.name = req.body.name;
			doc.avatar = req.body.avatar;
			doc.category_id = req.body.category_id;
			doc.date = new Date;
			doc.save();
		});
		res.json('Category Updated');
	});
	
	//Activate a sub category
	app.post('/api/activeSubCategory/',function(req,res){
		SubCategories.findOne({ _id: req.body._id }, function (err, doc){
			doc.active = req.body.active;
			doc.save();
		});
		res.json('Category Status Updated');
	});
	
	//Get Sub Category by Cat Id
	app.get('/api/subcategoriesByCatId/:id', function(req, res) {
		SubCategories.find({category_id:req.params.id,active:true})
			.populate('category_id')
			.sort('order')
			.populate('createdBy','-password')
            .exec(function(error, data) {
                res.json(data);
			});
    });
	
	//Update a category order By Id
	app.post('/api/updateSubCategoryOrder/:id',function(req,res){
		SubCategories.findOne({ _id: req.body._id }, function (err, doc){
			doc.order = req.params.id;
			doc.save();
		});
		res.json('SubCategory Updated');
	});
	
	/* Pages */
	
	//Get All categories
	app.get('/api/pages', function(req, res) {
		Pages.find({})
			.populate('category_id')
			.populate('subcategory_id')
			.populate('createdBy','-password')
            .exec(function(error, data) {
                res.json(data);
			});
    });
	//Get Page by Id
	app.get('/api/pages/:id', function(req, res) {
		Pages.findOne({_id:req.params.id})
			.populate('category_id')
			.populate('subcategory_id')
			.populate('createdBy','-password')
            .exec(function(error, data) {
                res.json(data);
			});
    });
	//Create a new Page
	app.post('/api/pages', function(req, res) {
		Pages.create({
			name : req.body.name,
			category_id : req.body.category_id,
			subcategory_id : req.body.subcategory_id,
			content : req.body.content,
			createdBy : req.body.createdBy,
			attachments : req.body.docList,
			images : req.body.imageList,
			active : false,
            done : false
        }, function(err, data) {
			Pages.find({})
            .populate('category_id')
			.populate('subcategory_id')
			.populate('createdBy','-password')
            .exec(function(error, data) {
                res.json(data);
            })
        });
	});
	
	//delete a page By Id
    app.delete('/api/pages/:id', function(req, res) {
        Pages.remove({
            _id : req.params.id
        }, function(err, curr) {
            if (err)
                res.send(err);
			Pages.find({})
            .populate('category_id')
			.populate('subcategory_id')
			.populate('createdBy','-password')
            .exec(function(error, data) {
                res.json(data);
            })
        });
    });
	
	//Update a Page By Id
	app.post('/api/pages/:id',function(req,res){
		Pages.findOne({ _id: req.params.id }, function (err, doc){
			doc.name = req.body.name;
			doc.category_id = req.body.category_id;
			doc.subcategory_id = req.body.subcategory_id;
			doc.content = req.body.content;
			doc.date = new Date;
			doc.images	=	req.body.imageList;
			doc.attachments	=	req.body.docList;
			doc.save();
		});
		res.json('Page Updated');
	});
	
	
	//Activate a page
	app.post('/api/activePage/',function(req,res){
		Pages.findOne({ _id: req.body._id }, function (err, doc){
			doc.active = req.body.active;
			doc.save();
		});
		res.json('Page Status Updated');
	});
	
	//Get Page by category Id
	app.get('/api/pageByCatId/:id', function(req, res) {
		Pages.findOne({category_id:req.params.id,active:true})
			.populate('category_id')
			.populate('createdBy','-password')
            .exec(function(error, data) {
                res.json(data);
			});
    });
	
	//Get Page by category Id
	app.get('/api/allPagesByCatId/:id', function(req, res) {
		Pages.find({category_id:req.params.id,active:true})
			.populate('category_id')
			.populate('createdBy','-password')
            .exec(function(error, data) {
                res.json(data);
			});
    });
	
	//Get Page by Sub category Id
	app.get('/api/pageBySubCatId/:id', function(req, res) {
		Pages.findOne({subcategory_id:req.params.id,active:true})
			.populate('category_id')
			.populate('createdBy','-password')
			.populate('subcategory_id')
            .exec(function(error, data) {
                res.json(data);
			});	
    });
	
	//Get Page by Sub category Id
	app.get('/api/allPagesBySubCatId/:id', function(req, res) {
		Pages.find({subcategory_id:req.params.id,active:true})
			.populate('category_id')
			.populate('createdBy','-password')
			.populate('subcategory_id')
            .exec(function(error, data) {
                res.json(data);
			});	
    });
	
	/*User Access */
	
	//Get All user roles list
	app.get('/api/userroles/', function(req, res) {
		UserRoles.find(function(err, data) {
			res.json(data);
        });
    });
	
	
	//Get User Role by Id
	app.get('/api/userroles/:id', function(req, res) {
		UserRoles.findOne({_id:req.params.id},function(err, data) {
            res.json(data);
        });
    });
	
	//Add a New user role
    app.post('/api/userroles/', function(req, res) {
		UserRoles.create({
			name : req.body.name,
            done : false
        }, function(err, data) {
			UserRoles.find(function(err, data) {
                res.json(data);
            });
        });
	});
	
	//Delete a user role
	app.delete('/api/userroles/:id', function(req, res) {
        UserRoles.remove({
            _id : req.params.id
        }, function(err, curr) {
            UserRoles.find(function(err, data) {
                res.json(data);
            });
        });
    });
	
	//Update a user role by Id
	app.post('/api/userroles/:id',function(req,res){
		UserRoles.findOne({ _id: req.params.id }, function (err, doc){
			doc.name = req.body.name;
			doc.date = new Date;
			doc.save();
		});
		res.json('user role Updated');
	});
	
	//Activate a Role
	app.post('/api/activeuserrole/',function(req,res){
		UserRoles.findOne({ _id: req.body._id }, function (err, doc){
			doc.active = req.body.active;
			doc.save();
		});
		res.json('user role Status Updated');
	});
	
	
	
	/*Users */
	
	//Get All user roles list
	app.get('/api/users/', function(req, res) {
		Users.find({})
		.populate('role')
		.exec(function(error,data){
			res.json(data);
		});
    });
	
	
	//Get User Role by Id
	app.get('/api/users/:id', function(req, res) {
		Users.findOne({ _id: req.params.id })
		.populate('role')
		.exec(function(error,data){
			res.json(data);
		});
    });
	
	//Get User Role by Id
	app.get('/api/userByLid/:lid', function(req, res) {
		Users.findOne({ lid: req.params.lid })
		.populate('role')
		.exec(function(error,data){
			res.json(data);
		});
    });
	
	//Add a New user role
    app.post('/api/users/', function(req, res) {
		Users.create({
			name : req.body.name,
			email : req.body.email,
			lid : req.body.lid,
			role : req.body.role_id,
			email : req.body.email,
			contact1: req.body.contact1,
			contact2: req.body.contact2,
			password : req.body.password,
			avatar : req.body.avatar,
			active : false,
            done : false
        }, function(err, data) {
			Users.find(function(err, data) {
				Users.find({})
				.populate('role')
				.exec(function(error,data){
					res.json(data);
				});
            });
        });
	});
	
	//Add a New guest user role
    app.post('/api/guestusers/', function(req, res) {
		Users.create({
			name : req.body.name,
			email : req.body.email,
			lid : req.body.lid,
			email : req.body.email,
			contact1: req.body.contact1,
			contact2: req.body.contact2,
			role : '55e51bb122a8d3541f000001',
			password : req.body.password,
			avatar : req.body.avatar,
			active : false,
            done : false
        }, function(err, data) {
			res.json({call:"success",msg:"Your Account Has Created Successfully.."});
        });
	});
	
	//Delete a user role
	app.delete('/api/users/:id', function(req, res) {
        Users.remove({
            _id : req.params.id
        }, function(err, curr) {
            Users.find(function(err, data) {
                Users.find({})
				.populate('role')
				.exec(function(error,data){
					res.json(data);
				});
            });
        });
    });
	
	//Update a user role by Id
	app.post('/api/users/:id',function(req,res){
		Users.findOne({ _id: req.params.id }, function (err, doc){
			doc.name = req.body.name;
			doc.email = req.body.email;
			doc.role	=	req.body.role_id;
			doc.avatar = req.body.avatar;
			doc.email = req.body.email;
			doc.contact1 = req.body.contact1;
			doc.contact2 = req.body.contact2;
			doc.date = new Date;
			doc.lid = req.body.lid;
			doc.save();
		});
		res.json('user role Updated');
	});
	
	//Activate a Role
	app.post('/api/activeuser/',function(req,res){
		Users.findOne({ _id: req.body._id }, function (err, doc){
			doc.active = req.body.active;
			doc.save();
		});
		res.json('user Status Updated');
	});
	
	//Get User Role by Id
	app.post('/api/checkUserLogin/', function(req, res) {
		Users.findOne({ lid: req.body.lid, password : req.body.password })
		.populate('role')
		.exec(function(error,data){
			res.json(data);
		});
    });
