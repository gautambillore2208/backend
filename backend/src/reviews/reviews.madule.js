const { mongoose } = require("mongoose");


const ReviewsSchema =  new mongoose.Schema({
   Comment:{type:String,required:true},
   rating: {type:Number,required:true   },
   userId: {type:mongoose.Schema.Types.ObjectId,ref : "User" ,required:true},
   productId: {type:mongoose.Schema.Types.ObjectId,ref:"product",required:true}
},{timestamps: true   })

const Reviews =  mongoose.model("Review",ReviewsSchema);

module.exports  = Reviews