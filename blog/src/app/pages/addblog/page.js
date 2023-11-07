"use client"
import Image from 'next/image'
import Navbar from '@/app/Components/Navbar/Navbar'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ClockLoader from 'react-spinners/ClockLoader'

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


  useEffect(() => {
    checkLogin() ;
    getCategories() ;
    setLoading(true) ;
  },[])

  const pushParaToBlogs = () => {
    let tempPg = paraForm ;
    tempPg.createdAt = new Date().getTime() ;
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
      position : nextPosition,
      createdAt : null
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

  const uploadBlog  = async () => {
    // e.preventDefault() ;
    checkLogin() ;
    if(!blog.title || !blog.category || !blog.description){
      toast('Please fill in the required fields') ;
      return ;
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
    <div className="addBlog">
      {loading ? (
        <div className="">
        <Navbar/>
        <h1> Add Blog </h1>
        <form action="" className="blog__form">
            <div className="form__input">
                <label htmlFor="blog__name"> Blog Title </label>
                <input type="text" placeholder='Enter Blog Title' value={blog.title} onChange={(e) => setBlog({...blog,title:e.target.value})} id='blog__name'/>
            </div>
            <div className="form__input">
                <label htmlFor="blog__category"> Blog Category </label>
                <select value={blog.category} onChange={(e) => setBlog({...blog,category:e.target.value})} name="blog_-category" id="blog__category">
                <option value=""> Select a category </option>
                { categories !== undefined &&
                categories.map((category) => (
                    <option value={category} key={category}> {category} </option>
                  ))
                }
                </select>
            </div>
            <div className="form__input">
                <label htmlFor="blog__desc"> Blog Description </label>
                <textarea placeholder='Enter Blog Description' id='blog__desc' value={blog.description} onChange={(e) => setBlog({...blog,description:e.target.value})}/>
            </div>
            <div className="form__input">
                <label htmlFor="blog__image"> Blog Image </label>
                <input type="file" id='blog__image' onChange={(e) => {
                  const selectedImage = e.target.files?.[0] ;
                  if(selectedImage){
                    setBlog({...blog,image : selectedImage})
                  }
                }}/>
            </div>

            <div className="blog__paras">

                {blog.paragraphs.sort(sortParagraphs).map((paragraph,index) => (
                  <div className="" key={index}>
                    <span onClick={() => deletePara(paragraph)}> Delete </span>

                    <div className="">
                      <h1> {paragraph.title} </h1>
                      <p> {paragraph.description} </p>
                    </div>
                    {paragraph.image && <img src={URL.createObjectURL(paragraph.image)} alt={`Image for ${paragraph.title}`}/>}
                  </div>
                ))}

            </div>

            <div className="para__form">
            <div className="form__input">
                  <label htmlFor="para__position"> Paragraph Position </label>
                  <input type="number" placeholder='Enter Paragraph Position' 
                      value = {paraForm.position}
                      onChange={(e) => setParaForm({...paraForm,position : e.target.value})} 
                      id='para__position'/>
              </div>
              <div className="form__input">
                  <label htmlFor="para__name"> Paragraph Title </label>
                  <input type="text" placeholder='Enter para Title' 
                        id='para__name'
                        value={paraForm.title}
                        onChange={(e) => setParaForm({...paraForm,title : e.target.value})}
                  />
              </div>
              <div className="form__input">
                  <label htmlFor="para__desc"> Paragraph Description </label>
                  <textarea placeholder='Enter para Description' id='para__desc'
                  value={paraForm.description}
                  onChange={(e) => setParaForm({...paraForm,description : e.target.value})}/>
              </div>
              <div className="form__input">
                  <label htmlFor="para__image"> Paragraph Image </label>
                  <input type="file" id='para__image'
                    onChange={(e) => {
                      const selectedImage = e.target.files?.[0] ;
                      if(selectedImage){
                        setParaForm({...paraForm,image : selectedImage})
                      }
                    }}
                  />
              </div>

              <button className="para__button" onClick={(e) => {
                e.preventDefault() ;
                pushParaToBlogs()  ;
              }}> Add Paragrah To Blog </button>
            </div>
            
            <button className="blog__button" type="submit" onClick={(e) => {
              e.preventDefault() ;
              uploadBlog()
              }}> Submit </button>


        </form>
      </div>
      ) : (<> Loading ...... </>)}
      
    </div>
  )
}
