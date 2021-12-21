const mongoose=require('mongoose'),
     ReviewSchema=new mongoose.Schema({
         title:{
             type:String,
             trim:true,
             required:[true,'title is required'],
             maxlength:[100,'title is not greater than 100 characters']
         },
        text:{
             type:String,
             required:[true,'text is required']
         },
         rating:{
             type:Number,
             max:5,
             min:1,
             required:[true,'rating is required']
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
// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({bootcamp:1, user:1},{unique:true})

// static method to get average rating and save  
ReviewSchema.statics.getAverageRating = async function(bootcampId){
    const obj= await this.aggregate([
        {
            $match:{bootcamp:bootcampId}
        },
        {
            $group:{
                _id:'$bootcamp',
                averageRating:{$avg:'$rating'}
            }
        }
    ]);
    try{
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
          averageRating:obj[0].averageRating
      })
    }catch(err){
       console.error(err);
    }
}

// call getAverageRating after save
ReviewSchema.post("save",function(){
this.constructor.getAverageRating(this.bootcamp);
})

// call getAverageRating before remove
ReviewSchema.pre("remove",function(){
    this.constructor.getAverageRating(this.bootcamp);
})


module.exports=mongoose.model('Review',ReviewSchema);