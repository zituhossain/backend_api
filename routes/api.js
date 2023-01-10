const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./user');
const officerRouter = require('./officer');
const placeRouter = require('./place');
const fileRouter = require('./file');
const administrationRouter = require('./administration');
const overallConditionRouter = require('./overall_condition');
const overallConditionPlaceRouter = require('./local_influencer');
const localInfluencerRouter = require('./local_influencer');





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




module.exports = apiRouter;
