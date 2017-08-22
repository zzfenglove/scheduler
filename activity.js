var mysqlconnection=require('./mysql');
var redis=require('./redis');
var log=require('./log');
var Q=require('q');

var strsql="select Id,Title,ActiveType,AreaId,StartTime,EndTime,0 as IsStart,0 as IsFinish from activity where ((startTime > CURRENT_DATE() and startTime <=ADDDATE(CURRENT_DATE(),1)) or (endTime > CURRENT_DATE() and endTime <=ADDDATE(CURRENT_DATE(),1))) and Status=2 union select Id,Title,ActiveType,AreaId,StartTime,EndTime,0 as IsStart,0 as IsFinish from Packageactivity where ((startTime > CURRENT_DATE() and startTime <=ADDDATE(CURRENT_DATE(),1)) or (endTime > CURRENT_DATE() and endTime <=ADDDATE(CURRENT_DATE(),1))) and Status=2";

exports.QueryActivity=function(){
	var deferred=Q.defer();
	mysqlconnection.do(strsql,function(err,result){
		redis.SaveActivity(result);	
		deferred.resolve(result);
	})
	return deferred.promise;	
}