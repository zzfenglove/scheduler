var sql=require('mssql');
var log=require('./log');
var config=require('./config')
exports.getUserRegion=function(userIds,callback){
	var pool=new sql.ConnectionPool({
			user:config.mssql.user,
			password:config.mssql.password,
			server:config.mssql.server,
			database:config.mssql.database,
			port:config.mssql.port
		},err=>{
			pool.request().query(`select a.UserID,case when b.Depth=3 then c.RegionId else b.RegionId end as RegionId from Shop_ShippingAddress a inner join Ms_Regions b on a.RegionId = b.RegionId left JOIN Ms_Regions c ON b.ParentId = c.RegionID where a.UserID in(${userIds})`,(err,data)=>{				
				callback({result:data})
				pool.close();
			})
		});		
}