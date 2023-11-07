// "use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react' ;
import './Navbar.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import logo from '@/Assets/blogLogo.png'
import Image from 'next/image';
import { deleteCookie } from 'cookies-next';
// import { cookies } from 'next/headers'

function Navbar() {

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
    console.log('clicked')
    // cookies().delete('refreshToken') ;
    // cookies().delete('authToken') ;    
    await deleteCookie('refreshToken');
    await deleteCookie('authToken');
    window.location.href = '/pages/auth/signin'
  }

  useEffect(()=> {
    checkLogin() ;
  },[])

  return (
    <nav className="navbar flex  text-gray-400 bg-neutral-900 pl-10 pt-2 pb-2 w-full justify-between items-center pr-10 ">
      <div className="navbar-left flex w-24 justify-between">
        <Link href='/pages/profile'>
          <AccountCircleIcon className='icons'/>
        </Link>
        <Link href='/pages/addblog'>
          <AddIcon className='icons'/>
        </Link>
        <Link href='/pages/search'>
          <SearchIcon className='icons'/>
        </Link>
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
            <span onClick={handleLogout}> Log Out </span>
          ) : (
            <Link href='/pages/auth/signin'> Log In </Link>
          )
        }
      
        <Link href='/'> Home </Link>
        <Link href='/pages/about'> About </Link>
        <Link href='/pages/contact'> Contact </Link> 
      </div>
    </nav>
  )
}

export default Navbar