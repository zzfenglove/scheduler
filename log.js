var log4js = require("log4js");
var log4js_config = require("./log4js.json");

log4js.configure(log4js_config);
var couponlog = log4js.getLogger('coupon');
var activitylog=log4js.getLogger('activity');
var emailLog=log4js.getLogger('email');

var log={
	couponLog:couponlog,
	activityLog:activitylog,
	emailLog:emailLog
};
module.exports=log;