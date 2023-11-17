import React, { useEffect, useRef } from 'react'
import {gsap} from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";

function BlogCard(data) {
  
   const {title,imageUrl,_id,description} = data ;
   
   let imageRef = useRef() ;

   useEffect(()=> {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline() ;
    

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(entry.target,{
              y : 200 ,
            },{
              y : 0 ,
              scale:1,
              opacity : 1 ,
              duration: 1 ,
              delay : 0.2 ,
            })

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.7 } // Adjust the threshold as needed
    );

    [imageRef].forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };

  },[])

  return (
    <div className="hover:bg-[#e2e2e2] hover:text-black border-black border-2  blogcard ml-3 cursor-pointer flex flex-col   bg-black text-white rounded-3xl  pb-4"
      onClick={() => {
        window.location.href = `/pages/blogpage?blogid=${_id}`
      }}
    >
      { imageUrl ?<>  
        <div className="">
          
          <img src={imageUrl} alt="Blog Image" ref={imageRef}
              className='rounded-tl-3xl  opacity-0 rounded-tr-3xl h-[400px] lg:h-[450px] w-full object-center object-cover     border-b-2 border-black'
            />
        </div>  
          <p className='pt-4 font-bold text-xl uppercase self-center'>
              {title}
          </p>        
      </>:(
        <div className="">
            <p className='pt-4 font-bold text-xl uppercase '>
                {title}
            </p>
            <p>
                {description}
            </p>
        </div>
      )}
      
{/* 
      <div className="blogimg rounded-tl-3xl rounded-tr-3xl min-h-fit" style={{
        backgroundImage : `url(${imageUrl})`,
      }}>

      </div> */}
    </div>
  )
}

export default BlogCard