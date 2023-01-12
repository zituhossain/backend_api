require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const apiRouter = require('./routes/api');
const apiResponse = require('./helpers/apiResponse');
const { normalizePort } = require('./helpers/utility');
const cors = require('cors');
const base_dir_config = require('./config.js');

const { multerMiddleware } = require('./helpers/uploadFiles');

// DB connection
const MONGODB_URL = process.env.MONGODB_URL;
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

var allowlist = ['http://192.168.0.102:3000', 'https://web.zvgy.com']
//To allow cross-origin requests
app.use(cors({origin:allowlist}));
app.options('*', cors());
// add multer middleware
app.disable('x-powered-by');
// app.use(multerMiddleware.single('file'));
app.use(express.static(base_dir_config.base_dir));
app.use('/uploads', express.static('uploads'));

//Route Prefixes
app.use('/', apiRouter);

// throw 404 if URL not found
app.all('*', function (req, res) {
	return apiResponse.notFoundResponse(res, 'Page not found');
});

app.listen(port, () => {
	console.log('Server started on :', `http://localhost:${port}`);
});
