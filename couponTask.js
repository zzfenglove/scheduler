var schedule=require('node-schedule');
var log=require('./log');
var config=require('./config');
var usercoupon=require('./usercoupon');
var util=require('./util');
var userregion=require('./userregion');
var http=require('./http');

function scheduleCouponTask(){
	schedule.scheduleJob(config.schedulerCron.couponTaskCron, function(){
		func();
    }); 	
}

getItem=function(id,item){
	var result={};
	for(var i=0;i<item.length;i++){
		if(id==item[i].UserID){
			result = item[i];
			break;
		}
	}
	return result;
}


function func(){
	usercoupon.getUserCouponCount(function(data){
		var count=parseInt(data.result);
		var pageSize=5000;
		var page=Math.ceil(count/pageSize);
		log.couponLog.info(`共有${page}页`);
		for(var i=1;i<=page;i++){
			log.couponLog.info(`当前页：${i}`);
			usercoupon.getUserCoupon(i,pageSize,function(record){
            	var usercouponrecord=record.result;
            	var userIds=[];
            	if(usercouponrecord){
            		usercouponrecord.forEach(function(value,index,array){
	            		if(!userIds.contains(value.UserID))
	            			userIds.push(value.UserID);
	            	});
	            	userregion.getUserRegion(userIds.join(','),function(regionRecord){	          
	            		if(regionRecord.result!=null&&regionRecord.result.recordset.length>0){
	            			var item=regionRecord.result.recordset;	           			   	            	       		            		
	            			usercouponrecord.forEach(function(value,index,array){
	            				var region=getItem(value.UserID,item);
	            				if(region.hasOwnProperty("RegionId")){
	            					value.RegionId=region.RegionId;	            					
	            				}else{
	            					value.RegionId=0;
	            				}
	            			});
	            		}else{
	            			usercouponrecord.forEach(function(value,index,array){
		            			value.RegionId=0;	
		            		});		
	            		}

	            		var newusercouponrecord=usercouponrecord.sumUnic("UserID","cost");
	            		var postpara=JSON.stringify(newusercouponrecord);

	            		http.httpUtil.httppost(config.budgetapi.host,config.budgetapi.path,postpara,function(data){
							log.couponLog.info("[接收到的消息]---[请求消息：]"+postpara+"[返回消息：]"+data);
						},function(err){
							log.couponLog.info("err");
						});	           		
	            	});
            	}            	
			});
		}
	})
}

scheduleCouponTask();