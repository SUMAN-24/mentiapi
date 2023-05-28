const express = require('express');
const {UserModel} = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRouter = express.Router();

userRouter.post('/signup', async (req, res)=>{
    const {name, email, password} = req.body;
    try{
        bcrypt.hash(password, 5, async(err, hashed_password) => {
            if(err){
                console.log(err);
            }else{
                const user = new UserModel({name, email, password:hashed_password});
                await user.save();
                res.send({"msg":"Registration Successfull"});
            }
        });
    }catch (err){
        res.send({"msg":"Error while registering the user"});
    }
})

userRouter.post('/login', async (req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await UserModel.find({email});
        const hashed_password = user[0].password
        if(user.length > 0){
            bcrypt.compare(password, hashed_password, (err, result) =>{
               if(result){
                const token = jwt.sign({ foo: 'bar' }, process.env.key);
                res.send({"msg":"Login Successfull","token":token});
               }else{
                res.send("Wrong credentials");
               }
            });         
        }else {
            res.send("Wrong credentials");
        }
    }catch (err){
        res.send("Error in registering the user");
    }
})

module.exports = {
    userRouter
}