var redis=require('./redis');
var schedule=require('node-schedule');
var log=require('./log');
var activity=require('./activity');
var https=require('./https');
var config=require('./config');
var async=require('async');
var Q=require('q');
var util=require('./util');

function scheduleActivityTask(){
	schedule.scheduleJob(config.schedulerCron.monitorActivityCron, function(){
		Q.all([redis.GetActivity(),redis.GetFinishActivity()]).then((data)=>{
			if(data[0]==null||data[0]==""){
				activity.QueryActivity().then((result)=>{
					activityTask(result,data[1]||[]);
				});
			}else{
				activityTask(data[0],data[1]||[]);
			}
		});
		/*redis.GetActivity(function(data){			
			if(data.result==null||data.result==""){
				activity.QueryActivity(function(info){
					redis.GetActivity(function(res){
						activityTask(res);
					})
				})
			}else{
				activityTask(data);
			}
		})*/
    }); 	
}

function activityTask(data,data1){
	var success=false;
	var arr=[];
	var finishArr=[];

	if(typeof data == "string"){
		arr=JSON.parse(data);
	}else{
		arr=data;
	}

	if(typeof data1=="string"){
		finishArr=JSON.parse(data1);
	}else{
		finishArr=data1;
	}

	if(arr!=null&&arr!=""&&arr.length>0){
		async.eachSeries(arr,function(item,next){
			if(item.IsStart==0||item.IsFinish==0){
				var start=new Date().getTime()-new Date(item.StartTime).getTime();
				var end=new Date().getTime()-new Date(item.EndTime).getTime();

				var sminutes=Math.floor(start/(60*1000));
				var eminutes=Math.floor(end/(60*1000));
					
				if(sminutes>=0&&item.IsStart==0){				
					if(!finishArr.unique(item,"IsStart")){
						log.activityLog.info('[通知开始]'+item.Id+":"+item.Title+":"+item.StartTime);
						item.IsStart=1;
						success=true;
						var para={};
						var goodspara={};

						para.id=item.Id;
						para.type=0;
						if(item.ActiveType==1){
							para.activityType=2;
						}else if(item.ActiveType==8){
							para.activityType=0;
						}else{
							para.activityType=1;
						}
						para.areaId=item.AreaId;

						goodspara.type=14;
						goodspara.clearActivityType=0;
						goodspara.areaIds=[item.AreaId];

						if(finishArr.find(item.Id)){
							finishArr.find(item.Id).IsStart=1;
						}else{
							finishArr.push(item);
						}

						/*https.httpUtil.httppost(config.activityapi.host,config.activityapi.path,JSON.stringify(para),function(data){
							log.activityLog.info("[接收到的消息]---[请求消息：]"+JSON.stringify(para)+"[返回消息：]"+data);
						},function(err){
							log.activityLog.info("err");
						});

						https.httpUtil.httppost(config.goodsapi.host,config.goodsapi.path,JSON.stringify(goodspara),function(data){
							log.activityLog.info("[接收到的消息]---[请求消息：]"+JSON.stringify(goodspara)+"[返回消息：]"+data);
						},function(err){
							log.activityLog.info("err");
						});*/
					}					
				}

				if(eminutes>=0&&item.IsFinish==0){
					console.log("bbbb");
					if(!finishArr.unique(item,"IsFinish")){
						log.info('[通知结束]'+item.Id+":"+item.Title+":"+item.StartTime);
						console.log("ccccccccc");
						item.IsFinish=1;
						success=true;

						var para={};
						var goodspara={};

						para.id=item.Id,
						para.type=1;
						if(item.ActiveType==1){
							para.activityType=2;
						}else if(item.ActiveType==8){
							para.activityType=0;
						}else{
							para.activityType=1;
						}
						para.areaId=item.AreaId;

						goodspara.type=14;
						goodspara.clearActivityType=0;
						goodspara.areaIds=[item.AreaId];

						if(finishArr.find(item.Id)){
							finishArr.find(item.Id).IsFinish=1;
						}else{
							finishArr.push(item);
						}

						/*https.httpUtil.httppost(config.activityapi.host,config.activityapi.path,JSON.stringify(para),function(data){
							log.activityLog.info("[接收到的消息]---[请求消息：]"+JSON.stringify(para)+"[返回消息：]"+data);
						},function(err){
							log.activityLog.info("err");
						});

						https.httpUtil.httppost(config.goodsapi.host,config.goodsapi.path,JSON.stringify(goodspara),function(data){
							log.activityLog.info("[接收到的消息]---[请求消息：]"+JSON.stringify(goodspara)+"[返回消息：]"+data);
						},function(err){
							log.activityLog.info("err");
						});*/
					}
					
				}
			}
			next();	
		},function(){
			if(success)	{
				redis.SaveActivity(arr);
				redis.SaveFinishActivity(finishArr);
			}			
		});						
	}	
}

function scheduleRefreshActivity(){
	schedule.scheduleJob(config.schedulerCron.clearnActivityCron,function(){
		log.activityLog.info('[开始执行任务]');
		activity.QueryActivity().then((data)=>{
			log.activityLog.info(data);
		});
		redis.DeleteFinishActivity(functi