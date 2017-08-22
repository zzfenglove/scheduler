var mysql=require('./mysql');
var log=require('./log');

exports.getUserCouponCount=function(callback){
	var strsql='select count(userID) as count from UserCoupon where IsUsed=0 and IsBudget=1 and (status=2 or status=64) and EndTime >= ADDDATE(CURRENT_DATE(),-1) and EndTime < CURRENT_DATE()';	
	mysql.do(strsql,function(err,data){
		if(err) callback({result:0});
		callback({result:data[0].count});
	});
}

exports.getUserCoupon=function(page,pageSize,callback){		
	var strsql=`select UserID,Price as cost from UserCoupon where IsUsed=0 and IsBudget=1 and (status=2 or status=64) and EndTime >= ADDDATE(CURRENT_DATE(),-1) and EndTime < CURRENT_DATE() limit ${(page-1)*pageSize},${pageSize}`;
	mysql.do(strsql,function(err,data){
		if(err) console.log(err);
		callback({result:data});
	});
}