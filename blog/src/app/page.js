"use client"
import Image from 'next/image'
import Navbar from '@/app/Components/Navbar/Navbar'
import HomeSlider from './Components/HomeSlider/HomeSlider'
import CategorySlider from './Components/Categories/CategorySlider'
import BlogSlider from './Components/Blogs/BlogSlider'

export default function Home() {
  
  
  
  return (
    <main className="">
      <div className="">
        <Navbar/>
        <HomeSlider/>
        <CategorySlider/>
        <BlogSlider/>
        Welcome to the blog app 
      </div>
    </main>
  )
}
