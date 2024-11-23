import React from 'react';
import Image from '../assets/File searching-rafiki.svg'; // Adjust the path based on your project structure

const NoData = ({msg}) => {
    return (
        <div className=''>
            <div className=''>
                <img src={Image} alt="No Data Found Image" className="img" style={{width:'100%', height: '100%' ,maxWidth:'100%',maxHeight:'100%',minHeight:'50%',minWidth:'50%',objectFit:"contains" }}/>
               <div  className='text-center -mt-8 ms-10'> <h5 className="text-base md:text-lg lg:text-xl">{msg?msg:"No Data Found"}</h5></div>
            </div>
        </div>
    );
}

export default NoData;
