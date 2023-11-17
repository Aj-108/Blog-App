"use client"
import Image from 'next/image'
import Navbar from '@/app/Components/Navbar/Navbar'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ClockLoader from 'react-spinners/ClockLoader'
import { gsap,ScrollTrigger } from 'gsap';

export default function AddBlog() {
  const [loading,setLoading] = useState(false) ;
  const [blog,setBlog] = useState({
    title : '',
    description : '',
    image : null,
    imageUrl : '',
    paragraphs : [],
    category : '' 
  })
  const [paraForm,setParaForm] = useState({
    title : '',
    description : '',
    image : null,
    imageUrl : '',
    position : '',
    createdAt : null  
  })
  const [categories,setCategories] = useState([]) ;

  const checkLogin = async () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/checklogin`,{
      method : 'GET',
      headers : {
        'Content-Type' : 'application/json',
      },
      credentials : 'include'
    })
    .then((res) => {
      return res.json()
    })
     .then((response) => {
      if(!response.ok){
        window.location.href = '/pages/auth/signin'
      }
     })
     .catch((error) => {
        console.log(error) ;
        window.location.href = '/pages/auth/signin' ;
     })
  }

  const getCategories = async () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`)
    .then(res => {
      return res.json() ;
    })
    .then(response => {
      // console.log(response) ;
      setCategories(response.categories)
    })
    .catch((err => console.log(err))) ;
  }

  let headingRef = useRef(null) ;
  let blogRef = useRef(null) ;
  let categoryRef = useRef(null) ;
  let descRef = useRef(null) ;
  let imgRef = useRef(null) ;
  let pheadRef = useRef(null) ;
  let ppositionRef = useRef(null) ;
  let ptitleRef = useRef(null) ;
  let pdescRef = useRef(null) ;
  let pimgRef = useRef(null) ;
  let pbuttonRef = useRef(null) ;
  let submitRef = useRef(null) ;
  let newParaRef = useRef(null) ;



  useEffect(() => {
    checkLogin() ;
    getCategories() ;
    setLoading(true) 

  },[])

  useEffect(()=> {
    const tl = gsap.timeline() ;
    // console.log("running")
    // console.log(headingRef)
    const elToAnimate = [headingRef,blogRef,categoryRef,descRef,imgRef,pheadRef,ppositionRef,ptitleRef,pdescRef] ;
    
    tl.fromTo(
      elToAnimate,
      { opacity: 0, x: -50 }, 
      {
        opacity: 1,
        x: 0, 
        duration: 1,
        stagger : 0.5,
        ease: 'power4.out', 
        delay: 0.2,
      }
    )


    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              [entry.target],
              { opacity: 0, x: -50 },
              {
                opacity: 1,
                x: 0,
                duration: 1,
                stagger : 0.2,
                ease: 'power4.out',
                delay: 0.2,
              }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 } 
    );

    [pimgRef,pbuttonRef,submitRef].forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    console.log(submitRef.current)

    return () => {
      observer.disconnect();
    };

    // gsap.registerPlugin(ScrollTrigger) ;
    // gsap.timeline({
    //   ScrollTrigger : {
    //     trigger : pimgRef.current ,
    //     start : "+=200",
    //     end : "+=200",
    //     scrub : true ,
    //     markers : true ,
    //     onEnter : () => {
    //       gsap.fromTo(
    //         pimgRef.current ,{
    //           opacity : 0 , x:-50, 
    //         },
    //         {
    //           opacity : 1 ,
    //           x : 0 ,
    //           duration : 1 ,
    //           ease : 'power4.out',
    //           delay : 0.4
    //         }
    //       )
    //     },
    //     onLeaveBack : () => {
    //       gsap.To(
    //         pimgRef.current ,
    //         {
    //           opacity : 0 ,
    //           x : -50 ,
    //           duration : 1 ,
    //           ease : 'power4.out',
    //           delay : 0.4
    //         }
    //       )
    //     }
    //   }
    // })

  },[loading])


  const pushParaToBlogs = () => {
    let tempPg = paraForm ;
    tempPg.createdAt = new Date().getTime() ;
    
    if(!paraForm.title){
      toast("Paragraph Title is mandatory",{
        type : "error",
        position : 'top-right',
        autoClose : 2000
      })
      return
    }
    
    if(!paraForm.description){
      toast("Description is mandatory",{
        type : "error",
        position : 'top-right',
        autoClose : 2000
      })
      return
    }

    if(!(paraForm.description.length > 50)){
      toast("There should be at least 50 words in description",{
        type : "error",
        position : 'top-right',
        autoClose : 2000
      })
      return
    }

    
    setBlog({
      ...blog,
      paragraphs : [
        ...blog.paragraphs,paraForm
      ]
    })
    let nextPosition = String(parseInt(paraForm.position)+1) ;
    setParaForm({
      ...paraForm,
      title : "",
      description : "",
      image : null,
      imageUrl : '',
      position : nextPosition,
      createdAt : null,
      
    })
  }



  const deletePara = (paragraph) => {
    const updatedPargraphs = blog.paragraphs.filter((p) => p.createdAt !== paragraph.createdAt)
    setBlog({...blog,paragraphs:updatedPargraphs})
  }

  const sortParagraphs = (a,b) => {
    if(a.position === b.position){
      return b.createdAt - a.createdAt ;
    }

    return a.position.localeCompare(b.position) ;
  }

  const uploadImage =  async (image) => {
    try{
      const formData = new FormData() ;
      formData.append('myimage',image) ;
      const response =  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/image/uploadimage`,{
        method : "POST",
        body : formData
      })

      if(response.ok){
        const data = await response.json() ;
        console.log("Image uploaded successfully",data) ;
        return data.imageUrl ;
      }else{
        console.log("Error in uploading image");
        return null ;
      }
    }
    catch(err){
      console.log(err) ;
      return null ;
    }
  }

  const showDescription = (text,maxWords) => {
    const words = text.split(' ');
    const truncatedText = words.slice(0, maxWords).join(' ');
    return truncatedText ;
  }

  const uploadBlog  = async () => {
    // e.preventDefault() ;
    checkLogin() ;
    if(!blog.title || !blog.category || !blog.description || !blog.image){
      toast('Please fill in the required fields') ;
      return ;
    }

    if(!(blog.description.length > 50)){
      toast("There should be at least 50 words in description",{
        type : "error",
        position : 'top-right',
        autoClose : 2000
      })
    }

    setLoading(false) ;
    let tempblog = blog ;
    if(blog.image){
      let imgUrl = await uploadImage(blog.image) ;
      tempblog.imageUrl = imgUrl ;
    }
    for(let i=0;i<tempblog.paragraphs.length ; ++i){
      let tempimg = tempblog.paragraphs[i].image ;
      if(tempimg){
        let pimgUrl = await uploadImage(tempimg) ;
        tempblog.paragraphs[i].imageUrl = pimgUrl ;
      }
    }


    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/blog`,{
      method : "POST",
      headers : {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify(blog) ,
      credentials : 'include'
    }) ;
     if(response.ok){
      // TODO navigate to another page and show success message 
      const data = await response.json() ;
      toast("Blog post created Successfully") ;
      setLoading(true) ;
      
      // setLoading(false) ;
     }else{
      toast('Failed to create blog post') ;
      setLoading(true) ;
     }
  }

  return (
    <div className="addBlog bg-black min-h-screen text-white">
      <Navbar/>
      {loading ? (
        <div className="flex flex-col justify-center pt-12">
          <div className=" pb-10 mx-auto" >
            <h1 className='text-4xl opacity-0' ref={el => headingRef = el}> Add Blog </h1>
          </div>
          
          <form action="" className="blog__form ml-2 mr-4 overflow-hidden md:mx-auto md:w-3/4">
              <div className="form__input flex gap-4 items-center pb-5 opacity-0" ref={el=>blogRef=el}>
                  <label htmlFor="blog__name" className='md:text-xl'> Blog Title : </label>
                  <input type="text" placeholder='Enter Blog Title' value={blog.title} 
                  onChange={(e) => setBlog({...blog,title:e.target.value})} 
                  id='blog__name'
                  className='p-2 w-1/2 rounded-md outline-none bg-neutral-800 text-gray-200 placeholder-gray-400  placeholder-opacity-75'
                  />
              </div>
              <div className="form__input flex gap-4 items-center pb-5 opacity-0" ref={el=>categoryRef=el}>
                  <label htmlFor="blog__category" className='md:text-xl'> Blog Category : </label>
                  <select value={blog.category} onChange={(e) => setBlog({...blog,category:e.target.value})} 
                      name="blog_-category" id="blog__category"
                      className='p-2 rounded-md outline-none bg-neutral-800 text-gray-200 placeholder-gray-400  placeholder-opacity-75'
                      >
                  <option value=""> Select a category </option>
                  { categories !== undefined &&
                  categories.map((category) => (
                      <option value={category} key={category}> {category} </option>
                    ))
                  }
                  </select>
              </div>
              <div className="form__input flex flex-col gap-2  pb-5 opacity-0" ref={el=>descRef=el}>
                  <label htmlFor="blog__desc" className='md:text-xl'> Blog Description : </label>
                  <textarea placeholder='Enter Blog Description' id='blog__desc' 
                    value={blog.description} onChange={(e) => setBlog({...blog,description:e.target.value})}
                    className='p-2 h-48 rounded-md outline-none bg-neutral-800 text-gray-200 placeholder-gray-400  placeholder-opacity-75'
                    />
              </div>
              <div className="form__input  flex  items-center gap-4  pb-5 opacity-0" ref={el=>imgRef=el}>
                  <label htmlFor="blog__image"> Blog Image :</label>
                  <input type="file" id='blog__image' onChange={(e) => {
                    const selectedImage = e.target.files?.[0] ;
                    if(selectedImage){
                      setBlog({...blog,image : selectedImage})
                    }
                  }}                  
                  />
              </div>

              <div className="blog__paras">
                  {
                    blog.paragraphs.length !== 0  ? <h1 className='text-3xl pb-4'> Paragraphs Added :  </h1> : (<h1 className='text-3xl pb-4 opacity-0' ref={el=>pheadRef=el}>  Add Paragraphs :  </h1> )
                  }
                  <div className="grid md:grid-cols-2 lg:grid-cols-3  2xl:grid-cols-4 gap-4 " ref={newParaRef}>
                      {blog.paragraphs.sort(sortParagraphs).map((paragraph,index) => (
                        <div className="my-4 rounded-2xl bg-[#dddddd] text-black min-h-[450px] flex flex-col justify-between max-h-[600px] overflow-hidden text-center" key={index}>
                          

                          <div className="">
                          {paragraph.image && <img  src={URL.createObjectURL(paragraph.image)} 
                                                    alt={`Image for ${paragraph.title}`}
                                                    className='min-w-full h-52 object-center object-cover'
                                                    />}
                          </div>

                          {/* <div className="flex flex-col items-center content-between justify-between"> */}
                            <div className="pt-2 flex flex-col justify-center items-center">
                              <h1 className='text-3xl font-semibold uppercase pb-1'> {paragraph.title} </h1>
                              <p className='px-2 max-w-full overflow-hidden '> {paragraph.image ?  showDescription(paragraph.description,30) : showDescription(paragraph.description,40)} </p>
                            </div>
                            <div className="cursor-pointer mt-1 py-1  text-white bg-red-700 w-full font-bold" onClick={()=> deletePara(paragraph)} > 
                                    Delete 
                            {/* </div> */}
                          </div>
                        </div>
                      ))}

                  </div>
              </div>

              <div className="para__form">
              <div className="form__input flex  items-center gap-4  pb-5 opacity-0" ref={el=>ppositionRef=el}>
                    <label htmlFor="para__position" className='md:text-xl'> Paragraph Position : </label>
                    <input type="number" placeholder='Enter Paragraph Position' 
                        value = {paraForm.position}
                        onChange={(e) => setParaForm({...paraForm,position : e.target.value})} 
                        id='para__position'
                        className='p-2 rounded-md outline-none bg-neutral-800 text-gray-200 placeholder-gray-400  placeholder-opacity-75'  
                          />
                  </div>
                <div className="form__input flex  items-center gap-4  pb-5 opacity-0" ref={el=>ptitleRef=el}>
                    <label htmlFor="para__name " className='md:text-xl' > Paragraph Title :</label>
                    <input type="text" placeholder='Enter para Title' required
                          id='para__name'
                          value={paraForm.title}
                          onChange={(e) => setParaForm({...paraForm,title : e.target.value})}
                          className='p-2 rounded-md outline-none bg-neutral-800 text-gray-200 placeholder-gray-400  placeholder-opacity-75'
                    />
                </div>
                <div className="form__input flex flex-col gap-2  pb-5 opacity-0" ref={el=>pdescRef=el}>
                    <label htmlFor="para__desc" className='md:text-xl'> Paragraph Description :</label>
                    <textarea placeholder='Enter para Description' id='para__desc'
                    value={paraForm.description}
                    onChange={(e) => setParaForm({...paraForm,description : e.target.value})}
                    className='p-2 h-48 rounded-md outline-none bg-neutral-800 text-gray-200 placeholder-gray-400  placeholder-opacity-75'
                    />
                </div>
                <div className="form__input flex  items-center gap-4  pb-5 opacity-0" ref={pimgRef}>
                    <label htmlFor="para__image " className='md:text-xl'> Paragraph Image : </label>
                    <input type="file" id='para__image'
                      onChange={(e) => {
                        const selectedImage = e.target.files?.[0] ;
                        if(selectedImage){
                          setParaForm({...paraForm,image : selectedImage})
                        }
                      }}
                    />
                </div>

                <button onClick={(e) => {
                  e.preventDefault() ;
                  pushParaToBlogs()  ;
                }}
                className='signUp__button  p-2 px-4 mb-4 self-center opacity-0 rounded-lg border-white border-2 text-white font-bold py-3 hover:bg-white hover:text-black transition-all delay-75'
                ref={pbuttonRef}
                > Add Paragrah To Blog </button>
              </div>
              
              <div className="flex ">
              <button className="blog__button mb-10 mt-5 opacity-0 mx-auto items-center rounded-lg border-2 p-4 border-green-600 text-green-500 font-bold hover:bg-green-500 hover:text-black uppercase" 
                type="submit" onClick={(e) => {
                e.preventDefault() ;
                uploadBlog()
                }}
                ref={submitRef}
                > Submit </button>
              </div>

          </form>
      </div>
      ) : (<> Loading ...... </>)}
      
    </div>
  )
}
