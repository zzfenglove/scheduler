var mysql=require('mysql');
var config=require('./config');

var pool=mysql.createPool({
	host:config.mysql.host,
	user:config.mysql.user,
	password:config.mysql.password,
	port:config.mysql.port,
	database:config.mysql.database
});

exports.do=function(sql,callback){
	this.getConnection(function(err,connection){
		connection.query(sql,function(){
			callback.apply(connection,arguments);
			connection.release();
		})
	})
}.bind(pool);