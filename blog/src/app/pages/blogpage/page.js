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

  const [blogCreatedAt,setBlogCreatedAt] = useState('') ;

  const formatDate = (inputDate) => {
    const date = new Date(inputDate) ;
    const day = date.getDate() ;
    const monthNames = [
      'January','February','March','April','June','July','August','September','October','November','December'
    ]
    const monthIndex = date.getMonth() ;
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
        // console.log(response) ;
        setBlog(response.blog) ;
        const formattedDate = formatDate(response.blog.createdAt) ;
        setBlogCreatedAt(formattedDate) ;
      }
      else{
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
    <div>
      <Navbar/>
      <div className="blogpage__container">
        <BlogSlider/>
      </div>
    </div>
  )
}

export default BlogPage