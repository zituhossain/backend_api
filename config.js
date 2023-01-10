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
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "12345678",
        database: "ngo_bd"
   },
   pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
