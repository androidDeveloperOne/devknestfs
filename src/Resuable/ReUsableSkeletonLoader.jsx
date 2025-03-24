import React from "react";
const LoadingCard = ({ gridLoader }) => {
    return (
        <div>
            {gridLoader ? <div className="flex justify-center">
                <div className="block  lg:w-60 lg:h-30   w-60 h-30 bg-white border border-gray-200 rounded-2xl cursor-pointer shadow hover:bg-gray-800">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200  animate-pulse ml-4 my-2">

                    </div>
                    <div className="ml-4 ">
                        <div className=" bg-slate-200 animate-pulse w-7/12 h-2 my-2"></div>
                        <div className=" bg-slate-200 animate-pulse w-7/12 h-2 my-2"></div>
                    </div>



                </div>
            </div> :
                <div className="flex justify-center  w-full md:w-9/12 lg:w-9/12 ">
                    <div className="flex justify-evenly w-full md:w-9/12 lg:w-9/12 h-16 items-center border-2 shadow-md rounded-2xl border-inherit mt-6">
                        <div className="w-10 h-10 rounded-2xl bg-slate-200  animate-pulse ml-4">

                        </div>
                        <div className="flex-grow mx-2">
                            <div className="w-full sm:96 h-2.5  bg-slate-200 animate-pulse"></div>
                            <div className="w-full h-2.5 bg-slate-200 animate-pulse mt-2"></div>
                        </div>

                        <div className="w-10 h-10 rounded-2xl  bg-slate-200 animate-pulse mr-4">

                        </div>


                    </div>
                </div>
            }

        </div>
    );
};

export default LoadingCard;
