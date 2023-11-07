const express = require('express');
const router = express.Router() ;
const jwt = require('jsonwebtoken') ;
const User = require('../Models/UserSchema')
const Blog  = require('../Models/BlogSchema')
const authTokenHandler = require('../Middlewares/checkAuthToken')
const errorHandler = require('../Middlewares/errorMiddleware')

require('dotenv').config() ;

const checkBlogOwnership = async(req,res,next) => {
    try{
        const blog = await Blog.findById(req.params.id) ;

        if(!blog){
            // console.log("not found ")   
            return res.status(404).json({message : "Blog post not found"})
        }

        if(blog.owner.toString() !== req.userId){
            // console.log("not matched ")
            return res.status(403).json({message : "Permission denied : You do not own this blog"}) ;
        }

        req.blog = blog ;
        next() ;

    }
    catch(err){
        res.status(500).json({message : err.message})
    }
}


router.post('/',authTokenHandler,async (req,res,next)=> {
    try{
        const {title,description,imageUrl,paragraphs,category} = req.body ;
        const blog =  new Blog({title,description,imageUrl,paragraphs,owner : req.userId,category}) ;
        await blog.save() ;

        const user = await User.findById(req.userId) ;
        if(!user){
            res.status(404).json({message : "User not found"}) ;
        }

        user.blogs.push(blog._id) ;
        await user.save() ;

        res.status(201).json({message : "Blog Post Created Succesfully",blog}) ;

    }
    catch(err){
        res.status('501').json({message : err.message})
    }  
})

router.get('/:id',async (req,res) => {
    try{
        const blog = await Blog.findById(req.params.id) ;

        if(!blog){
            return res.status(400).json({ok:false,message : "Blog post not found"}) ;
        }

        return res.status(200).json({ok:true,blog}) ;

    }catch(err){
        return res.status(500).json({ok:false,message: err.message}) ; 
    }
    
})

router.put('/:id',authTokenHandler,checkBlogOwnership,async(req,res) => {
    try{
        const {title,description,image,paragraphs,category} = req.body ;
        
        const updateBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            {title,description,image,paragraphs,category},
            {new:true}
        )

        if(!updateBlog){
            return res.status(404).json({message : "Blog post not found"}) ;
        }

        return res.status(200).json({message : "Blog post is sucessully updated",updateBlog}) ;

    }
    catch(err){
        res.status(500).json({message : err.message}) ;
    }
})

router.delete('/:id',authTokenHandler,checkBlogOwnership,async(req,res) => {
    try{
        const deletedBlog = await Blog.findByIdAndRemove(req.params.id) ;
        if(!deletedBlog){
            res.status(404).json({message : "Blog post not found"}) ;
        }

        const user = await User.findById(req.userId) ;
        if(!user){
            res.status(404).json({message : "User not found"}) ;
        }

        const blogIndex = user.blogs.indexOf(req.params.id);
        if(blogIndex !== -1){
            user.blogs.splice(blogInedx,1);
            await user.save() ;
        }

        res.status(200).json({message:"Blog deleted successfully"}) ;

    }
    catch(err){
        return res.status(500).json({message : err.message})
    }
})


router.get('/',async (req,res,next) => {
    try{
        const search = req.body.search || '' ;
        const page = parseInt(req.body.page) || 1 ;
        const perPage = 10 ;

        const searchQuery = new RegExp(search,'i') ;

        const totalBlogs = await Blog.countDocuments({title : searchQuery}) ;
        const totalPages = Math.ceil(totalBlogs/perPage) ;

        if(page<1 || page>totalPages){
            res.status(400).json({ok:false,message : "Invalid Page Number"});
        }

        // skipping page
        const skip = (page-1)*perPage ;

        const blogs = await Blog.find({title : searchQuery})
            .sort({createdAt : -1})
            .skip(skip)
            .limit(perPage) 

        res.status(200).json({ok:true,blogs,totalPages,currentPage : page}) ;
    }
    catch(err){
        return res.status(500).json({ok:false,message : err.message})
    }
})



router.use(errorHandler)

module.exports = router ;