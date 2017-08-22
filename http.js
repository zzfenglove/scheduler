var http=require('http');
var querystring = require('querystring');

var httpUtil={
	httpget:function(url,success,error){
		https.get(url,function(res){
			var result="";
			res.setEncoding('UTF-8');
			res.on('data',function(data){
				result+=data;
			});
			res.on('error',error);
			res.on('end',function(){
				success(result);
			});
		});
	},
	httppost:function(host,path,data,success,error){
		var options = {
 			host: host,
 			port:80,
 			path: path,
 			method: 'POST',
 			headers: {
		     'Content-Type': 'application/json',
		     'Content-Length': data.length
			}
		};

		var req=http.request(options,function(res){
			var result="";
			res.setEncoding('UTF-8');
			res.on('data',function(data){
				result+=data;
			});
			res.on('error',error);
			res.on('end',function(){
				success(result);
			});
		});
		req.write(data);
		req.end();
	}
}

exports.httpUtil=httpUtil;