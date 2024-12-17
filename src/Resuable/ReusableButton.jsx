import React from 'react'
const ReusableButton = ({ title, onClick, type, className }) => {
  return (
    <div>
      <button
        type={type}
        className={className ? className : "bg-[#1f51a6] relative text-sm md:text-sm sm:text-sm lg:text-base text-white font-medium rounded-md py-2  hover:bg-blue-500 transition-colors   w-20 md:w-24 lg:24 sm:16"}
            
       
        onClick={onClick}
      >
        {title}
      </button>
    </div>
  )
}

export default ReusableButton