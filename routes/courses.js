const express = require("express"),
  {getCourses,getCourse,addCourse,updateCourse,deleteCourse} = require("../controllers/courses"),
  advanceResult=require('../middleware/advanceResult'),
  Course=require('../models/Course'),
  {protect}=require('../middleware/auth'),
  router = express.Router({mergeParams:true});
  
  router.route('/')
        .get(advanceResult(Course,{
            path:'bootcamp',
            select:'name description'
         }),getCourses)
        .post(protect,addCourse);
  router.route('/:id')
        .get(getCourse)
        .put(protect,updateCourse)
        .delete(protect,deleteCourse);
        
module.exports = router;
