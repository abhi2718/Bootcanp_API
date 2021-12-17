const express = require("express"),
  {getCourses,getCourse,addCourse,updateCourse,deleteCourse} = require("../controllers/courses"),
  advanceResult=require('../middleware/advanceResult'),
  Course=require('../models/Course'),
  router = express.Router({mergeParams:true});
  
  router.route('/')
        .get(advanceResult(Course,{
            path:'bootcamp',
            select:'name description'
         }),getCourses)
        .post(addCourse);
  router.route('/:id')
        .get(getCourse)
        .put(updateCourse)
        .delete(deleteCourse);
        
module.exports = router;
