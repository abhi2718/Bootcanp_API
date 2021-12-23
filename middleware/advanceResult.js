const advanceResult = (model,populate)=> async (req,res,next) =>{
    let query;
    // copy of req.query
    const reqQuery = {...req.query}
    console.log(reqQuery);
    // Fields to exclude 
    const removeFields = ['select','sort','limit','page'];
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    // create query string 
    let queryStr=JSON.stringify(reqQuery);
    // create operators ($gt,$gte,etc)
    queryStr=queryStr.replace(/\b(lt|lte|gt|gte|in)\b/g,match=>`$${match}`);
    // finding resource 
    query=model.find(JSON.parse(queryStr));
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
    // populate
    if(populate){
        query=query.populate(populate);
    }
    // pagination
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 10;
    const skip= (page-1)*limit;
    query=query.skip(skip).limit(limit);
    // executing query
    const results= await query;
    res.advanceResult={
       sucess:true,
       count:results.length,
       data:results
    }
    next();
}

module.exports=advanceResult;