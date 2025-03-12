const express = require('express');
const Reviews = require('./reviews.madule');
const Products = require('../Products/Products.Model');


const router = express.Router();


router.post("/post-review", async (req,res)=>{
    try {
           const {Comment,rating,userId,productId} = req.body;

          if(!Comment||!rating||!userId||!productId){
            
        res.status(200).send({message:"All fields are requried"})
      
          } 

         const existingReview = await Reviews.findOne({productId,userId});

         if(existingReview){
            existingReview.Comment =Comment;
            existingReview.rating = rating;
            await existingReview.save()
         }else{
            const newReview = new Reviews({
                Comment,rating,userId,productId
            })
            await newReview.save()
         }



         const reviews = await Reviews.find({productId});

         if(reviews.length>0){
            const totalRating = reviews.reduce((acc,review)=>acc+review.rating,0)
            const averageRating = totalRating/reviews.length
            const product = await Products.findById(productId)

            if(product){
                product.rating = averageRating;
                await product.save({ValidateBeforeSave:false})
            }else{
                return res.status(404).send({message:"products not found"})
            }
         }

         res.status(200).send({
            
            
            message:"Review proseed",
            review:reviews

         })
           

    } catch (error) {
        console.log("error posting review ",error);
        res.status(500).send({message:"failed to post review"})
        
    }
});



















router.get("/total-reviews", async (req,res)=>{
    try {

        const totaleReviews =  await Reviews.countDocuments({});
        res.status(200).send({totaleReviews});

          
    } catch (error) {
        console.log("error geting review ",error);
        res.status(500).send({message:"failed to get review"})
    }
});



router.get("/:userId", async (req,res)=>{
    const {userId}= req.params
    if(!userId){
        res.status(200).send({message:"userId  are requried"})
      
    }
    try {
        const reviews = Reviews.find({userId:userId}).sort({creatAt:-1});
        if(reviews.length===0){
            return res.status(404).send({message:"no review found"})
        }
        
    } catch (error) {
        console.log("error fechinge for by user review ",error);
        res.status(500).send({message:"failed to fetch review by  user"})
    }
})








module.exports = router