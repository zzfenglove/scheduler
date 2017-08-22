var path=require('path');

var env=process.env.Node_ENV||'production';
env=env.toLowerCase();

var file=path.resolve(__dirname,env);
try{
	module.exports=require(file);
}catch(err){
	throw err;
}