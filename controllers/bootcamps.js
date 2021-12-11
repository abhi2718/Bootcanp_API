const Bootcamp=require('../models/Bootcamp'),
      asyncHandler = require('../middleware/async'),
      ErrorResponse=require('../utils/errorResponse');
// @desc  Get all bootcamps
// route  GET /api/v1/bootcamps
// access Public
exports.getBootcamps=asyncHandler(async (req,res,next)=>{
       const bootcamps= await Bootcamp.find();
       res.status(200).json({success:true,data:bootcamps});
})

// @desc  Get a bootcamp
// route  GET /api/v1/bootcamps/:id
// access Public
exports.getBootcamp=asyncHandler(async (req,res,next)=>{
        const bootcamps= await Bootcamp.findById(req.params.id); // if no match , it will return null 
        if(!bootcamps){
          return  next(new ErrorResponse(`Resource does not found for given id ${req.params.id}`,404));
        }
        res.status(200).json({success:true,data:bootcamps});
})

// @desc  Create a bootcamp
// route  POST /api/v1/bootcamps
// access Private
exports.createBootcamp= asyncHandler(async(req,res,next)=>{
        const bootcamp= await Bootcamp.create(req.body);
        res.status(201).json({success:true,data:bootcamp});
})

// @desc  Update a bootcamp
// route  PUT/api/v1/bootcamps/:id
// access Private
exports.updateBootcamp=asyncHandler(async(req,res,next)=>{
   
        const bootcamp= await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!bootcamp){
           return next(new ErrorResponse(`Resource does not found for given id ${req.params.id}`,404));
        }
        res.status(201).json({success:true,data:bootcamp});
})
// @desc  Delete a bootcamps
// route  DELETE/api/v1/bootcamps/:id
// access Private
exports.delteBootcamp=asyncHandler(async (req,res,next)=>{
    const bootcamp= await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp){
           return next(new ErrorResponse(`Resource does not found for given id ${req.params.id}`,404));
        }
        res.status(201).json({success:true,data:bootcamp});
})

module.exports=exports;