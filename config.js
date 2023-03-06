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
	database: {
		host: 'zvgy.com',
		port: '3306',
		user: 'zvgy_ngo',
		password: '=9&Z9Iw23!-mag',
		database: 'zvgy_ngo',
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
