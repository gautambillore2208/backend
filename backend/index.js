const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000;



app.use(express.json({limit:"25mb"}));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

// app.use(cors({
//     origin:"http://localhost:5173/",
//     credentials: true,
// }))
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
  optionsSuccessStatus: 200 
}));




// all router

const authRoutes = require('./src/users/user.route'); // ✅ Ensure path is correct
const productsRoutes = require("./src/Products/Products.route")
const reviewRoutes = require("./src/reviews/reviews.route")


app.use('/api/auth', authRoutes); // ✅ Prefix routes
app.use('/api/products',productsRoutes);
app.use('/api/reviews',reviewRoutes)







main().then(()=>console.log('db connect')).catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.DB__URL);
    app.get('/', (req, res) => {
        res.send('Hello World!')
      })
      
    
  }


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});























//  pass    lID7x4gir0m2aCUR
//  username    admin