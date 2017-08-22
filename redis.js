var log=require('./log');
var config=require('./config');
var redis=require('redis'),
	client=redis.createClient(config.redis.port,config.redis.host);
var Q=require('q');


exports.SaveActivity=function(activity){
	client.select(config.redis.dbIndex,function(){
		client.del(config.redis.key,function(err,response){			
			client.set(config.redis.key,JSON.stringify(activity));
		})
	})
};

exports.GetActivity=function(){	
	var deferred=Q.defer();
	client.select(config.redis.dbIndex,function(){
		client.get(config.redis.key,function(err,res){	
			if(err){
				log.activityLog.info("获取数据失败："+err);
			}		
			deferred.resolve(res);
		})
	});
	return deferred.promise;
}

exports.SaveFinishActivity=function(activity){
	client.select(config.redis.dbIndex,function(){
		client.del(config.redis.finishKey,function(err,response){			
			client.set(config.redis.finishKey,JSON.stringify(activity));
		})
	})
}

exports.GetFinishActivity=function(){
	var deferred=Q.defer();
	client.select(config.redis.dbIndex,function(){
		client.get(config.redis.finishKey,function(err,res){	
			if(err){
				log.activityLog.info("获取数据失败："+err);
			}		
			deferred.resolve(res);	
		})
	});
	return deferred.promise;	
}

exports.DeleteFinishActivity=function(callback){
	client.select(config.redis.dbIndex,function(){
		client.del(config.redis.finishKey,function(err,response){			
			log.activityLog.info("清理数据完毕");
		})