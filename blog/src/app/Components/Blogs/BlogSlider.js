import React, { useEffect, useState } from 'react'
import BlogCard from './BlogCard'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Pagination } from 'swiper/modules';
import { toast } from 'react-toastify';


function BlogSlider() {

    const [blogs,setBlogs] = useState([]) ; 
    const get10LatestBlogs = () => {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/blog`,{
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
          console.log(response) ;
          setBlogs(response.blogs)
        }else{
          toast(response.message,{
            type : 'error'
          })
        }
      })
      .catch(err =>  {
        toast(err.message,{
          type : 'error'
        })
      })
    }

    useEffect(()=> {
      get10LatestBlogs() ;
    },[])

    // const blogs = [
    //     {
    //       name : "Category 1 ",
    //       path : "#",
    //       bgcolor : "red"
    //     },
    //     {
    //       name : "Category 2 ",
    //       path : "#",
    //       bgcolor : "black"
    //     },
    //     {
    //       name : "Category 3 ",
    //       path : "#",
    //       bgcolor : "blue"
    //     },
    //     {
    //       name : "Category 4 ",
    //       path : "#",
    //       bgcolor : "red"
    //     },
    //     {
    //       name : "Category 2 ",
    //       path : "#",
    //       bgcolor : "black"
    //     },
    //     {
    //       name : "Category 3 ",
    //       path : "#",
    //       bgcolor : "blue"
    //     },
    //   ]
  
  
    return (
        <>
        <div className="px-3">
            <h1 className="pt-5 pb-5 text-3xl font-bold"> Blogs </h1>
    
    
            <Swiper
                slidesPerView={1}
                spaceBetween={10}
                pagination={{
                clickable: true,
                }}
                breakpoints={{
                '@0.00': {
                    slidesPerView: 1,
                    spaceBetween: 10,
                },
                '@0.75': {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                '@1.00': {
                    slidesPerView: 3,
                    spaceBetween: 40,
                },
                '@1.50': {
                    slidesPerView: 5,
                    spaceBetween: 50,
                },
                }}
                modules={[Pagination]}
                className="mySwiper px-3"
            >
                
    
                {
                    blogs.map((blogs) => {
                        return (
                            <SwiperSlide>
                                <BlogCard {...blogs}/>
                            </SwiperSlide>
                        )
                    })
                }
    
            </Swiper>
          </div>
        </>
  )
}

export default BlogSlider