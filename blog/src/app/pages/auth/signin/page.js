"use client"
import Image from 'next/image'
import Navbar from '@/app/Components/Navbar/Navbar'
import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import img from '@/Assets/BLOG.jpg'
import {gsap} from 'gsap'

export default function Signin() {
  
  const [formData,setFormData] = useState({
    email : "",
    password : ""
  })
  
  const [errors,setErrors] = useState({}) ;

  const timeline = gsap.timeline() ;

  let tl = useRef(timeline) ;
  let signButtonRef = useRef(null) ;
  let textRef = useRef(null) ;
  let textRef2 = useRef(null) ;
  let nameRef = useRef(null) ;
  let passRef = useRef(null) ;
  let bottomRef = useRef(null) ;


  const handleChange = (e) => {
    const {name,value} = e.target ; 
    setFormData({
      ...formData,
      [name]:value,
    })
  }

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
      if(response.ok){
        console.log("in")
        window.location.href = '/' 
      }
    })
    .catch(error => {
      console.log(error)
    })
  }


  const handleSubmit = (e) => {
    e.preventDefault() ;
    setErrors({})
    const validationErrors = {} ;
    if(!formData.email){
      validationErrors.email = "Email is required" ;
    }
    if(!formData.password){
      validationErrors.password = "Password is required" ;
    }
    if(Object.keys(validationErrors).length > 0){
      setErrors(validationErrors) ;
      return ;
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,{
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify(formData),
      credentials : 'include'
    })
    .then((res) => {
      return res.json() ;
    })
     .then((response) => {
        if(response.ok){
          toast(response.message,{
            type : "success",
            position : 'top-right',
            autoClose : 2000
          })
          checkLogin()
        }
        else{
          toast(response.message,{
            type : "error",
            position : 'top-right',
            autoClose : 2000
          })
        }
     })
     .catch((error) =>{
      toast(error.message,{
        type : "error",
        position : 'top-right',
        autoClose : 2000
      })
     })

  }

  
  useEffect(()=> {
    checkLogin() ;

    const tl = gsap.timeline() ;
    
    tl.fromTo(
      textRef,
      { opacity: 0, x: -50 }, 
      {
        opacity: 1,
        x: 0, 
        duration: 0.7,
        ease: 'power4.out', 
        delay: 0.2,
      }
    )
    .fromTo(
      textRef2,
      { opacity : 0 , x : -50},
      {
        opacity:1 ,
        x:0 ,
        duration : 0.7,
        ease: 'power4.out', 
        delay: 0.2,
      }
    )
    .fromTo(
      nameRef,
      { opacity: 0, x: 100 }, 
      {
        opacity: 1,
        x: 0, 
        duration: 0.7,
        ease: 'power4.out', 
        delay: 0.2,
      }
    )
    .fromTo(
      passRef,
      { opacity: 0, x: -100 }, 
      {
        opacity: 1,
        x: 0, 
        duration: 0.7,
        ease: 'power4.out', 
        delay: 0.2,
      }
    )
    .fromTo(
      signButtonRef,
      { opacity: 0, x: 30 }, 
      {
        opacity: 1,
        x: 0, 
        duration: 0.5,
        ease: 'power4.out', 
        delay: 0.4,
      }
    )
    .fromTo(
      bottomRef,
      { opacity: 0, x: -60 }, 
      {
        opacity: 1,
        x: 0, 
        duration: 0.7,
        ease: 'power4.out', 
        delay: 0.4,
      }
    )
  },[])



  return (
    <div className="signIn bg-black min-h-screen ">
      <Navbar/>
      <div className="flex justify-between w-full items-center">
        <form onSubmit={handleSubmit} className="signIn__form mx-auto xl:mt-0 my-10 text-white flex flex-col">
              <div className="pb-3">
                <h1 className='text-white text-4xl lg:text-5xl font-semibold opacity-0' ref={el => textRef = el}> Login To Account  </h1>
              </div>
              <div className="">
                <p className='lg:text-lg text-gray-400 pb-6 opcaity-0' ref={el=> textRef2 = el}> Its time to get login ...  </p>
              </div>
            <div className="form__input flex mb-4 mx-3 flex-col">
                <input type="email" placeholder='Please Enter Your Email' name='email' value={formData.email} 
                  onChange={handleChange} 
                  id='signIn__email'
                  className='p-2 w-full rounded-md outline-none bg-neutral-800 text-gray-200 placeholder-gray-400 placeholder-opacity-7'
                  ref = {el => nameRef = el}
                />
                {errors.email && <span className="formError text-gray-500 pt-1"> {errors.email} </span> }
            </div>
            <div className="form__input flex mb-4 mx-3 flex-col">
                <input type="password" placeholder='Please Enter Your Password' id='signIn__Password' name='password' value={formData.password} 
                  onChange={handleChange}
                  className='p-2 w-full rounded-md outline-none bg-neutral-800 text-gray-200 placeholder-gray-400 placeholder-opacity-7'
                  ref = {el => passRef = el}
                />
                {errors.password && <span className="formError text-gray-500 pt-1"> {errors.password} </span> }
            </div>
            <button 
                  className="signIn__button w-1/2 p-2 self-center  rounded-lg border-whote border-2 text-white opacity-0 font-bold mb-2 py-3 hover:bg-white hover:text-black transition-all delay-75" 
                  type="submit"
                  ref={el => signButtonRef=el}
                  > 
              Log in 
            </button>
            <div className="self-center">
              <p className='text-gray-400 opacity-0' ref = {el => bottomRef = el}> Already have an account ? <Link href='/pages/auth/signup' className='text-gray-300 hover:text-white'> Register </Link> </p>
            </div>
        </form>
        <div className="xl:block hidden w-1/2 ">
            <Image src={img} className='bg-contain max-h-screen'/>
        </div>
      </div>
    </div>
  )
}
