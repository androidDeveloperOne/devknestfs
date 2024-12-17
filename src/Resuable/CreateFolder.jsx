import React, { useState } from "react";
import ResuableIcons from "../../src/Resuable/ResuableIcons";
import ReusableInput from "../../src/Resuable/ReusableInput";
import { Formik } from "formik";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import {
  clearFolderCreateName,
  createFolderName,
} from "../Redux/slices/createFolderSlice";
import { useRef } from "react";
import { useLocation } from "react-router-dom";

const fixedInputClass =
  "rounded-md appearance-none relative block w-full md:text-lg px-3 my-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none  focus:z-10  sm:text-sm";

export default function CreateFolder({
  openModal,
  isHomePage,
  closeModal,
  updatedData1,
  onFolderCreated,
}) {
  const [showModal, setShowModal] = useState(false);
  const { folderCreateName, erroratcreate, folderCreateStatus, createLoading } =
    useSelector((state) => state?.createFolderData);

  console.log("createLoading 22", createLoading);
  const folderPath = localStorage.getItem("folderPath");
  const initialUpdatedData = folderPath ? JSON.parse(folderPath) : null;

  const updatedfolderPath = localStorage.getItem("createupdatedData");

  const updatedData = updatedfolderPath ? JSON.parse(updatedfolderPath) : null;

  let dataToCreate = initialUpdatedData || updatedData;

  const location = useLocation();
  const locationPathName = location.pathname;
  const pathnameSegments = locationPathName
    .split("/")
    .filter((segment) => segment.trim() !== "");



    
  const bottomRef = useRef();
  const dispatch = useDispatch();
  const SignupSchema = Yup.object().shape({
    ProjectName: Yup.string().required("Project Name is required!"),
  });

  const handleOpenModal = () => {
    if (openModal) {
      openModal(true);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (closeModal) {
      closeModal(false);
    }

    setShowModal(false);
  };
  const createFolder = async (folderName, createLoading) => {
    dispatch(createFolderName({ folderName, data: { updatedData1 } }));
    if (createLoading) {
      onFolderCreated(createLoading); // Call the callback with true
    }
  };
  return (
    <>
      <div
        className={`fixed  z-9999 right-6 ${isHomePage ? "bottom-6 " : "bottom-28 "} `}
      >
        <button
          className="bg-[#1f51a6] px-2 z-20  text-white active:bg-yellow-600 font-bold uppercase text-sm  rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 sm:bottom-4 sm:right-4 sm:text-xs md:text-sm md:bottom-6 md:right-6"
          type="button"
          onClick={handleOpenModal}
        >
          <p className="my-3 px-2 ">
            <ResuableIcons icon="CreateFolder" size={30} />
          </p>
        </button>
      </div>
      {showModal ? (
        <>
          <Formik
            initialValues={{ ProjectName: "" }}
            validationSchema={SignupSchema}
            onSubmit={(values) => {
              if (
                values.ProjectName &&
                values.ProjectName.toLowerCase().endsWith(".pdf")
              ) {
                alert('Invalid input: File extension ".pdf" is not allowed.');
              } else {
                createFolder(values?.ProjectName?.toUpperCase());
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form
                className="outline-0 border-none m-4 font-medium "
                onSubmit={handleSubmit}
              >
                <div className="justify-center  bg-slate-900 bg-opacity-50 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative lg:w-5/12 lg:h-84 my-6 mx-auto lg:left-40 md:left-36">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      <div className="flex items-start justify-between p-3  border-b border-solid border-blueGray-200 rounded-t">
                        <h3 className="font-semibold text-xl lg:text-2xl md:text-2xl lg:ms-2">
                          Create Project
                        </h3>
                      </div>
                      <div
                        className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer"
                        onClick={() => {
                          localStorage.removeItem("folderPath");
                          localStorage.removeItem("createupdatedData");
                          dispatch(clearFolderCreateName());
                          setShowModal(false);
                          handleCloseModal();
                        }}
                      >
                        <ResuableIcons
                          icon={"IoMdClose"}
                          size={25}
                          color={"red"}
                        />
                      </div>
                      {folderCreateName.length > 0 ? (
                        <div className="">
                          <p className="my-3 text-center  font-bold ">
                            {folderCreateName}
                          </p>
                        </div>
                      ) : (
                        <div className="relative p-7 flex-auto">
                          <ReusableInput
                            name="ProjectName"
                            placeholder="ProjectName"
                            className={fixedInputClass}
                            handleChange={(e) => {
                              handleChange(e);
                              dispatch(clearFolderCreateName());
                            }}
                            handleBlur={handleBlur}
                          />
                        </div>
                      )}

                      <label className="text-sm md:text-sm mb-6 text-start ml-6 text-red-400">
                        {errors.ProjectName &&
                          touched.ProjectName &&
                          errors.ProjectName}
                      </label>

                      {erroratcreate && (
                        <label className="text-sm md:text-sm mb-6 text-start ml-6 text-red-400">
                          {erroratcreate}
                        </label>
                      )}
                      <div className="flex justify-between  items-center pt-3 pr-3 pb-4 gap-x-2 border-t ">
                        <button
                          className={
                            "bg-red-600 relative text-white font-medium rounded-md py-2  hover:bg-red-400 transition-colors text-sm md:text-sm sm:text-sm lg:text-base  w-20 md:w-24 lg:w-32 sm:16 ms-2"
                          }
                          type="button"
                          onClick={() => {
                            localStorage.removeItem("folderPath");
                            localStorage.removeItem("createupdatedData");
                            dispatch(clearFolderCreateName());
                            setShowModal(false);
                            handleCloseModal();
                          }}
                        >
                          Close
                        </button>

                        {folderCreateName.length > 0 ? (
                          // <button
                          //   className="bg-[#1f51a6] px-2 z-20  text-white active:bg-yellow-600 font-bold uppercase text-sm  rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 sm:bottom-4 sm:right-4 sm:text-xs md:text-sm md:bottom-6 md:right-6"
                          //   type="button"
                          // >
                          //   <p className="my-3 px-2 ">
                          //     <ResuableIcons icon="CreateFolder" size={30} />
                          //   </p>
                          // </button>
                          <></>
                        ) : (
                          <button
                            className="bg-[#1f51a6] relative text-white font-medium rounded-md py-2  hover:bg-blue-500 transition-colors text-sm md:text-sm sm:text-sm lg:text-base w-20 md:w-24 lg:w-32 sm:16"
                            type="submit"
                            name="submit"
                          >
                            Save
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </>
      ) : null}
    </>
  );
}
