import React from 'react'

function BlogCard(data) {
  
   const {title,imageUrl,_id} = data ;
  
  return (
    <div className="blogcard"
      onClick={() => {
        window.location.href = `/pages/blogpage?blogid=${_id}`
      }}
    >

      <div className="blogimg" style={{
        backgroundImage : `url(${imageUrl})`,
        minHeight : `300px` ,
      }}>

      </div>
      <p> 
        {title}
      </p>
    </div>
  )
}

export default BlogCard