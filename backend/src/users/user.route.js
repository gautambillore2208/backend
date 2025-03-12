const express = require('express');
const User = require('./users.model');
const generatenToken = require('../middleware/genratedToken');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
const bcrypt = require("bcrypt");



router.post('/register',async(req,res)=>{
    try {
        const {username,email,password} = req.body
        console.log("Incoming Request Body:", req.body); 
         const user = new User({email,username,password});
         await user.save();
         res.status(201).send({message:"User registerd successfully!"}) 
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"error reg"})
        
    }
});














































// 


router.post('/login', async(req,res)=>{
     const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        console.log("Login Attempt: ", email,password);
        if(!user){
          return res.status(404).send({message:"user not found"})
        }
   
        // const isMatch = await user.comparePassword(password);
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send({ message: "Incorrect password" });
        }
        
   
        


        const token  = await generatenToken(user.id)
        res.cookie('token',token,{
            httpOnly:true,
            secure:true,
            sameSite: 'None'
        });


        return res.status(200).send({message:"Logged in successfullt",token,user:{
            id:user.id,
            email: user.email,
            username:user.username,
            role:user.role,
            profileImage: user.profileImage,
            bio:user.bio,
            profession:user.profession

        }})

        
        
        // res.cookie('token',token)


    } catch (error) {
        console.log(error);
        res.status(500).send({message:"error reg"})
        
        
    }
     
})


















































router.post('/logout', (req,res)=>{
    res.clearCookie('token')
    res.status(200).send({message:"logout suc"})

})


router.delete('/users/:id', async(req,res)=>{
    try {

        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(400).send({message:"user not found"})
        }

        return res.status(200).send({message:"user delete successfully"})
        
    } catch (error) {
        console.log(error,"error delete users");
        res.status(500).send({message:"error delete users"})
        
    }
});



router.get('/users',async (req,res)=>{
    try {
      
        const users = await User.find({}, 'id email role').sort({ createdAt: -1 });

        res.status(200).send(users)

    } catch (error) {
        console.log(error,"error feching users");
        res.status(500).send({message:"error fechhinf users"})
    }
});



router.put('/users/:id', async (req,res)=>{
 
         try {

            const {id} = req.params;
            const {role} = req.body;
            const user  = await User.findByIdAndUpdate(id,{role},{new:true});
            if(!user){
                return res.status(404).send({message:"user not found"})
            }
            res.status(200).send({message:"user role is update",user})
            
         } catch (error) {
            console.log(error,"error updating user role");
            res.status(500).send({message:"error fechhinf user role"})
         }

});



router.patch('/edit-profile', async (req,res)=> {
    try {
         
        const {userId, username,profileImage,profession,bio} = req.body
        if(!userId){
            return res.status(404).send({message:"userId reiured"})
        }

        const user =await User.findById(userId);
        if(!user){
            return res.status(404).send({message:"user not found"})
        }

        // upadte


        if(username !== undefined) user.username = username;
        if(profileImage !== undefined) user.profileImage = profileImage;
        if(profession !== undefined) user.profession = profession;
        if(bio !== undefined) user.bio = bio;

        await user.save();
        res.status(200).send({message: 'profile updaetd succesfully',user:{
            id:user.id,
            email: user.email,
            username:user.username,
            role:user.role,
            profileImage: user.profileImage,
            bio:user.bio,
            profession:user.profession
        },
    })


    } catch (error) {
        console.log(error,"error updating user role");
        res.status(500).send({message:"error fechhinf user role"})
    }
    
})





































// router.get('/users', async(req,res)=>{
//          res.send({message:"procert users"})
// })


module.exports = router;