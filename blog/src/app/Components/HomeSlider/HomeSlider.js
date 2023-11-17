
import React, { useEffect, useState } from 'react'
import img1 from '@/Assets/Slider1.png'
import img2 from '@/Assets/Slider2.png'

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';




function HomeSlider() {
    const [width,setWidth] = useState(0);
    const [height,setHeight] = useState(0) ;

    useEffect(() => {    
        setWidth(window.innerWidth) ;
        setHeight(window.innerHeight) ;
    },[])
  
  return (
    <>
    <Swiper
        slidesPerView={1}
        spaceBetween={30} 
        loop={true}
        pagination={{ 
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
            {/* {console.log(height/2)} */}
            <Image src={img1} alt="" width={width}  style={{objectFir:"cover"}} className='min-h-[450px] h-1/2 object-center'/>
        </SwiperSlide>
        <SwiperSlide>
            {/* {console.log(height/2)} */}
            <Image src={img2} alt="" width={width}  style={{objectFir:"cover"}}/>
        </SwiperSlide>
      </Swiper>
    </>
  )
}

export default HomeSlider 