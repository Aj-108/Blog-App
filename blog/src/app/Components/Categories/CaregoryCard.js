import React from 'react'

function CaregoryCard(data) {
  const {name,bgcolor,path} = data ;
  
  return (
    <div style={{
      background : bgcolor ,
      display : "flex",
      justifyContent : "center" ,
      alignItems : "center",
      width : "300px",
      height : "200px"
    }}>

      <p className="text-white text-2xl"> {name} </p>

    </div>
  )
}

export default CaregoryCard