"use client"
import Image from 'next/image'
// import Navbar from '@/app/Components/Navbar/Navbar'
import Navbar from '@/app/Components/Navbar/Navbar'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-toastify'
import img from '@/Assets/BLOG.jpg'

export default function Signup() {
  
  const [formData,setFormData] = useState({
    name : '',
    email : '',
    password : '',
    confirmPassword : '',
  })

  const [errors,setErrors] = useState({}) ;
  // const [message,setMessage] = useState('') ;

  const handleChange = (e) => {
    // e.preventDefault() ;
    const {name,value} = e.target ; 
    setFormData({
      ...formData,
      [name]:value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault() ;
    // console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
    console.log(formData) ;
    setErrors({}) ;

    // Setting Errors 
    const validationErrors = {} ;
    if(!formData.email){
      validationErrors.email = "Email is required" ;
    }
    if(!formData.name){
      validationErrors.name = "Name is required" ;
    }
    if(!formData.password){
      validationErrors.password = "Password is required" ;
    }
    if(formData.password !== formData.confirmPassword){
      validationErrors.confirmPassword = "Password do not match" ;
    }

    if(Object.keys(validationErrors).length > 0){
      setErrors(validationErrors) ;
      return ;
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,{
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify(formData)
    })
    .then((res) => {
      return res.json() ;
    })
     .then((response) => {
      if(response.ok){
        toast(response.message,{
          type : 'success',
          position : 'top-right',
          autoClose : 2000 
        })
        setFormData({
          name : '',
          email : '',
          password : '',
          confirmPassword : '',
        })
      } else{
        toast(response.message,{
          type : "error",
          position : 'top-right',
          autoClose : 2000
        })
      }
     })
     .catch((error) => {
      toast(error.message,{
        type : "error",
        position : 'top-right',
        autoClose : 2000
      })
     })


  }

  return (
    
    <div className="signup bg-black">
      <Navbar/>
      <div className="flex justify-between w-full items-center">
        <div className="mx-auto">
          <form onSubmit={handleSubmit} className="signup__form text-white flex flex-col">
              <div className="pb-3">
                <h1 className='text-white text-5xl font-semibold'> Create New Account  </h1>
              </div>
              <div className="">
                <p className='text-lg text-gray-400 pb-6'> Fill in all the details to create a new account </p>
              </div>
              <div className="form__input flex mb-4 mx-3 flex-col">
                  {/* <label htmlFor="signup__name"> Name </label> */}
                  <input type="text" placeholder='Please Enter Your Name' name='name' value={formData.name} onChange={handleChange} id='signup__name'
                    className='p-2 w-full rounded-md outline-none bg-neutral-800 text-gray-200 placeholder-gray-400  placeholder-opacity-75'
                  />
                  {errors.name && <span className="formError text-gray-500 pt-1"> {errors.name} </span> }
              </div>
              <div className="form__input  flex mb-4 mx-3 flex-col">
                  {/* <label htmlFor="signup__email"> Email </label> */}
                  <input type="email" placeholder='Please Enter Your Email' name='email' value={formData.email} onChange={handleChange} id='signup__email'
                   className='p-2 w-full rounded-md outline-none bg-neutral-800 text-gray-200 placeholder-gray-400 placeholder-opacity-7'
                  />
                  {errors.email && <span className="formError text-gray-500 pt-1"> {errors.email} </span> }
              </div>
              <div className="form__input  flex mb-4 mx-3 flex-col">
                  {/* <label htmlFor="signup__Password"> Password </label> */}
                  <input type="password" placeholder='Please Enter Your Password' name='password' value={formData.password} onChange={handleChange} id='signup__Password'
                   className='p-2 w-full rounded-md outline-none bg-neutral-800 text-gray-200 placeholder-gray-400 placeholder-opacity-7' 
                  />
                  {errors.password && <span className="formError text-gray-500 pt-1"> {errors.password} </span> }
              </div>
              <div className="form__input  flex mb-4 mx-3 flex-col">
                  {/* <label htmlFor="signup__confirmPassword"> Confirm Passowrd </label> */}
                  <input type="password" placeholder='Please Confirm Your Password ' name='confirmPassword'value={formData.confirmPassword} onChange={handleChange} id='signup__confirmPassword'
                   className='p-2 w-full rounded-md outline-none bg-neutral-800 text-gray-200 placeholder-gray-400 placeholder-opacity-7'
                  />
                  {errors.confirmPassword && <span className="formError text-gray-500 pt-1"> {errors.confirmPassword} </span> }
              </div>

              <button className="signUp__button w-1/2 p-2 self-center bg-white rounded-sm text-black font-semibold" type="submit"> Register </button>
              <div className=" self-center">
              <p> Already have an account ? <Link href='/pages/auth/signin'> Sign In </Link> </p>
              </div>
          </form>
        </div>
        <div className="">
          <Image src={img} className='max-h-full h-auto'/>
        </div>
      </div>
    </div>
  )
}
