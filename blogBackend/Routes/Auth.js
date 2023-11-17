const express = require('express');
const router = express.Router() ;
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt') ;
const authTokenHandler = require('../Middlewares/checkAuthToken')


const User = require('../Models/UserSchema')
const errorHandler = require('../Middlewares/errorMiddleware')

require('dotenv').config()


const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.EMAIL_ACC,
        pass : process.env.EMAIL__PASS
    }
})

router.get('/',async (req,res) => {
    res.json({
        message : "Auth Api is working"
    })
})


router.post('/sendopt',async (req,res,next) => {
    const {email} = req.body ;
    const otp = Math.floor(10000+Math.random()*900000) ;
    try{
        const mailOptions = {
            from : process.env.EMAIL_ACC ,
            to : email ,
            subject : "OTP for Verification of Blog Registration ",
            text : `Your OTP for verification is ${otp}`
        }
        transporter.sendMail(mailOptions,async(err,info) => {
            if(err){
                console.log(err) ;
                res.status(501).json({
                    ok : false ,
                    message : err.message 
                })
            }
            else{
                return res.status(200).json({
                    ok : true,
                    message: 'OTP send Successfully',
                    otp : otp
                })
            }
        })

    }
    catch(err){
        next(err) ; 
    }
})

router.post('/register',async(req,res,next) => {
    try{
        const {name,email,password} = req.body ;
        const existingUser = await User.findOne({email}) ;

        if(existingUser){
            return res.status(409).json({ok:false,message : "Email already exists"}) ;
        }

        const newUser = new User({
            name,
            email,
            password
        })

        await newUser.save() ;

        return res.status(201).json({ok:true,message :  "User is succesfully registered"}) ;
    }   
    catch(err){
        next(err) ;
    }
})
 
router.post('/login',async (req,res,next) => {
    try{
        const {email,password} = req.body ;

        const user = await User.findOne({email}) ;

        if(!user) {
            return res.status(400).json({message : "Invalid credentials"}) ;
        }

        const isMatch = await bcrypt.compare(password,user.password) ;
        if(!isMatch){
            return res.status(400).json({ok:false,message:"Invalid Credentials"}); 
        }

        const authToken = jwt.sign({userId : user.id},process.env.JWT_SECRET_KEY,{expiresIn : '30m'}) ;
        const refreshToken = jwt.sign({userId : user.id},process.env.JWT_REFRESH_SECRET_KEY,{expiresIn : '2h'}) ;

        res.cookie('authToken',authToken,({httpOnly : true})) ;
        res.cookie('refreshToken',refreshToken,({httpOnly:true})) ;

        return res.status(200).json({ok:true,message : "Login Successful"}) ;

    }catch(err){
        next(err) ;
    }
})

router.get('/logout', async (req,res,next) => {
    try{
        res.clearCookie('authToken') ;
        res.clearCookie('refreshToken');
        return res.status(200).json({ok:true,message:"User has been logged out"}) ;
    }
    catch(err){
        next(err) ;
    }
})

router.use(errorHandler)

router.get('/checklogin',authTokenHandler,async (req,res) => {
    res.json({
        ok : true ,
        message : "Authenticated Successfully"
    })
})

module.exports = router; 