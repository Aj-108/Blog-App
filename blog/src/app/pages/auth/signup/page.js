"use client"
import Image from 'next/image'
import Navbar from '@/app/Components/Navbar/Navbar'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-toastify'


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
    
    <div className="signup">
      <div className="">
        <Navbar/>
        <form onSubmit={handleSubmit} className="signup__form">
            <div className="form__input">
                <label htmlFor="signup__name"> Name </label>
                <input type="text" placeholder='Please Enter Your Name' name='name' value={formData.name} onChange={handleChange} id='signup__name'/>
                {errors.name && <span className="formError"> {errors.name} </span> }
            </div>
            <div className="form__input">
                <label htmlFor="signup__email"> Email </label>
                <input type="email" placeholder='Please Enter Your Email' name='email' value={formData.email} onChange={handleChange} id='signup__email'/>
                {errors.email && <span className="formError"> {errors.email} </span> }
            </div>
            <div className="form__input">
                <label htmlFor="signup__Password"> Password </label>
                <input type="password" placeholder='Please Enter Your Password' name='password' value={formData.password} onChange={handleChange} id='signup__Password'/>
                {errors.password && <span className="formError"> {errors.password} </span> }
            </div>
            <div className="form__input">
                <label htmlFor="signup__confirmPassword"> Confirm Passowrd </label>
                <input type="password" placeholder='Please Enter Your Password ' name='confirmPassword'value={formData.confirmPassword} onChange={handleChange} id='signup__confirmPassword'/>
                {errors.confirmPassword && <span className="formError"> {errors.confirmPassword} </span> }
            </div>

            <button className="signUp__button" type="submit"> Register </button>
            <p> Already have an account ? <Link href='/pages/auth/signin'> Sign In </Link> </p>
        </form>
      </div>
    </div>
  )
}
