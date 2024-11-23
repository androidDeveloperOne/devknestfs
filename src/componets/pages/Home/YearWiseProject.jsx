import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchYears } from "../../../Redux/slices/YearDataSlice";
import ResaubleProjectCard from "../../../Resuable/ResaubleProjectCard";
import { useNavigate } from "react-router-dom";
import {
  clearProjectYearwiseData,
  projectFilesCount,
} from "../../../Redux/slices/YearWiseProject";
import {
  addName,
  clearAllParameters,
  clearParameters,
  setHeaderName,
} from "../../../Redux/slices/StepperSlice";

import CreateFolder from "../../../Resuable/CreateFolder";
import { clearSearchQuery } from "../../../Redux/slices/SearchQerySlice";
import LoadingCard from "../../../Resuable/ReUsableSkeletonLoader";
import { clearQrScannerData } from "../../../Redux/slices/QrScannerSlice";
import LoadingScreen from "../../../Resuable/LoadingScreen";

import Home from "../ActivityIndicator/Home";

import StepperHorizontal from "../../stepper";
import NoData from "../../../Resuable/NoData";

import { clearFolderStatus } from "../../../Redux/slices/createFolderSlice";
import LoaderCDUD from "../../../Resuable/LoaderCDUD";
import { fetchActivites } from "../../../Redux/slices/ActivityCheck";
import { clearDeleteFolder } from "../../../Redux/slices/FolderDeleteSlice";
import ResuableIcons from "../../../Resuable/ResuableIcons";

const YearWiseProject = React.memo(() => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state?.yearData);
  const { userType } = useSelector((state) => state?.auth?.userdata);
  let stepData = useSelector((state) => state?.stepperData);

  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const { searchQuery } = useSelector((state) => state?.searchData);
  const { createLoading, folderCreateStatus } = useSelector(
    (state) => state?.createFolderData
  );
  const [isUploadModalShown, setIsUploadModalShown] = useState(false);

  const navigate = useNavigate();
  const [isScroll, setIsScroll] = useState(false);

  const filterYearData = useMemo(() => {
    return data?.filter((item) =>
      item.year.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  useEffect(() => {
    dispatch(fetchYears({ data: [] }));

    dispatch(fetchActivites({ data: null }));
  }, [dispatch]);
  useEffect(() => {
    dispatch(clearProjectYearwiseData());

    localStorage.setItem("disable", JSON.stringify(true));

    sessionStorage.removeItem("pdfdata");

    sessionStorage.removeItem("selectedPdfUrl");
    dispatch(clearQrScannerData());
    dispatch(clearAllParameters());
    dispatch(clearSearchQuery());
    dispatch(setHeaderName("HOME"));  

    dispatch(clearDeleteFolder());

    localStorage.removeItem("selectedCardIndex1");

    const storedIndex = localStorage.getItem("selectedCardIndex");
    if (storedIndex !== null) {
      setSelectedCardIndex(parseInt(storedIndex, 10));
    }

    const handleBackButton = (event) => {
      navigate("/", { replace: true });

    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [dispatch]);

  useEffect(() => {
    if (folderCreateStatus) {
      dispatch(fetchYears({ DeleteCache: true }));

      dispatch(fetchActivites({ data: null }));
    }
  }, [folderCreateStatus]);

  const handleProjectYear = (year, index) => {
    navigate(`${year}`);
    dispatch(addName({ key: "0", value: year, parameter: year, year: year }));

    localStorage.setItem("selectedCardIndex", index);
    localStorage.setItem("year", year);
  };

  const handleCreatFolder = () => {
    setIsUploadModalShown(true);
    // localStorage.setItem("folderPath", JSON.stringify({ year: year }));
  };
  const handleCloseModal = (closeModal) => {
    if (folderCreateStatus) {
      dispatch(fetchYears());
      dispatch(clearFolderStatus());
    }
    setIsUploadModalShown(false);
  };
  // const handleFolderCreateStatus = (status) => {

  //   console.log("status",status);

  //   setCreateFolderLoading(status);
  // }

  const handleScroll = useCallback(
    (event) => {
      const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;


      if (scrollTop >= 1) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    },

    []
  );

  return (
    <>
      <div className="ms-12 p-0 lg:ms-16 2xl:ms-10 xl:-ms-4 ">
        {(userType === "Admin" || userType === "Operational Admin") && (
          <>
            <div className="fixed  z-1 right-6 bottom-28">
              <button
                className="bg-[#1f51a6] px-2 z-20  text-white active:bg-yellow-600 font-bold uppercase text-sm  rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 sm:bottom-4 sm:right-4 sm:text-xs md:text-sm md:bottom-6 md:right-6"
                type="button"
                // onClick={handleOpenModal}
              >
                <p className="my-3 px-2 ">
                  <ResuableIcons icon="IoReloadCircleOutline" size={30} />
                </p>
              </button>
            </div>
            <div className="bg-black fixed z-1 bottom-32 right-5 "></div>
            <div
              className={`${isUploadModalShown === true ? "  " : "fixed z-1"}`}
            >
              <CreateFolder
                openModal={handleCreatFolder}
                isHomePage={true}
                closeModal={handleCloseModal}
                // onFolderCreated={handleFolderCreateStatus}
              />
            </div>
          </>
        )}
        {createLoading && (
          <LoaderCDUD loading={createLoading} message={"Creating..."} />
        )}

        <div className="grid  mt-16">
          <div className="col-span-3 2xl:col-span-2 hidden md:block my-2">
            <Home moduleNameToFilter={{ data: "AWS" }} />
          </div>

          <div
            className="  col-span-9 2xl:col-span-10"
            onScroll={handleScroll}
            style={{
              height: "92vh",
              overflowY: "scroll",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <div className="col-span-full  hidden md:block fixed z-1 ">
              <StepperHorizontal stepData={stepData} isScrolled={isScroll} />
            </div>

            {filterYearData && filterYearData.length <= 0 ? (
              <div className="">
                {loading ? (
                  <div className="flex font-bold text-2xl justify-center">
                    <LoadingScreen />
                  </div>
                ) : (
                  <div className="flex justify-center  ms-0 mt-28 ">
                    {" "}
                    <NoData />
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-2  mt-20 lg:grid-cols-4 xl:grid-cols-6  gap-1 items-center">
                {filterYearData?.map((item, index) => {
                  if (
                    userType === "Admin" ||
                    item.year !== global.FreezedFolder
                  ) {
                    return (
                      <div className="p-2 cursor-pointer" key={index}>
                        {console.log("++++++++", global.FreezedFolder)}
                        {loading ? (
                          <LoadingCard gridLoader={true} />
                        ) : (
                          <ResaubleProjectCard
                            projectName={item.year}
                            showFolderIcon={true}
                            projectCount={item.noOfProjects}
                            lastModified={
                              new Date(
                                item.lastModifiedDate
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }) +
                              " " +
                              new Date(
                                item.lastModifiedDate
                              ).toLocaleTimeString("en-US", {
                                hour12: true,
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            }
                            handleCard={() =>
                              handleProjectYear(item.year, index)
                            }
                            backgroundColor={
                              selectedCardIndex === index
                                ? "selected-color"
                                : "default-color"
                            }
                          />
                        )}
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

export default YearWiseProject;
