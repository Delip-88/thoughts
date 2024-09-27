import React from 'react'
import {FaExclamationTriangle } from 'react-icons/fa'

const NotFound = () => {
  return (
    <div className='w-full  flex flex-col content-center items-center p-5'>
      <FaExclamationTriangle size={50} className='text-yellow-500'/>
     <p className='text-xl font-semibold'> 404, Page not found</p>    
    </div>
  )
}

export default NotFound
