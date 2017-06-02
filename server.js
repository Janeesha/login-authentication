var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var morgan=require("morgan");
var jwt=require("jsonwebtoken");
var router=express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

var user=require("./module/user");

var config=require("./config");

app.use(morgan('dev'));

app.set('secreatkey',config.SECREAT);

console.log(app.get('secreatkey'))

mongoose.connect(config.DATABASECON,function(){
	console.log("connected database sucessfully")
})

router.get("/getUser/:name",function(request,response){
	var name=request.params.name;
	user.getUserByName(name,function(err,data){
		if(err){
		throw err;
	}

	response.json(data)
	})
	
})
// router.get("/getUser",function(request,response){
// 	user.getUserByName(function(err,data){
// 		if(err){
// 		throw err;
// 	}

// 	response.json(data)
// 	})
	
// })

router.post("/createUser",function(request,response){

var userobj=request.body;

user.createUser(userobj,function(err,data){
	if(err){
		throw err;
	}

	response.json(data)
})

})


router.post("/authenticate",function(request,response){
	var username=request.body.name;
	var  password=request.body.password;

	user.getUserByName(username,function(err,User){
		if(err){
			throw err;
		}

		if(!User){
			response.json({
				success:false,
				message:"authentication failed user is not found"
			})
		}
		else if(User)//database user
		{
			if(User.password!=password)
			{

				response.json({    //it will return data to browser display it in browser
					sucess:false,
					message:"authentication failed password error"
				})
		}
		else
		{
			var token=jwt.sign(User,app.get('secreatkey'));

			response.json({
				success:true,
				message:"here is your token",
				token:token
			})
		}
    
		}
	});
})

router.use(function(request,response,next){   //param nothing but query
	var token=request.body.token||request.query.token||request.headers["x-access-token"];
	if(token){
      jwt.verify(token,app.get('secreatkey'),function(err,decoded){
      	if(err){
      		response.json({
      			sucess:false,
      			message:"authention failed ,not a valid token"
      		})
      	}
     request.decoded=decoded;
     next();//put otherwise browser will to loop
	})
  }
	else{

         response.status(403).send({
         	sucess:false,
         	message:"please provide a token"           //middleware
         })
	}
})


router.get("/getUser",function(request,response){
	user.getUserByName(function(err,data){
		if(err){
		throw err;
	}                        //if you put this after middle ware then it will ask for 
	                          //token we have to give token in headerpart of the postman

	response.json(data)
	})
	
})

app.use("/api",router);
var port=process.env.PORT||1000;

app.listen(port,function(){
	console.log("server listening at port"+port)
})