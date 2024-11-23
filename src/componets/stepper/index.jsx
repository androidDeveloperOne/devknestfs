import React, { useEffect, useRef, useState } from "react";
import { Stepper, Step } from "@material-tailwind/react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import "./index.css";
import { clearfilterPDFWiseData } from "../../Redux/slices/FileSearchSlice";
import { clearDeleteLoding } from "../../Redux/slices/FolderDeleteSlice";
import { clearCreateLoading } from "../../Redux/slices/createFolderSlice";
import ResuableIcons from "../../Resuable/ResuableIcons";

export default function StepperHorizontal({
  stepData,
  activeStep,
  onPDFClose,
  start,
  stepperClick,
  isScrolled,
}) {
  const dispatch = useDispatch();
  // const [isScrolled, setIsScrolled] = useState(false);

  console.log("isScrolled", isScrolled);
  console.log("activeStep", activeStep);
  const [pathnameObjects, setPathnameObjects] = useState([
    { parameter: "Home" },
  ]);
  const location = useLocation();
  const navigate = useNavigate();

  // const pathnameObjects = [
  //   { "parameter": "Home" },
  //   ...pathnameSegments?.map((segment, index) => ({ parameter: segment }))
  // ];;
  console.log(" location", location.pathname);

  console.log("pathnameObjects", pathnameObjects);
  const elementRef = useRef(null);

  const locationPathName = location.pathname;
  const pathnameSegments = locationPathName
    .split("/")
    .filter((segment) => segment.trim() !== "");

  console.log("locationPathName", locationPathName);
  console.log("pathnameSegments", pathnameSegments);

  // Split the path by slashes
  const segments = locationPathName.split("/");

  // Replace %20 with spaces in each segment except for the first one
  const updatedSegments = segments.map((segment, index) => {
    if (index === 0) {
      return segment; // Leave the first segment unchanged
    } else {
      return segment.replace(/%20/g, " "); // Replace %20 with spaces in other segments
    }
  });

  // Join the updated segments back into a path string
  const updatedPathName = updatedSegments.join("/");

  console.log(updatedPathName); // Output: /test/DEM RAMYA P23DIR066

  useEffect(() => {
    if (elementRef?.current) {
      elementRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "end",
      });
    }
  }, [pathnameObjects, elementRef]);

  useEffect(() => {
    if (elementRef?.current) {
      elementRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "end",
      });
    }
  }, [pathnameObjects, elementRef]);

  useEffect(() => {
    const updatedPathnameObjects = [
      { parameter: "Home" },

      ...pathnameSegments.map((segment) => ({
        parameter: segment,
        location: location.pathname,
      })),
    ];
    setPathnameObjects(updatedPathnameObjects);
  }, [locationPathName]);

  const handleStepClick = (index) => {
    localStorage.removeItem("pdfdata");
    if (stepperClick) {
      stepperClick(null);
    }
    dispatch(clearDeleteLoding());
    dispatch(clearCreateLoading());
    localStorage.removeItem("selectedPdfUrl");
    const updatedPathnameObjects = pathnameObjects.slice(0, index + 1);
    setPathnameObjects(updatedPathnameObjects);

    console.log("updatedPathnameObjects", updatedPathnameObjects);
  };
  const insertLineBreaks = (text, maxLength) => {
    let result = "";
    for (let i = 0; i < text.length; i += maxLength) {
      result += text.substring(i, i + maxLength) + "<br />";
    }
    return result;
  };
  return (

    <div>

  <div
      className={` ${
        start
          ? `start  w-full px-2 `
          : "md:start-60 lg:start-96 w-4/5 md:w-9/12 2xl:w-4/5 xl:w-9/12 lg:w-9/12"
      } md:pe-96 lg:pe-96 2xl:ps-0 lg:ps-0 ms-0  flex flex-row rounded-xl   fixed  z-100 top-12    overflow-container2  ${
        isScrolled ? "bg-slate-50 rounded-xl   shadow-md" : ""
      } `}
    >
      <div className="my-3">
        <Stepper activeStep={activeStep}>
          {pathnameObjects?.map((item, index) => {
            const isActive = index === pathnameObjects.length - 1;
            const linkPath =
              index === 0
                ? "/"
                : `/${pathnameObjects
                    .slice(1, index + 1)
                    .map((obj) => obj.parameter)
                    .join("/")}`;
            console.log("item.value", linkPath);
            return (
              <React.Fragment key={index}>
                <div className="flex flex-row " style={{ width: "auto" }}>
                  <div ref={elementRef}>
                    <Link
                      className="no-underline "
                      to={
                        // index === 0
                        //   ? "/"

                        //   : `/${ pathnameObjects.slice(0, index).join("/")}`

                        linkPath
                      }
                      onClick={() => handleStepClick(index)}
                    >
                      <Step
                        className={`rounded-2xl bg-white  block appearance-none relative w-full h-9  items-center text-sm px-3  py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none  focus:z-10 truncate ${
                          isActive
                            ? " bg-[#1f51a6] rounded-2xl text-white"
                            : " "
                        } `}
                      >
                        {item.parameter.replace(/%20/g, " ")}
                      </Step>
                    </Link>
                  </div>
                  {index !== pathnameObjects.length - 1 && (
                    <div className="">
                      <hr className="w-30 lg:w-40 md:w-24 sm:w-24" />
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </Stepper>

        {/* <div className="flex  justify-start items-center  mb-3 ">
          {pathnameObjects.map((item, index) => {
            const isActive = index === pathnameObjects.length - 1;
            const formattedText = insertLineBreaks(
              item.parameter.replace(/%20/g, " "),
              23
            );

            const linkPath =
            index === 0
              ? "/"
              : `/${pathnameObjects
                  .slice(1, index + 1)
                  .map((obj) => obj.parameter)
                  .join("/")}`;
            console.log("isActive", isActive);

            return (
              <div className=" max-w-7xl  h-14  ">
                <div className="flex items-center justify-start  mb-2 ">
                  <Link
                  to={linkPath}
                  onClick={() => handleStepClick(index)}
                  >
                  {index === pathnameObjects.length - 1 ? (
                    <div
                      className="border-2 rounded-full activity-border w-8 h-8  flex justify-center items-center ">
                      <ResuableIcons
                        icon="VscCircleLargeFilled"
                        size={22}
                        color="#1f51a6"
                      />
                    </div>
                  ) : (
                    <div className="">
                      <div className="activity-background rounded-full w-8 h-8 flex justify-center items-center ">
                        <ResuableIcons icon="MdDone" size={22} color="#ffff" />
                      </div>
                    </div>
                  )}
                  </Link>
             

                  {index !== pathnameObjects.length - 1 && (
                    <div className="justify-center px-3 ">
                      <hr className="  h-1 w-40    mx-auto activity-background border-0" />
                    </div>
                  )}
                </div>
                <div className="">
                  <h6
                    className="whitespace-pre-wrap break-words text-sm"
                    dangerouslySetInnerHTML={{ __html: formattedText }}
                  />
                </div>
              </div>
            );
          })}
        </div> */}
      </div>
    </div>
    </div>
    
  );
}
