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
         user:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true
        },
         createdAt:{
             type:Date,
             default:Date.now
         }
     });
// static method to get average of course  tuition 
CourseSchema.statics.getAverageCost= async function(bootcampId){
    const obj= await this.aggregate([
        {
            $match:{bootcamp:bootcampId}
        },
        {
            $group:{
                _id:'$bootcamp',
                averageCost:{$avg:'$tuition'}
            }
        }
    ]);
    try{
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
          averageCost:Math.ceil(obj[0].averageCost/10)*10
      })
    }catch(err){
       console.error(err);
    }
}

// call getAverage cost after save
CourseSchema.post("save",function(){
this.constructor.getAverageCost(this.bootcamp);
})

// call getAverage cost before remove
CourseSchema.pre("remove",function(){
    this.constructor.getAverageCost(this.bootcamp);
})


module.exports=mongoose.model('Course',CourseSchema);