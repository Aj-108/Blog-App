"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/app/Components/Navbar/Navbar'
import BlogSlider from '@/app/Components/Blogs/BlogSlider'
import { toast } from 'react-toastify'

function BlogPage() {
  const searchParams = useSearchParams() ;
  const blogid = searchParams.get('blogid') ;
  // console.log(blogid)

  const [blog,setBlog] = useState({
    _id : "",
    title : '',
    description : '',
    imageUrl : '',
    paragraphs : [],
    category : '' ,
    owner : '',
    createdAt : '',
    updatedAt : '',
  }) ;

  const [isLoading,setIsLoading] =  useState(true) ;

  const [blogCreatedAt,setBlogCreatedAt] = useState('') ;

  const formatDate = (inputDate) => {
    const date = new Date(inputDate) ;
    const day = date.getDate() ;
    const monthNames = [
      'January','February','March','April','June','July','August','September','October','November','December'
    ]
    const monthIndex = date.getMonth()-1 ;
    const year = date.getFullYear() ;

    return `${day} ${monthNames[monthIndex]} ${year}`
  }

  const getBlogbyId = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/${blogid}`,{
      method : "GET",
      headers : {
        'Content-Type' : 'application/json'
      }
    })
    .then(res => {
      return res.json() ;
    })
    .then(response => {
      if(response.ok){
        console.log("done")
        console.log(response) ;
        setBlog(response.blog) ;
        setIsLoading(false) ;
        const formattedDate = formatDate(response.blog.createdAt) ;
        setBlogCreatedAt(formattedDate) ;
        
      }
      else{
        console.log("error in response ok message ")
        toast(response.message,{
          type : 'error'
        })
      }
    })
    .catch(err => {
      toast(err.message,{
        type : 'error'
      })
    })
  }

  useEffect(()=> {
    getBlogbyId() ;
    window.scrollTo(0,0) ;
  },[])



  return (
    <div className='pb-16'>
      <Navbar/>
      <div className="flex flex-col pt-14">
          {
            isLoading ? (
              <div className=""> Loading .... </div>
            ) :(
            <div className="flex flex-col justify-center text-center items-center gap-4 mx-2">
              <div className="font-mono  text-gray-600">
                Created At {blogCreatedAt}
              </div>
              <div className="text-2xl md:text-4xl font-bold border-b-2 border-black px-2">
                {blog.title}
              </div>
              <div className="bg-neutral-600 text-white font-mono font-semibold p-2">
                {blog.category}
              </div>
              <div className="">
                <img src={blog.imageUrl} alt="Blog Image" className='max-h-screen'/>
              </div>
              <div className="mx-3 md:mx-5">
                {blog.description}
              </div>
                {blog.paragraphs.map((para) => (
                  <div className="flex flex-col border-t-2 border-neutral-400  mt-16 pb-4"> 
                        <div className="text-3xl font-bold px-2  lg:text-left pb-5 pt-8">
                          {para.title}
                        </div>
                        <div className="lg:flex mx-4">
                          <div className="text-left mr-4">
                            {para.description}
                          </div>
                          <div className="self-center">
                            { para.imageUrl ? <img src={para.imageUrl} alt="" className='lg:min-w-fit max-h-screen'/>  : <div className=""></div> }
                          </div>
                        </div>
                      
                  </div>
                ))}
                
            </div>
            )
          }
          <div className="blogpage__container border-t-2 border-neutral-400">
            <BlogSlider/>
          </div>
      </div>
    </div>
  )
}

export default BlogPage