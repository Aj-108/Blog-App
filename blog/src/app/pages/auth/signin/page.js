"use client"
import Image from 'next/image'
import Navbar from '@/app/Components/Navbar/Navbar'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function Signin() {
  
  const [formData,setFormData] = useState({
    email : "",
    password : ""
  })
  const [errors,setErrors] = useState({}) ;

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

  return (
    <div className="signIn">
      <div className="">
        <Navbar/>
        <form onSubmit={handleSubmit} className="signIn__form">
            <div className="form__input">
                <label htmlFor="signIn__email"> Email </label>
                <input type="email" placeholder='Please Enter Your Email' name='email' value={formData.email} onChange={handleChange} id='signIn__email'/>
                {errors.email && <span className="formError"> {errors.email} </span> }
            </div>
            <div className="form__input">
                <label htmlFor="signIn__Password"> Password </label>
                <input type="password" placeholder='Please Enter Your Password' id='signIn__Password' name='password' value={formData.password} onChange={handleChange}/>
                {errors.password && <span className="formError"> {errors.password} </span> }
            </div>
            <button className="signIn__button" type="submit"> Log in </button>
            <p> Already have an account ? <Link href='/pages/auth/signup'> Register </Link> </p>
        </form>
      </div>
    </div>
  )
}
