require('dotenv').config();
module.exports = {
	allowedRoles: {
		Super: 'super',
		Admin: 'admin',
		Manager: 'manager',
		Delivery: 'delivery',
		Customer: 'customer',
	},
	// base_dir:'/Users/md.mahidulislam/Desktop/Full Stack/Office/GitHub/NGO/justtest/',
	base_dir: __dirname + '/',
	mongo_db_url: 'mongodb://localhost:27017/zvgy_ngo',
	database: {
		host: 'zvgy.com',
		port: '3306',
		user: 'zvgy_kafi',
		password: 'het8Wj3vJSve@2',
		database: 'zvgy_kafi',
		// host: '127.0.0.1',
		// port: '3306',
		// user: 'root',
		// password: '',
		// database: 'ngodb4',
	},

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
	define: {
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
	},
};
