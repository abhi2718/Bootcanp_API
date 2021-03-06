const Course = require('../models/Course'),
      Bootcamp = require('../models/Bootcamp'),
      asyncHandler = require('../middleware/async'),
      ErrorResponse = require('../utils/errorResponse');

// @desc   Get  courses
// @route  GET /api/v1/courses
// @route  GET /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.getCourses= asyncHandler(async(req,res,next)=>{
    if(req.params.bootcampId){
        const courses= await Course.find({bootcamp:req.params.bootcampId});
        return  res.status(200).json({
            sucess:true,
            data:courses,
            count:courses.length
        })
    }else{
        res.status(200).json( res.advanceResult);
    }
})

// @desc   Get course
// @route  GET /api/v1/courses/:id
// @access Public
exports.getCourse= asyncHandler(async(req,res,next)=>{
    const course= await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    });
    if(!course){
        return next(new ErrorResponse(`No course found with given id ${req.params.id} `,404))
    }
    res.status(200).json({
        sucess:true,
        data:course,
    })
})

// @desc   add course
// @route  Post /api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.addCourse= asyncHandler(async(req,res,next)=>{
    req.body.bootcamp = req.params.bootcampId;
    // Add user to req body
    req.body.user=req.user._id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp){
        return next(new ErrorResponse(`No Bootcamp found with given id ${req.params.bootcampId}`,404))
    }
    // Make sure the user is bootcamp owner
    if(!bootcamp.user.equals(req.user._id)  && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User with id ${req.user._id} does not authorized to add a course to  bootcamp with id ${bootcamp._id}`,401));
     }
    const course = await Course.create(req.body);
    res.status(200).json({
        sucess:true,
        data:course,
    })
})

// @desc   update course
// @route  Post /api/v1/courses/:id
// @access Private
exports.updateCourse= asyncHandler(async(req,res,next)=>{
    let course= await Course.findById(req.params.id);
        if(!course){
           return next(new ErrorResponse(`Course does not found for given id ${req.params.id}`,404));
        }
        // Make sure the user is couse owner
       if(!course.user.equals(req.user._id)  && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User with id ${req.user._id} does not authorized to update a course  with id ${course._id}`,401));
       }
        course= await Course.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    res.status(200).json({
        sucess:true,
        data:course,
    })
})

// @desc   delete course
// @route  Delete /api/v1/courses/:id
// @access Private
exports.deleteCourse= asyncHandler(async(req,res,next)=>{
    const course= await Course.findById(req.params.id);
        if(!course){
           return next(new ErrorResponse(`Course does not found for given id ${req.params.id}`,404));
        }
        // Make sure the user is couse owner
       if(!course.user.equals(req.user._id)  && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User with id ${req.user._id} does not authorized to delete a course  with id ${course._id}`,401));
       }
   await course.remove()
    res.status(200).json({
        sucess:true,
        data:{},
    })
})
module.exports=exports;