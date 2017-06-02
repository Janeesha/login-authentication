var mongoose=require("mongoose");
var userSchema=mongoose.Schema({
	name:{
		type:String
	},
	password:{
		type:String
	},
	admin:{
		type:Boolean
	}
})

var user=module.exports=mongoose.model("user",userSchema,"user");//collection name in db

module.exports.createUser=function(userObj,callback){
	return user.create(userObj,callback)
}

module.exports.getUserByName=function(name,callback){
	return user.findOne({name:name},callback);
}

 module.exports.getUserByName=function(callback){  //for id findById
 	return user.find(callback);
  }