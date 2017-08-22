var nodemailer = require('nodemailer');
var smtpTransport=require('nodemailer-smtp-transport');
var config=require('./config');
var log=require('./log');

smtpTransport=nodemailer.createTransport(smtpTransport({
	service:config.email.service,
	auth:{
		user:config.email.user,
		pass:config.email.pass
	}
}));

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
var sendMail=function(recipient,subject,html){
	smtpTransport.sendMail({
		from:config.email.user,
		to:recipient,
		subject:subject,
		html:html
	},function(err,response){
		if(err){
			log.emailLog.error(err);
		}

		log.emailLog.info("[发送成功！]"+response);
	})
}
module.exports = mailer;