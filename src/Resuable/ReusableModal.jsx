import React from "react";
import ReusableButton from "./ReusableButton";
import ResuableIcons from "./ResuableIcons";

const Modal = ({ isOpen, onClose, onSave, title, children }) => {
  return (
    <>
      <div
        className={`fixed top-0 right-0 bottom-0 left-0  bg-slate-900 bg-opacity-50 flex items-center justify-center ${
          isOpen ? "block" : "hidden"
        }`}
        style={{ zIndex: 100 }}
      >
        <div className="lg:w-4/12 lg:h-84 bg-white text-black rounded-2xl border  flex-wrap lg:mb-64 md:mt-24 sm:mt-24 2xl:mt-24 fixed ">
          <div
            className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer"
            onClick={onClose}
          >
            <ResuableIcons icon={"IoMdClose"} size={25} color={"red"} />
          </div>
          <div className="flex justify-center items-center py-8 px-4 border-b ">
            <h4 className="font-bold text-gray-800 ">{title}</h4>
          </div>
          <div className="p-6 md:p-8 lg:p-12 overflow-y-auto ">{children}</div>
          <div className="flex justify-between  px-4 items-center pt-3 pr-3 pb-4 gap-x-2 border-t  ">
            <div className="">
              <ReusableButton
                title="Close"
                type={"button"}
                onClick={onClose}
                // className={"bg-red-600 relative text-white font-medium rounded-md py-2  hover:bg-red-400 transition-colors w-32 md:w-32 lg:32 sm:16"}
              />
            </div>
            <div>
              <ReusableButton
                title="Save"
                onClick={onSave}
                className={
                  "bg-red-600 relative text-white font-medium rounded-md py-2 text-sm md:text-sm sm:text-sm lg:text-base hover:bg-red-400 transition-colors  w-20 md:w-24 lg:24 sm:16"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
