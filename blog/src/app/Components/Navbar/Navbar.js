"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react' ;
import './Navbar.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import logo from '@/Assets/blogLogo.png'
import Image from 'next/image';
import { deleteCookie } from 'cookies-next';
import { toast } from 'react-toastify';
// import { cookies } from 'next/headers'

function navbar() {

  const [auth,setAuth] = useState(false) ;

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
        setAuth(true) ;
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

  const handleLogout = async () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,{
      method : 'GET',
      headers : {
        'Content-Type' : 'application/json',
      },
      credentials : 'include'
    })
    .then((res) => {
      return res.json() ;
    })
    .then((response) => {
      if(response.ok){
        setAuth(false) ;
        toast('Logged Out',{
          type : "success",
          position : 'top-right',
          autoClose : 2000 
        })
        window.location.href = '/pages/auth/signin'
      }
      else{
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

  useEffect(()=> {
    checkLogin() ;
  },[])

  return (
    <nav className="navbar  pb-2  flex  text-gray-400 bg-neutral-900 pl-10 pt-2  w-full justify-between items-center pr-10 ">
      <div className="navbar-left flex w-14 justify-between">
        <Link href='/pages/profile'>
          <AccountCircleIcon className='icons'/>
        </Link>
        <Link href='/pages/addblog'>
          <AddIcon className='icons'/>
        </Link>
        {/* <Link href='/pages/search'>
          <SearchIcon className='icons'/>
        </Link> */}
      </div>
      <div className="navbar-middle">
        <Link href='/'>
          <Image
            className='logo w-24'
            src={logo}
            alt='Company of Picture'
          />
        </Link>
      </div>
      <div className="navbar-right flex gap-x-3">
        {
          auth ? (
            <span onClick={handleLogout} className='cursor-pointer'> Log Out </span>
          ) : (
            <Link href='/pages/auth/signin' className='cursor-pointer'> Log In </Link>
          )
        }
      
        <Link href='/'> Home </Link>
        {/* <Link href='/pages/about'> About </Link>
        <Link href='/pages/contact'> Contact </Link>  */}
      </div>
    </nav>
  )
}

export default navbar