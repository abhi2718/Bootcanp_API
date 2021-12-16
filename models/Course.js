const mongoose=require('mongoose'),
     CourseSchema=new mongoose.Schema({
         title:{
             type:String,
             trim:true,
             required:[true,'title is required'],
             unique:true
         },
         description:{
             type:String,
             required:[true,'description is required']
         },
         weeks:{
             type:String,
             required:[true,'number of weeks is required']
         },
         tuition:{
             type:Number,
             required:[true,'tuition cost is required']
         },
         minimumSkill:{
             type:String,
             required:[true,'Please add minium skill'],
             enum:['beginner','intermediate','advance']
         },
         scholarshipAvailable:{
             type:Boolean,
             default:false
         },
         bootcamp:{
             type:mongoose.Schema.ObjectId,
             ref:'Bootcamp',
             required:true
         },
         createdAt:{
             type:Date,
             default:Date.now
         }
     });
module.exports=mongoose.model('Course',CourseSchema);