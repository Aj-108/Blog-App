import React, { useEffect, useState } from 'react'
import CategoryCard from './CaregoryCard'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Pagination } from 'swiper/modules';

function CategorySlider() {
  
      const [categories,setCategories] = useState([]) ;
      
      const getCategories = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`)
        .then(res => {
          return res.json() ;
        })
        .then(async response => {
          // console.log(response) ;
          const tempcat = await Promise.all(
            response.categories.map(async (category) => ({
              name : category ,
              path : category ,
              bgcolor : 'black'
            }))
          );

          setCategories(tempcat)
        })
        .catch((err => console.log(err))) ;
      }
  
      useEffect(()=> {
        getCategories() ;
      },[])

  return (
    <>
    <div className="">
        <h1 className="uppercase px-4 mt-5 border-2 py-3 mb-5 text-3xl font-bold max-w-fit border-black border-l-0 rounded-r-2xl bg-black text-white"> 
          Categories 
        </h1>


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
                categories.map((category) => {
                    return (
                        <SwiperSlide>
                            <CategoryCard {...category}/>
                        </SwiperSlide>
                    )
                })
            }

        </Swiper>
      </div>
    </>
  )
}

export default CategorySlider