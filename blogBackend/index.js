const express = require('express') ;
const bodyParser = require('body-parser')
const cors = require("cors")
const app = express() ;
const port  = 8000
const authRoutes = require('./Routes/Auth')
const blogRoutes = require('./Routes/Blog')
const imageRoute = require('./Routes/Image') ;
const cookieParser = require('cookie-parser') ;


require('dotenv').config()
require('./db')
const User = require('./Models/UserSchema')

// const allowedOrigins = ['http://localhost:3000','http://localhost:8000']
// app.use(cors({
//     origin : function (origin,callback){
//         if(!origin || allowedOrigins.includes(origin)){
//             call(null,true) ;
//         }else{
//             callback(new Error('Not Allowed byy CORS'))
//         }
//     },
//     credentials : true 
// })) ;

// app.use(cors()) ;
const allowedOrigins = ['http://localhost:3000']; // Add more origins as needed

// Configure CORS with credentials
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // Allow credentials
    })
);

app.use(bodyParser.json()) ;
app.use(cookieParser()) ;
app.use('/auth',authRoutes) ;
app.use('/blog',blogRoutes) ;
app.use('/image',imageRoute) ; 

app.get('/',(req,res) => {
    res.json({message : "The API is working .... "})
})

app.get('/categories',async (req,res) => {
    try{
        const blogCategories = [
            "Technology and Trends",
            "Health and Wellness",
            "Travel Destination",
            "Food and Cooking",
            "Personal Finance",
            "Career Development",
            "Parenting Tips",
            "Self-Improvement",
            "Book Reviews",
            "Fitness and Excercise",
            "Fashon and Style",
            "Education",
            "Per Care",
            "Sports",
            "Mental Health"
        ] ;
    
        res.status(200).json({message : "categoried Fetched",categories:blogCategories});
    }
    catch(err){
        res.status(500).json({message : err.message,ok:"ilnads"})
    }
})


app.listen(port,()=>{
    console.log("server is up on ",port) ;
}) 