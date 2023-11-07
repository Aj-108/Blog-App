const express = require('express') ;
const router =  express.Router() ;
require('dotenv').config() ;
const cloudinary = require('cloudinary').v2 ;
const multer = require('multer');
const sharp = require('sharp') ; 

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET 
  });

const storage = multer.memoryStorage() ;
const upload = multer({storage}) ;

router.post('/uploadimage',upload.single('myimage'),async (req,res) => {
    const file = req.file ;

    if(!file){
        return res.status(400).json({message : " No image file provided"})
    }

    sharp(file.buffer)
        .resize({width : 800})
        .toBuffer(async (err,data,info) => {
            if(err){
                console.log("Image processing error",err);
                return res.status(500).json({ok:false,error : "Error in image processing"}) ;
            }

            cloudinary.uploader.upload_stream({resource_type : 'auto'},async (error,result) => {
                if(error){
                    console.error('Cloudianry Upload Error : ',error) ;
                    return res.status(500).json({ok:false,message : "Error in image uploading to Cloudinary"}) ;
                }

                res.status(200).json({ok:true,imageUrl : result.url,message:"Image uploaded successfully"}) ;

            }).end(data) ;
        })

})

module.exports = router ;