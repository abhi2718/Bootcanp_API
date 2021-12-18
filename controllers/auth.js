const User = require('../models/User'),
      asyncHandler = require('../middleware/async'),
      ErrorResponse = require('../utils/errorResponse');

// @desc  register user
// route  POST /api/v1/auth/register
// access Public

exports.register=asyncHandler(async (req,res,next)=>{
    const {name,email,password,role} =req.body;
    // creating user
    const user=await User.create({
        name,
        email,
        password,
        role
    })
    sendTokenResponse(user,200,res);
})

// @desc  login user
// route  POST /api/v1/auth/login
// access Public

exports.login=asyncHandler(async (req,res,next)=>{
    const {email,password} =req.body;
    if(!email || !password){
        return next(new ErrorResponse(`Please provide email and password`,400));
    }
    // check for user
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorResponse(`Invalid credentials`,401));
    }
    // check if password matches
    const isMatch=await user.matchPassword(password);
    if(!isMatch){
        return next(new ErrorResponse(`Invalid credentials`,401));
    }
    sendTokenResponse(user,200,res);
})

// Get token from model , create cookie and send response
const sendTokenResponse = (user,statusCode, res) => {
    // create token 
    const token=user.getSignedJwtToken();
    const options = {
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*60*60*1000*24),
        httpOnly:true
    }
    if(process.env.NODE_ENV==='production'){
        options.secure = true;
    }
    res
       .status(statusCode)
       .cookie('token',token,options)
       .json({
           success:true,
           token
        })
}

// @desc  get current logged in user
// route  GET /api/v1/auth/me
// access Private

exports.getMe=asyncHandler(async (req,res,next)=>{
 const user= await User.findById(req.user._id);
 res.status(200).json({success:true,user});
})
module.exports=exports;