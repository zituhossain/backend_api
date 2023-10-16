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
const placeCommentTitleRouter = require('./place_comment_title');
const placeCommentRouter = require('./place_comment');
const NgoRouter = require('./ngo');
const TestRouter = require('./test');
const AllTitle = require('./AllTitle');
const YearPlaceNgoOfficer = require('./year_place_ngo_officer');
const OfficerProfileHeading = require('./officer_profile_heading');
const OfficerProfileType = require('./officer_profile_type');
const NewsEventRouter = require('./NewsEvent');
const TagRouter = require('./tag');
const ReportLogRouter = require('./report_log');

const Filter = require('./filter');
const Report = require('./report');
const ngoJot = require('./ngoJot');

const populationYearPlace = require('./population_year_place');
const ngoDetailYearPlace = require('./ngo_detail_year_place');
const category = require('./category');
const config = require('./config');
const Years = require('./years');
const Setting = require('./settings');

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
apiRouter.use('/place_comment_title/', placeCommentTitleRouter);
apiRouter.use('/place_comment/', placeCommentRouter);
apiRouter.use('/ngo/', NgoRouter);
apiRouter.use('/test/', TestRouter);
apiRouter.use('/alltitle/', AllTitle);
apiRouter.use('/year_place_ngo_officer/', YearPlaceNgoOfficer);
apiRouter.use('/officer_profile_heading/', OfficerProfileHeading);
apiRouter.use('/population_year_place/', populationYearPlace);
apiRouter.use('/ngo_detail_year_place/', ngoDetailYearPlace);

apiRouter.use('/news_event/', NewsEventRouter);

apiRouter.use('/tag/', TagRouter);
apiRouter.use('/filter/', Filter);
apiRouter.use('/ngo_jot/', ngoJot);
apiRouter.use('/category/', category);
apiRouter.use('/config/', config);
apiRouter.use('/officer_profile_type/', OfficerProfileType);
apiRouter.use('/years/', Years);
apiRouter.use('/report/', ReportLogRouter);
apiRouter.use('/settings/', Setting);

module.exports = apiRouter;
