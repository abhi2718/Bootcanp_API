const express = require("express"),
  {getCourses,getCourse,addCourse,updateCourse,deleteCourse} = require("../controllers/courses"),
  advanceResult=require('../middleware/advanceResult'),
  Course=require('../models/Course'),
  {protect,authrize}=require('../middleware/auth'),
  router = express.Router({mergeParams:true});
  
  router.route('/')
        .get(advanceResult(Course,{
            path:'bootcamp',
            select:'name description'
         }),getCourses)
        .post(protect,authrize('publisher','admin'),addCourse);
  router.route('/:id')
        .get(getCourse)
        .put(protect,authrize('publisher','admin'),updateCourse)
        .delete(protect,authrize('publisher','admin'),deleteCourse);
        
module.exports = router;
