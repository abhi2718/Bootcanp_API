const Bootcamp = require('../models/Bootcamp'),
      asyncHandler = require('../middleware/async'),
      geocoder = require('../utils/geocoder'),
      path = require('path'),
      ErrorResponse = require('../utils/errorResponse');

// @desc  Get all bootcamps
// route  GET /api/v1/bootcamps
// access Public
// queryURL_FOR_FILTER http://localhost:5000/api/v1/bootcamps?averageCost[lt]=2000&location.zipcode=221005&housing=true
// queryUrl_FOR_Select http://localhost:5000/api/v1/bootcamps?select=name,description,phone,email,address
// queryURL_FOR_Filter_and_select http://localhost:5000/api/v1/bootcamps?select=name,description,phone,email,address&housing=true
// queryUrl_For_Sorting -> http://localhost:5000/api/v1/bootcamps?sort=averageCost,http://localhost:5000/api/v1/bootcamps?sort=-averageCost
// querURL_For_Pagination -> http://localhost:5000/api/v1/bootcamps?page=1&limit=2
exports.getBootcamps=asyncHandler(async (req,res,next)=>{
           res.status(200).json( res.advanceResult);
})

// @desc  Get a bootcamp
// route  GET /api/v1/bootcamps/:id
// access Public
exports.getBootcamp=asyncHandler(async (req,res,next)=>{
        const bootcamps= await Bootcamp.findById(req.params.id); // if no match , it will return null 
        if(!bootcamps){
          return  next(new ErrorResponse(`bootcamp does not found for given id ${req.params.id}`,404));
        }
        res.status(200).json({success:true,data:bootcamps});
})

// @desc  Create a bootcamp
// route  POST /api/v1/bootcamps
// access Private
exports.createBootcamp= asyncHandler(async(req,res,next)=>{
        // Add user to req body
        req.body.user=req.user._id;
        // check for published bootcamp
        const publishedBootcamp = await Bootcamp.findOne({user:req.user._id});
        // If user is not an admin , they can add only one bootcamp
        if(publishedBootcamp && req.user.role !== 'admin'){
             return next(new ErrorResponse(`The user with id ${req.user._id} , has already published a bootcamp`,400))
        }
        const bootcamp= await Bootcamp.create(req.body);
        res.status(201).json({success:true,data:bootcamp});
})

// @desc  Update a bootcamp
// route  PUT/api/v1/bootcamps/:id
// access Private
exports.updateBootcamp=asyncHandler(async(req,res,next)=>{
        let bootcamp= await Bootcamp.findById(req.params.id);
        if(!bootcamp){
           return next(new ErrorResponse(`bootcamp does not found for given id ${req.params.id}`,404));
        }
        // Make sure the user is bootcamp owner
        if(!bootcamp.user.equals(req.user._id) && req.user.role !== 'admin'){
                return next(new ErrorResponse(`User with id ${req.user._id}  not authorized to update this bootcamp `,401));
        }
        bootcamp= await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        res.status(201).json({success:true,data:bootcamp});
})

// @desc  Delete a bootcamps
// route  DELETE/api/v1/bootcamps/:id
// access Private
exports.delteBootcamp=asyncHandler(async (req,res,next)=>{
    const bootcamp= await Bootcamp.findById(req.params.id);
        if(!bootcamp){
           return next(new ErrorResponse(`bootcamp does not found for given id ${req.params.id}`,404));
        }
        // Make sure the user is bootcamp owner
         if(!bootcamp.user.equals(req.user._id)  && req.user.role !== 'admin'){
                return next(new ErrorResponse(`User with id ${req.user._id} does not authorized to delete this bootcamp `,401));
        }
        bootcamp.remove();
        res.status(201).json({success:true,data:{}});
})

// @desc  Get bootcamps within a radius
// route  GET/api/v1/bootcamps/radius/:zipcode/:distance
// access Private

exports.getBootcampInRadius=asyncHandler(async (req,res,next)=>{
        const {zipcode,distance} =req.params,
         // Get lat & long from geocoder
         loc = await geocoder.geocode(zipcode),
         lat = loc[0].latitude,
         lng = loc[0].longitude,
         // calculate radius in radian
         // Earth radius = 3,963 mi or 6,378 km
         // divide the distance by radius of earth
         // 1 mi = 1609.34 meter
         radius=Number(distance)/3963, // radius in mi
         bootcampsInRadius = await Bootcamp.find({
                location: {
                   $geoWithin: { $centerSphere: [ [ lng,lat], radius ] }
                }
             }); 
             if(!bootcampsInRadius){
                    return next(new ErrorResponse(`No bootcamp found for ${zipcode} , witin ${distance}`,404))
             }
             console.log(typeof(radius))
        res.status(200).json({
                success:true,
                count:bootcampsInRadius.length,
                data:bootcampsInRadius,
        })
    })

// @desc  upload photo for a bootcamp
// route  PUT /api/v1/bootcamps/:id/photo
// access Private
exports.bootcampPhotoUpload=asyncHandler(async (req,res,next)=>{
        const bootcamp= await Bootcamp.findById(req.params.id);
            if(!bootcamp){
               return next(new ErrorResponse(`bootcamp does not found for given id ${req.params.id}`,404));
            }
            if(!req.files){
                return next(new ErrorResponse(`Please upload an file`,400));    
            }
            // Make sure the user is bootcamp owner
            if(!bootcamp.user.equals(req.user._id)  && req.user.role !== 'admin'){
                return next(new ErrorResponse(`User with id ${req.user._id} does not authorized to update this bootcamp `,401));
             }
            const file=req.files.file;
            // Make sure the image is a photo
            if(!file.mimetype.startsWith('image')){
                return next(new ErrorResponse(`Please upload an image file`,400));  
            }
            // Checking file size unit is bytes,MAX_FILE_UPLOAD = 1 Megabyte which is equal to 10,00,000 bytes
            if(file.size>process.env.MAX_FILE_UPLOAD_SIZE){
                return next(new ErrorResponse(`Please upload an image less than 1 Megabyte`,400));  
            }
            // Creating custom file name
            file.name=`photo_${bootcamp._id}${path.parse(file.name).ext}`;
            file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err=>{
                    if(err){
                        console.error(err);
                        return next(new ErrorResponse(`Problem with file upload`,500));  
                    }
                    
                    await Bootcamp.findByIdAndUpdate(req.params.id,{
                            photo:file.name
                    })
                    res.status(200).json({success:true,data:{name:file.name,url:`http://localhost:5000/uploads/${file.name}`}});
            }) 
    })
module.exports=exports;