const mongoose=require('mongoose');
const connectToDb= async ()=>{
    const connect= await mongoose.connect(process.env.MONGO_URI);
}

module.exports=connectToDb;