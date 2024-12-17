import React from "react";
import { useDispatch } from "react-redux";
import ReusableButton from "./ReusableButton";

const CustomAlert = ({
  visible,
  setVisible,
  action,

  onclickClose,
  title,
  showNo,
  heading,
  showOk,
  title2,
  data,
  data1,

  uploadType,
}) => {
  const dispatch = useDispatch();

  const handleOK = () => {
    dispatch(action);
    setVisible(false);
    if (heading && heading.includes("Something went wrong")) {
      setVisible(false);
    }
  };

  console.log("datawwww", data);
  let dataToRender = data?.existingFiles;

  let dataToRender1 = data?.nonexistFolder;
  console.log("data1", dataToRender);
  console.log("uploadType", uploadType);
  const showAlert = () => (
    <div
      className={`fixed top-0 right-0 bottom-0 left-0   bg-slate-900 bg-opacity-50 flex items-center justify-center ${
        visible ? "block" : "hidden"
      }`}
      style={{ zIndex: 1000 }}
    >
      <div className="lg:w-3/12 md:w-5/12 bg-white text-black rounded-2xl border  flex-wrap lg:mb-64 md:mt-24 sm:mt-24 2xl:mt-24 fixed mx-10">
        <div className="py-10 text-center lg:text-lg pl-2 px-2">
          <div>
            {dataToRender1?.length > 0 && (
              <small>
   
                {`This ${
                  uploadType === "folder" ? "folder" : "file"
                } not exist you want upload?`}
              </small>
            )}
            <ul>
              {dataToRender1?.map((item, index) => (
                <div className="flex justify-center">
                  <li key={(index ? ", " : "") + index}>{item}</li>
                </div>
              ))}
            </ul>
          </div>
          <small>
            {heading ? heading || heading.message : "Something went wrong."}
          </small>
          <ul>
            {dataToRender?.map((item, index) => (
              <div className="flex flex-row justify-center">
                <li className="" key={index}>
                  {item}
                </li>
              </div>
            ))}
          </ul>

          {/* <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul> */}
        </div>
        <div className="flex justify-end items-center pt-3 pr-3 pb-4 gap-x-2 border-t">
          {showOk ? (
            <ReusableButton
              title={title ? title : "OK"}
              onClick={() => handleOK()}
              className={
                " bg-red-600 relative text-white font-medium rounded-md py-2 text-sm md:text-sm sm:text-sm lg:text-base hover:bg-red-400 transition-colors  w-20 md:w-24 lg:24 sm:16"
              }
            />
          ) : null}

          {showNo ? (
            <ReusableButton
              title={title2 ? title2 : "Close"}
              onClick={onclickClose}
              className={
                "bg-[#1f51a6] relative text-white font-medium rounded-md py-2 text-sm md:text-sm sm:text-sm lg:text-base hover:bg-blue-500  transition-colors w-20 md:w-24 lg:24 sm:16"
              }
            />
          ) : null}
        </div>
      </div>
    </div>
  );

  return visible ? showAlert() : null;
};

export default CustomAlert;
