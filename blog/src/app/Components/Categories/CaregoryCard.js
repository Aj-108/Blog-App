import React from 'react'

function CaregoryCard(data) {
  const {name,bgcolor,path} = data ;
  
  return (
    <div className='border-2 text-black p-5 border-black mx-3 rounded-3xl mb-4 hover:cursor-pointer hover:text-white hover:bg-black'>
      <p className="font-bold text-base"> {name} </p>
    </div>
  )
}

export default CaregoryCard