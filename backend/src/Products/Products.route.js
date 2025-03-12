const express = require("express");
const Products = require("./Products.Model");
const Reviews = require("../reviews/reviews.madule");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();



// post a products
router.post("/create-product", async (req, res) => {
  try {
    const newProduct = new Products({
      ...req.body,
    });
    const savedProduct = await newProduct.save();
    const reviews = await Reviews.find({ productId: savedProduct.id });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );

      const averageRating = totalRating/ reviews.length;
      savedProduct.rating = averageRating;
      await savedProduct.save()
    }
    res.send(201).send(savedProduct);
  } catch (error) {
    console.log("new product error",error);
    res.status(500).send({message:"failed to creat new product error"})
  }
});


// get all products

router.get('/', async (req,res)=>{
    try {
        const {category,color,minPrice , maxPrice, page=1,limit =10}  = req.query;
        let filter =  {};
        if(category&&category !=="all"){
            filter.category = category
        }
        if(color&&color !=="all"){
            filter.color = color
        }
        if(minPrice&&maxPrice){
            const min = parseFloat(minPrice)
             const max = parseFloat(maxPrice);
             if(!isNaN(min)&&!isNaN(max)){
                filter.price = {$gte:min,$lte:max};
             }
        }
    //    const skip = (parseInt(page)-1*parseInt(limit));
    const skip = (parseInt(page) - 1) * parseInt(limit);


       const totalProducts =  await Products.countDocuments(filter);
       const totalPages = Math.ceil(totalProducts/parseInt(limit));
       const products = await Products.find(filter).skip(skip).limit(parseInt(limit)).populate("author","email").sort({createdAt:-1})


       res.status(200).send({products, totalPages,totalProducts})
     
    } catch (error) {
        console.log("fech product error",error);
        res.status(500).send({message:"fech  product error"})
    }
})





router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("Received Product ID:", productId); // Debugging

    // Validate ID before querying the database
    if (!productId || productId === "undefined" || productId.length !== 24) {
      return res.status(400).send({ message: "Invalid Product ID" });
    }

    const product = await Products.findById(productId).populate("author", "email username");
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    const reviews = await Reviews.find({ productId }).populate("userId", "username email");
    res.status(200).send({ product, reviews });
  } catch (error) {
    console.error("Fetch product by ID error:", error);
    res.status(500).send({ message: "Fetch by ID product error" });
  }
});



















// update products

router.patch("/update-product/:id",verifyToken,verifyAdmin,async (req,res)=>{
        try {
          const productId = req.params.id;

          const updateProduct = await Products.findByIdAndUpdate(productId,{...req.body},{new:true});
          if(!updateProduct){
            return   res.status(404).send({message:" product not found error"})
          } 
          
          res.status(200).send({message:"products updated successfull",product:updateProduct})

        } catch (error) {
          console.log("error updateing the product",error);
          res.status(500).send({message:"Failed update the product"})
        }
});





router.delete("/:id",async (req,res)=>{
         try {
             const productId = req.params.id;
             const deleteProducts = await Products.findByIdAndDelete(productId);
             if(!deleteProducts){
              return res.status(404).send({message:"PRODUCTS not found"});

             }

             await Reviews.deleteMany({productId:productId});

             res.status(200).send({message:"Products Delete successfull"})
         } catch (error) {
          console.log("error deteteling the product",error);
          res.status(500).send({message:"Failed delete the product"})
         }
})



router.get("/related/:id", async (req,res)=>{
      try {
        const {id}  = req.params;
        if(!id){
          return  res.status(404).send({message:"PRODUCTS Id not found"});
        }

        const product = await Products.findById(id);
        if(!id){
          res.status(404).send({message:"PRODUCTS not found"});
        }

        const titleRegex = new RegExp(
          product.name.split("").filter((word)=>word.length>1).join("|"),"i"
        );


        const relatedProducts = await Products.find({
          id:{$ne:id},
          $or:[
            {mame:{$regex:titleRegex}},
            {category:product.category}
          ]
        });

        res.status(200).send(relatedProducts)
        
      } catch (error) {
        console.log("error feching related the product",error);
        res.status(500).send({message:"Failed to fech related  the product"})
      }
})


module.exports = router;
