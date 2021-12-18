const express = require("express"),
  {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    delteBootcamp,
    getBootcampInRadius,
    bootcampPhotoUpload
  } = require("../controllers/bootcamps"),
  {protect}=require('../middleware/auth'),
  advanceResult=require('../middleware/advanceResult'),
  Bootcamp=require('../models/Bootcamp'),
  router = express.Router(),
  //Include other resource routers
  courseRouter = require('./courses');
  // Re-route into other resource routers
  router.use('/:bootcampId/courses',courseRouter);
  router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
  router.route('/:id/photo').put(protect,bootcampPhotoUpload);

  router.route('/')
        .get(advanceResult(Bootcamp,{
           path:'courses',
           select:'title description'
          }),getBootcamps)
        .post(protect,createBootcamp);
        
  router.route('/:id')
        .get(getBootcamp)
        .put(protect,updateBootcamp)
        .delete(protect,delteBootcamp);

module.exports = router;
