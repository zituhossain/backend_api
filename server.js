require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const apiRouter = require('./routes/api');
const apiResponse = require('./helpers/apiResponse');
const { normalizePort } = require('./helpers/utility');
const cors = require('cors');
const {CronJob} = require('cron');
const {CronTask} = require('./cronJob');
const {MongoDB} = require('./db');
const mongoDB = new MongoDB();
const mongoose = require("mongoose");
const { mongo_db_url } = require('./config.js');

//////////////////////mongo connect

// try{
// 	mongoose.connect(mongo_db_url,
// 		{
// 			useNewUrlParser: true,
// 			useFindAndModify: false,
// 			useUnifiedTopology: true
// 		}
// 	);
// 	console.log("mongo connect successfully")
// }catch(err){
// 	console.log("mongo connect error ",err.message)
// }

// var cutom_mongo_db = mongoose.connection;
// cutom_mongo_db.on("error", console.error.bind(console, "mongo connection error: "));
// cutom_mongo_db.once("open", function () {
//   console.log("mongo Connected successfully");
// });

//////////////////////mongo connect

const base_dir_config = require('./config.js');

const { multerMiddleware } = require('./helpers/uploadFiles');

// DB connection

const port = normalizePort(process.env.PORT || '8081');

const db = require('./db/db');
const  sequelize = db.sequelize;
sequelize.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});
 

const app = express();

//don't show the log when it is development
if (process.env.NODE_ENV !== 'development') {
	app.use(logger('dev'));
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//To allow cross-origin requests

const corsOpts = {
	origin: '*',
  
	methods: [
	  'GET',
	  'POST',
	  'OPTIONS'
	],
  
	allowedHeaders: [
	  'Content-Type',
	  'Access-Control-Allow-Origin: *'
	],
  };
// add multer middleware
app.disable('x-powered-by');
// app.use(multerMiddleware.single('file'));
app.use(express.static(base_dir_config.base_dir));
app.use(cors());
app.use('/uploads', express.static('uploads'));

//Route Prefixes
app.use('/', apiRouter);

// throw 404 if URL not found
app.all('*', function (req, res) {
	return apiResponse.notFoundResponse(res, 'Page not found');
});

const cronTask = new CronTask({mongoDB});
const CRON_SCHDULE = `0 */1 * * * *`;
app.listen(port, () => {
	const cronJobInit = new CronJob(CRON_SCHDULE, async()=>{
		cronTask.run();
	});
	cronJobInit.start();
	console.log('Server started on :', `http://localhost:${port}`);
});
