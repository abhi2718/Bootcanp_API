const User = require('../models/User'),
      asyncHandler = require('../middleware/async'),
      ErrorResponse = require('../utils/errorResponse');

      
// @desc  Get all the users
// route  POST /api/v1/users
// access Private/Admin

exports.getUsers=asyncHandler(async (req,res,next)=>{
   res.status(200).json(res.advanceResult);
})

// @desc  Get  single user 
// route  POST /api/v1/users/:id
// access Private/Admin

exports.getUser=asyncHandler(async (req,res,next)=>{
    const user= await User.findById(req.params.id);
    if(!user){
        return next(new ErrorResponse(`Use does not found for given id ${req.params.id}`,404))
    }
    res.status(200).json({success:true,data:user});
 })

 // @desc create user 
// route  POST /api/v1/users
// access Private/Admin

exports.createUser=asyncHandler(async (req,res,next)=>{
    const user = await User.create(req.body);
    res.status(201).json({success:true,data:user});
 })

// @desc  update user 
// route  PUT /api/v1/users/:id
// access Private/Admin

exports.updateUser=asyncHandler(async (req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    if(!user){
        return next(new ErrorResponse(`Use does not found for given id ${req.params.id}`,404))
    }
    res.status(200).json({success:true,data:user});
 })

// @desc  delete user 
// route  DELETE /api/v1/users/:id
// access Private/Admin

exports.deleteUser=asyncHandler(async (req,res,next)=>{
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
        return next(new ErrorResponse(`Use does not found for given id ${req.params.id}`,404))
    }
    res.status(200).json({success:true,data:{}});
 })

 module.exports=exports;