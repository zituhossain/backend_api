require('dotenv').config();
module.exports = {
	allowedRoles: {
		Super: 'super',
		Admin: 'admin',
		Manager: 'manager',
		Delivery: 'delivery',
		Customer: 'customer',
	},
  base_dir:'/Users/md.mahidulislam/Desktop/Full Stack/Office/GitHub/NGO/justtest/',
	database:{
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
   },
   pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  }
};
