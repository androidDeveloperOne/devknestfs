import React from 'react'
import { FadeLoader } from 'react-spinners'

const LoaderCDUD = ({ loading, message }) => {

  const override = {
    display: "block",
    margin: "0 auto",
    // borderColor: loading ? "red" : "blue", 
  };
  return (

    <div className="loading-containerCDUD">
      <div className='bg-blue-200 flex items-center p-2 w-52 h-16 truncate  rounded-xl mt-16'>
        <div>
          <FadeLoader
            color={"#1f51a6"}
            loading={loading}
            cssOverride={override}
            height={12}
            width={4}
          />
        </div>
        <div className="text-2xl ">{message?message:"Loading..."}</div>
      </div>
    </div>


  )
}

export default LoaderCDUD
