const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./user');
const officerRouter = require('./officer');
const placeRouter = require('./place');
const fileRouter = require('./file');
const administrationRouter = require('./administration');
const overallConditionRouter = require('./overall_condition');
const overallConditionPlaceRouter = require('./overall_condition_place');
const localInfluencerRouter = require('./local_influencer');
const ngoDetailsRouter = require('./ngo_details_info');
const ngoDetailsPointWiseRouter = require('./ngo_details_info_point_wise');
const NgoRouter = require("./ngo");
const AllTitle = require("./AllTitle");
const YearPlaceNgoOfficer = require("./year_place_ngo_officer");
const OfficerProfileHeading = require("./officer_profile_heading");
const NewsEventRouter = require("./NewsEvent");
const TagRouter = require("./tag");

const Filter = require("./filter");

const populationYearPlace = require("./population_year_place");
const ngoDetailYearPlace = require("./ngo_detail_year_place");






const apiRouter = express.Router();

apiRouter.use('/auth/', authRouter);


apiRouter.use('/user/', userRouter);
apiRouter.use('/officer/', officerRouter);
apiRouter.use('/place/', placeRouter);
apiRouter.use('/file/', fileRouter);
apiRouter.use('/administration/', administrationRouter);
apiRouter.use('/overall_condition/', overallConditionRouter);
apiRouter.use('/overall_condition_place/', overallConditionPlaceRouter);
apiRouter.use('/local_influencer/', localInfluencerRouter);
apiRouter.use('/ngo_details_info/', ngoDetailsRouter);
apiRouter.use('/ngo_details_info_point_wise/', ngoDetailsPointWiseRouter);
apiRouter.use('/ngo/', NgoRouter);
apiRouter.use('/alltitle/', AllTitle);
apiRouter.use('/year_place_ngo_officer/', YearPlaceNgoOfficer);
apiRouter.use('/officer_profile_heading/', OfficerProfileHeading);
apiRouter.use('/population_year_place/', populationYearPlace);
apiRouter.use('/ngo_detail_year_place/', ngoDetailYearPlace);


apiRouter.use('/news_event/', NewsEventRouter);

apiRouter.use('/tag/', TagRouter);
apiRouter.use('/filter/', Filter);





module.exports = apiRouter;
