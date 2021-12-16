const Bootcamp = require('../models/Bootcamp'),
      asyncHandler = require('../middleware/async'),
      geocoder = require('../utils/geocoder'),
      ErrorResponse = require('../utils/errorResponse');


     


// @desc  Get all bootcamps
// route  GET /api/v1/bootcamps
// access Public
// queryURL_FOR_FILTER http://localhost:5000/api/v1/bootcamps?averageCost[lt]=2000&location.zipcode=221005&housing=true
// queryUrl_FOR_Select http://localhost:5000/api/v1/bootcamps?select=name,description,phone,email,address
// queryURL_FOR_Filter_and_select http://localhost:5000/api/v1/bootcamps?select=name,description,phone,email,address&housing=true
// queryUrl_For_Sorting -> http://localhost:5000/api/v1/bootcamps?sort=averageCost,http://localhost:5000/api/v1/bootcamps?sort=-averageCost
// querURL_For_Pagination -> 
exports.getBootcamps=asyncHandler(async (req,res,next)=>{
           let query;
           // copy of req.query
           const reqQuery = {...req.query}
           // Fields to exclude 
           const removeFields = ['select','sort','limit','page'];
           // Loop over removeFields and delete them from reqQuery
           removeFields.forEach(param => delete reqQuery[param]);
           // create query string 
           let queryStr=JSON.stringify(reqQuery);
           // create operators ($gt,$gte,etc)
           queryStr=queryStr.replace(/\b(lt|lte|gt|gte|in)\b/g,match=>`$${match}`);
           // finding resource 
           query=Bootcamp.find(JSON.parse(queryStr)).populate({
                path:'courses',
                select:'title description'
            });
           // select desire fields 
           if(req.query.select){
           const fields=req.query.select.split(',').join(' ');
           query.select(fields)
           }
           // sorting
           if(req.query.sort){
                   const sortBy=req.query.sort.split(',').join(' ');
                   query.sort(sortBy);
           }
           else{
                query.sort('-createdAt');
           }
           // pagination
           const page=parseInt(req.query.page) || 1;
           const limit=parseInt(req.query.limit) || 10;
           const skip= (page-1)*limit;
           query=query.skip(skip).limit(limit);
           // executing query
           const bootcamps= await query;
           res.status(200).json({success:true,data: bootcamps,count: bootcamps.length});
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
    const bootcamp= await Bootcamp.findById(req.params.id);
        if(!bootcamp){
           return next(new ErrorResponse(`Resource does not found for given id ${req.params.id}`,404));
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
module.exports=exports;