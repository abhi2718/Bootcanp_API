const User = require('../models/User'),
      asyncHandler = require('../middleware/async'),
      sendMail = require('../utils/sendEmail'),
      crypto=require('crypto'),
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

// @desc  get current logged in user
// route  GET /api/v1/auth/me
// access Private

exports.getMe=asyncHandler(async (req,res,next)=>{
 const user= await User.findById(req.user._id);
 if(!user){
    return next(new ErrorResponse(`No user found with given id ${req.user._id} `,400));
 }
 res.status(200).json({success:true,user});
});

// @desc  Forgot Password
// route  POST /api/v1/auth/forgotpassword
// access Public

exports.forgotpassword=asyncHandler(async (req,res,next)=>{
    let user= await User.findOne({email:req.body.email});
    if(!user){
        return  next(new ErrorResponse(`There is no such user with given email ${req.body.email}`,404));
    }
    // get resetPasswordToken
    const resetPasswordToken=user.getResetPasswordToken();
    user= await User.findByIdAndUpdate(user._id,user);
    // create reset url
    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetPasswordToken}`;
    const message=`make a PUT request to reset your password at ${resetUrl}`;
    try {
        await sendMail({
            email:user.email,
            subject:'Reset Password',
            text:message
        })
        res.status(200).json({success:true,data:`Email is sent to ${user.email}`});
    } catch (error) {
         console.log(error);
         await User.findByIdAndUpdate(user._id,{
            resetPasswordToken:undefined,
            resetPasswordExpire:undefined,
        });
        return next(new ErrorResponse(`Email could not be sent !`,500));
    }
   });

// @desc  Reset password
// route  PUT /api/v1/auth/resetpassword/:resettoken
// access Public

exports.resetPassword = asyncHandler(async (req,res,next)=>{
   const resetPasswordToken=crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user= await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    });
    if(!user){
       return next(new ErrorResponse(`Invalid reset token `,400));
    }
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();
    sendTokenResponse(user,200,res);
});
   

// @desc  Update User Details
// route  POST /api/v1/auth/updatedetails
// access Private

exports.updatedetails=asyncHandler(async (req,res,next)=>{
    const fieldsToUpdate={
        name:req.body.name,
        email:req.body.email
    }
    const user= await User.findByIdAndUpdate(req.user._id,fieldsToUpdate,{
        new:true,
        runValidators:true
    });
    if(!user){
       return next(new ErrorResponse(`No user found with given id ${req.user._id} `,400));
    }
    res.status(200).json({success:true,user});
   });

// @desc  Update Password
// route  PUT /api/v1/auth/updatepassword
// access Private

exports.updatepassword=asyncHandler(async (req,res,next)=>{
    const user= await User.findById(req.user._id).select('+password');
    if(!user){
       return next(new ErrorResponse(`No user found with given id ${req.user._id} `,400));
    }
    // check current password
    if(!(user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse(`Password is incorrect`,401));
    }
    user.password = req.body.newPassword;
     await user.save();
    sendTokenResponse(user,200,res);
   });


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

module.exports=exports;