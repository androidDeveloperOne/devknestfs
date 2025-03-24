import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";

import ResaubleProjectCard from "../../../Resuable/ResaubleProjectCard";
import {
  clearSubDirectiresData,
  projectSubDirectroriesData,
} from "../../../Redux/slices/SubDirectriesSlice";
import PDFViewer from "../../../Resuable/PDFViewer";
import {
  addName,
  addUpdatedData,
  clearParameters,
} from "../../../Redux/slices/StepperSlice";
import { filetrPDFWiseDataSub } from "../../../Redux/slices/ProjectMainDirectories";
import SinglePdfViewer from "../../../Resuable/SinglePdfViewer";
import LoadingCard from "../../../Resuable/ReUsableSkeletonLoader";
import Upload from "../Upload";

import {
  clearDownloadProgress,
  downloadDirectoreis,
} from "../../../Redux/slices/DownloadSlice";

import "react-toastify/dist/ReactToastify.css";
import { clearSearchQuery } from "../../../Redux/slices/SearchQerySlice";
import CreateFolder from "../../../Resuable/CreateFolder";
import DownloadToast from "../../../Resuable/DownloadToast";
import LoadingScreen from "../../../Resuable/LoadingScreen";
import StepperHorizontal from "../../stepper";
import Home from "../ActivityIndicator/Home";
import NoData from "../../../Resuable/NoData";
import { deleteFolderData } from "../../../Redux/slices/FolderDeleteSlice";
import CustomAlert from "../../../Resuable/ReusableAlertBox";
import { deleteFileData } from "../../../Redux/slices/FileDeleteSlice";
import LoaderCDUD from "../../../Resuable/LoaderCDUD";
import { clearFolderStatus } from "../../../Redux/slices/createFolderSlice";
import { fetchActivites } from "../../../Redux/slices/ActivityCheck";
import {
  clearfilterPDFWiseData,
  filetrPDFWiseData,
} from "../../../Redux/slices/FileSearchSlice";

const SubDirectoriesProject = () => {
  const data = useParams();

  const { "*": updatedPD } = data;
  console.log("data****", data);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const location = useLocation();
  console.log("data at sub ", data);

  console.log("location sub", location);
  const [activeStep, setActiveStep] = useState("");

  const [updatedData, setUpdatedData] = useState("");

  console.log("updatedData", updatedData);
  const [clickedItemNames, setClickedItemNames] = useState([]);

  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);

  const [selectedUrl, setSelectedUrl] = useState(null);
  console.log("selectedUrl", selectedUrl);
  const [clickedItem, setClickedItem] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState([]);
  const [deleteData, setDeleteData] = useState(null);
  const [showDownloadConfirmation, setShowDownloadConfirmation] =
    useState(false);
  const [downloadItemData, setDownloadItemData] = useState(null);
  const [deleteFilePath, setDeleteFilePath] = useState([]);
  console.log("deleteFilePath", deleteFilePath);
  console.log("deleteData", deleteData);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [isModalShown, setIsModalShown] = useState(false);
  const [isUploadModalShown, setIsUploadModalShown] = useState(false);
  const [mergedDataForPDFViewer, setMergedDataForPDFViewer] = useState(null);
  const [deletedLoding, setDeletedLoding] = useState(false);
  const [createFolderLoading, setCreateFolderLoading] = useState(false);
  const [isScroll, setIsScroll] = useState(false);

  console.log("deletedLoding", deletedLoding);
  const [uploadStatus, setUploadStatus] = useState("select");
  let stepData = useSelector((state) => state?.stepperData);
  const locationPathName = location.pathname;
  const pathnameSegments = locationPathName.split("/");
  function replaceSpaces(segment) {
    return segment.replace(/%20/g, " ");
  }

  function replaceSpacesAfterSlash(inputString) {
    if (inputString.startsWith("/")) {
      inputString = inputString.substring(1);
    }

    let parts = inputString.split("/");

    for (let i = 0; i < parts.length; i++) {
      parts[i] = parts[i].replace(/%20/g, " ");
    }

    let result = parts.join("/");

    if (result.startsWith("/")) {
      result = result.substring(1);
    }

    return result;
  }
  const resultSegments = pathnameSegments.map(replaceSpaces).filter(Boolean);

  const resultPathname = replaceSpacesAfterSlash(locationPathName);

  console.log("resultSegments", resultSegments);

  let newResult = resultPathname.split("/");
  newResult.splice(0, 3);
  console.log("newResult", newResult);
  // console.log("pathnameSegments", pathnameSegments);
  console.log("mergedDataForPDFViewer", mergedDataForPDFViewer);

  const { projectSubdirectories, loading, error } = useSelector(
    (state) => state?.projectSub
  );

  console.log("projectSubdirectories", loading);
  const { userType } = useSelector((state) => state?.auth?.userdata);

  const { searchQuery } = useSelector((state) => state?.searchData);

  console.log("searchQuery", searchQuery);

  // const { floading } = useSelector((state) => state?.projectMain);
  // const { filterPDF, floading } = useSelector((state) => state?.projectMain);
  const { filterPDF, floadingFilter } = useSelector(
    (state) => state?.filterFile
  );
  console.log("filterPDF", filterPDF);
  const progressValue = useSelector(
    (state) => state.downloadData.downloadProgress
  );

  const { downloadloading } = useSelector((state) => state?.downloadData);
  const { deleteloading, errorDeleteFolder, deleteFolderItem } = useSelector(
    (state) => state?.deleteFolder
  );
  const debounceDelay = 500;
  const debounceTimerRef = useRef(null);
  console.log(" deleteloading", deleteloading);
  const { createLoading, folderCreateStatus } = useSelector(
    (state) => state?.createFolderData
  );
  const { deleteFileloading, errorDeleteFile, deleteItemFile } = useSelector(
    (state) => state?.delteFile
  );
  console.log(" deleteFileloading", deleteFileloading);
  const mergedData = projectSubdirectories
    ? [
        ...projectSubdirectories.reduce(
          (acc, item) => acc.concat(item.folders || []),
          []
        ),
        ...projectSubdirectories.reduce(
          (acc, item) => acc.concat(item.files || []),
          []
        ),
      ]
    : [];

  useEffect(() => {
    const storedPdfUrl = sessionStorage.getItem("selectedPdfUrl");
    if (storedPdfUrl) {
      setSelectedPdfUrl(JSON.parse(storedPdfUrl));
    }
    setSelectedPdfUrl(storedPdfUrl);
    console.log("storedPdfUrl", storedPdfUrl);
  }, []);
  useEffect(() => {
    if (searchQuery) {
      setSelectedUrl(null);
    }

    if (deleteloading === false) {
      setDeleteData([]);
      setDeleteFilePath([]);
    }

    dispatch(clearSearchQuery());
    let projectDirectory = [];

    if (updatedPD) {
      projectDirectory = updatedPD.split("/");
    }
    console.log("projectDirectory", projectDirectory);
    const lastDirectoryName = projectDirectory[projectDirectory.length - 1];

    console.log("lastDirectoryName", lastDirectoryName);

    dispatch(
      addName({
        parameter: lastDirectoryName,
      })
    );

    dispatch(
      projectSubDirectroriesData({
        year: data?.year,
        project: data?.project,
        drawingType: data?.drawingType,
        projectDirectories: projectDirectory,
      })
    );

    const storedIndex = localStorage.getItem("selectedCardIndex3");

    if (storedIndex !== null) {
      setSelectedCardIndex(parseInt(storedIndex, 10));
    }
    dispatch(fetchActivites({ data: resultSegments }));
  }, [updatedPD]);
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      dispatch(clearfilterPDFWiseData());
    }

    if (searchQuery.length > 0) {
      debounceTimerRef.current = setTimeout(() => {
        dispatch(
          filetrPDFWiseData({
            data: { resultSegments, searchQuery: searchQuery },
          })
        );
      }, debounceDelay);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    if (
      deleteFolderItem ||
      deleteItemFile ||
      uploadStatus == "done" ||
      folderCreateStatus
    ) {
      console.log("i am dispathced at directory");
      dispatch(
        projectSubDirectroriesData({
          year: data?.year,
          project: data?.project,
          drawingType: data?.drawingType,
          projectDirectories: newResult,
          deleteCache: true,
        })
      );
      dispatch(fetchActivites({ data: resultSegments }));

      // setCreateFolderLoading(false);
    } else {
      setDeleteData([]);
      setDeleteFilePath([]);
    }
  }, [
    deleteFolderItem,
    deleteItemFile,
    dispatch,
    uploadStatus,
    folderCreateStatus,
  ]);

  useEffect(() => {
    const handleBackButton = () => {
      setSelectedUrl(null);
      sessionStorage.removeItem("selectedPdfIndex");
      sessionStorage.removeItem("selectedPdfUrl");
      sessionStorage.removeItem("pdfdata");
      setSelectedPdfUrl(null);
    };

    // dispatch(clearfilterPDFWiseData());

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [dispatch]);

  let pathName = location.pathname;

  const handleCard = useCallback(
    (item, index, filteredIndex) => {
      const namesArray = Array.isArray(item.name) ? item.name : [item.name];

      const updatedData = {
        ...data,
        projectDirectories: [...clickedItemNames, ...namesArray],
      };

      setUpdatedData(updatedData);

      localStorage.setItem("updatedData", JSON.stringify(updatedData));
      localStorage.setItem("selectedCardIndex3", index);

      setClickedItemNames((prevNames) => [...prevNames, ...namesArray]);

      const dynamicRoute = `${pathName}/${item.name}`;

      console.log("dynamicRoute", dynamicRoute);

      if (item.name.toLowerCase().includes(".pdf")) {
        const previousPath = location.pathname;
        navigate(previousPath);
        return;
      }

      console.log("dynamicRoute", dynamicRoute);
      navigate(dynamicRoute);
      const navigateToDynamicRoute = (itemName) => {};

      navigateToDynamicRoute(clickedItemNames);
    },
    [projectSubdirectories]
  );

  const checkPDF = (item) => {
    let pdfFile = item.toLowerCase().includes(".pdf" || ".PDF");
    return pdfFile;
  };
  const filteredMergedData = mergedData?.filter((item) => item.url);

  const filterMainDirectoriesDataPDF = useMemo(() => {
    return filterPDF?.filter((item) =>
      item.name
        .replace(/\s/g, "")
        .toLowerCase()
        .includes(searchQuery.replace(/\s/g, "").toLowerCase().trim())
    );
  }, [filterPDF, searchQuery]);

  const handlePdfUrl = (url) => {
    setSelectedUrl(url);
  };

  const handleClosePdfViewer = () => {
    setSelectedPdfUrl(null);
    // setMergedDataForPDFViewer(null);

    sessionStorage.removeItem("pdfdata");

    sessionStorage.removeItem("selectedPdfUrl");
  };
  const handleCloseSinglePdfViewer = () => {
    setSelectedUrl(null);
    dispatch(clearSearchQuery());
  };
  const handleCreatFolder = (isopen) => {
    setIsModalShown(isopen);
  };

  const handleCloseModal = (closeModal) => {
    setIsModalShown(closeModal);
    if (folderCreateStatus) {
      // let projectDirectory = [];
      // if (updatedPD) {
      //   projectDirectory = updatedPD.split("/");
      // }
      // dispatch(
      //   projectSubDirectroriesData({
      //     year: data?.year,
      //     project: data?.project,
      //     drawingType: data?.drawingType,
      //     projectDirectories: projectDirectory,
      //   })
      // );
      dispatch(clearFolderStatus());
    }
  };

  const handleDownload = (item, updatedData) => {
    setDownloadItemData(item);
    setShowDownloadConfirmation(true);
    dispatch(clearDownloadProgress());
  };

  const handleOkDownload = () => {
    dispatch(
      downloadDirectoreis({
        data: resultSegments,
        currentName: downloadItemData?.name,
      })
    ).then(() => {
      setDownloadItemData(null);
    });
    setShowDownloadConfirmation(false);
  };
  const handleDelete = (item) => {
    let deletePath = item.name;
    const parts = item.name.split(".");

    if (parts.length > 1) {
      const fileNameWithoutExtension = parts.join(".");
      setDeleteFilePath(fileNameWithoutExtension);
    } else {
      setDeleteData(deletePath);
    }

    setCustomAlertVisible(true);
  };

  const handleOkDelete = () => {
    console.log(
      "+++++++++++++++++++",
      resultSegments,
      "+++++++++++",
      deleteData
    );

    if (deleteData && deleteData.length > 0) {
      dispatch(
        deleteFolderData({ data: resultSegments, currentName: deleteData })
      );
      // setDeletedLoding(true);
      // .then(() => {
      //   let projectDirectory = [];
      //   if (updatedPD) {
      //     projectDirectory = updatedPD.split("/");
      //   }
      //   setDeletedLoding(true);
      //   return dispatch(
      //     projectSubDirectroriesData({
      //       year: data?.year,
      //       project: data?.project,
      //       drawingType: data?.drawingType,
      //       projectDirectories: projectDirectory,
      //     })
      //   );
      // })
      // .then(() => {
      //   if (projectSubdirectories) {
      //     const updatedMergedData = [
      //       ...projectSubdirectories.reduce(
      //         (acc, item) => acc.concat(item.folders || []),
      //         []
      //       ),
      //       ...projectSubdirectories.reduce(
      //         (acc, item) => acc.concat(item.files || []),
      //         []
      //       ),
      //     ];
      //     mergedData = updatedMergedData;
      //   }
      // })
      // .catch((error) => {
      //   console.error("Error deleting file:", error);
      // });
    }

    if (deleteFilePath && deleteFilePath.length > 0) {
      dispatch(
        deleteFileData({ data: resultSegments, currentName: deleteFilePath })
      );
      setDeletedLoding(true);
      console.log("i am dispathced at delete");
      // .then(() => {
      //   let projectDirectory = [];
      //   if (updatedPD) {
      //     projectDirectory = updatedPD.split("/");
      //   }
      //   setDeletedLoding(true);
      //   return dispatch(
      //     projectSubDirectroriesData({
      //       year: data?.year,
      //       project: data?.project,
      //       drawingType: data?.drawingType,
      //       projectDirectories: projectDirectory,
      //     })

      //   );

      // })
      // .then(() => {
      //   if (projectSubdirectories) {
      //     const updatedMergedData = [
      //       ...projectSubdirectories.reduce(
      //         (acc, item) => acc.concat(item.folders || []),
      //         []
      //       ),
      //       ...projectSubdirectories.reduce(
      //         (acc, item) => acc.concat(item.files || []),
      //         []
      //       ),
      //     ];
      //     mergedData = updatedMergedData;
      //   }
      // })
      // .catch((error) => {
      //   console.error("Error deleting file:", error);
      // });
    }
  };

  const handleOpenUpload = (isopen) => {
    setIsUploadModalShown(isopen);
    localStorage.removeItem("uploadMessage");
  };

  const handleCloseUpload = (isClose) => {
    setIsUploadModalShown(isClose);

    // const uploadMessage = localStorage.getItem("uploadMessage");
    // if (uploadMessage === "Upload complete!") {
    //   let projectDirectory = [];
    //   if (updatedPD) {
    //     projectDirectory = updatedPD.split("/");
    //   }
    //   dispatch(
    //     projectSubDirectroriesData({
    //       year: data?.year,
    //       project: data?.project,
    //       drawingType: data?.drawingType,
    //       projectDirectories: projectDirectory,
    //     })
    //   );
    //   // dispatch(fetchActivites());
    // }
  };
  const handleStepperClick = (data) => {
    setSelectedPdfUrl(data);

    // console.log("stepperClick",stepperClick);

    sessionStorage.removeItem("selectedPdfUrl");
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedUrl || selectedPdfUrl) {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedUrl, selectedPdfUrl]);

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo(0, 0);
    };

    if (selectedPdfUrl || selectedUrl) {
      handleScrollToTop();
    }
  }, [selectedPdfUrl, selectedUrl]);
  const handleUploadStatusChange = (status) => {
    setUploadStatus(status);
  };
  const handleFolderCreateStatus = (status) => {
    setCreateFolderLoading(status);
  };

  const handleScroll = useCallback(
    (event) => {
      const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
      var isScroll = scrollHeight - scrollTop <= clientHeight * 1.5;

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
      <div className="   ">
        <DownloadToast downloadloading={downloadloading} />
        {/* {deleteloading && <LoaderCDUD loading={deleteloading} message={"Deleting..."} />} */}
        {deleteloading && (
          <LoaderCDUD
            loading={deleteloading || deleteFileloading}
            message={"Deleting..."}
          />
        )}
        {deleteFileloading && (
          <LoaderCDUD loading={deleteFileloading} message={"Deleting..."} />
        )}

        {createLoading && (
          <LoaderCDUD loading={createLoading} message={"Creating..."} />
        )}
        <CustomAlert
          visible={customAlertVisible}
          setVisible={(isVisible) => setCustomAlertVisible(isVisible)}
          heading={"Are you sure you want delete ?"}
          title={"OK"}
          showOk={true}
          title2={"Cancel"}
          action={handleOkDelete}
          showNo={true}
          onclickClose={() => {
            setCustomAlertVisible(false);
            setDeleteData([]);
            setDeleteFilePath([]);
          }}
        />

        <CustomAlert
          visible={showDownloadConfirmation}
          setVisible={setShowDownloadConfirmation}
          heading={"Are you sure you want to download?"}
          title={"OK"}
          showOk={true}
          title2={"Cancel"}
          action={handleOkDownload}
          showNo={true}
          onclickClose={() => {
            setShowDownloadConfirmation(false);
            setDownloadItemData(null);
          }}
        />

        {!selectedPdfUrl &&
          !selectedUrl &&
          (userType === "Admin" || userType === "Operational Admin") && (
            <div className="fixed z-1 ">
              <Upload
                folderData={{
                  key: "3",
                  year: data?.year,
                  project: data?.project,
                  drawingType: data?.drawingType,
                }}
                updatedData={updatedData}
                uploadPath={isUploadModalShown ? resultPathname : null}
                closeModal={handleCloseUpload}
                openModal={handleOpenUpload}
                onUploadStatusChange={handleUploadStatusChange}
              />
            </div>
          )}
        {!selectedPdfUrl &&
          !selectedUrl &&
          (userType === "Admin" || userType === "Operational Admin") && (
            <div
              className={`${
                isUploadModalShown === true ? " fixed -z-1 " : "fixed z-1"
              }`}
            >
              <CreateFolder
                openModal={handleCreatFolder}
                closeModal={handleCloseModal}
                updatedData1={isModalShown ? resultSegments : null}
                onFolderCreated={handleFolderCreateStatus}
              />
            </div>
          )}

        {createFolderLoading && (
          <LoaderCDUD loading={createFolderLoading} message={"Creating..."} />
        )}

        <div
          // onScroll={handleScroll}
          // style={{ overflowY: "auto" }}
          className={`grid 
            
            ${selectedUrl || selectedPdfUrl ? "lg:mt-0" : "mt-14 px-0"}`}
        >
          {!(selectedUrl || selectedPdfUrl) && (
            <div className="2xl:col-span-2 col-span-3 hidden md:block my-3 ">
              <Home
                moduleNameToFilter={{
                  data: { year: data?.year, project: data?.project },
                }}
              />
            </div>
          )}

          {searchQuery ? (
            <div
              className={`  2xl:col-span-${
                selectedUrl ? "12" : "10"
              } col-span-${selectedUrl ? "12" : "9"}`}
              onScroll={handleScroll}
              style={{
                height: "98vh",
                overflowY: "scroll",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {selectedUrl ? (
                <div className="mt-16 ">
                  {floadingFilter ? (
                    <LoadingCard gridLoader={true} />
                  ) : (
                    <div className="2xl:col-span-12 ">
                      <div className="hidden md:block  ">
                        <StepperHorizontal
                          stepData={stepData}
                          activeStep={activeStep}
                          start={`${selectedUrl ? "start-0 " : ""}`}
                          stepperClick={handleStepperClick}
                          isScrolled={isScroll}
                        />
                      </div>

                      <div className=" mt-32">
                        <SinglePdfViewer
                          pdfUrl={selectedUrl}
                          onClose={handleCloseSinglePdfViewer}
                          isSearch={true}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {filterMainDirectoriesDataPDF &&
                  filterMainDirectoriesDataPDF.length <= 0 ? (
                    <div className="">
                      {floadingFilter ? (
                        <div className="flex font-bold text-2xl justify-center">
                          <LoadingScreen loading={floadingFilter} />
                        </div>
                      ) : (
                        <div className="flex justify-center ms-0 mt-28">
                          {" "}
                          <NoData />
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="hidden md:block fixed z-1  ">
                        <StepperHorizontal
                          stepData={stepData}
                          activeStep={activeStep}
                          start={`${selectedPdfUrl ? "start-0 " : ""}`}
                          stepperClick={handleStepperClick}
                          isScrolled={isScroll}
                        />
                      </div>

                      <div className="grid grid-cols-1   sm:grid-cols-2 md:grid-cols-2 mt-24 ms-12 p-0 lg:ms-10 2xl:ms-6 xl:-ms-8  lg:grid-cols-4 xl:grid-cols-6 pe-3 ">
                        {filterMainDirectoriesDataPDF?.map((item, index) => {
                          return (
                            <div className="" key={index}>
                              {loading ? (
                                <LoadingCard gridLoader={true} />
                              ) : (
                                <ResaubleProjectCard
                                  showFolderIcon={!item.url}
                                  showPdfIcon={!!item.url}
                                  projectName={item.name}
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
                                  showDownloadIcon={!item.url}
                                  drawing={item.noOfDrawings}
                                  handleCard={() => {
                                    handlePdfUrl(item);
                                  }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <div
              className={`    2xl:col-span-${
                selectedPdfUrl ? "12" : "10"
              } col-span-${selectedPdfUrl ? "12" : "9"}`}
              onScroll={handleScroll}
             

              style={{ height: "98vh", 
                overflowY: "scroll" ,
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none"
                }
              
              }}
            >
              <div
                className={`  col-span-full  bg-white hidden md:block  ${
                  (isUploadModalShown || isModalShown) === true
                    ? " fixed -z-1 "
                    : "fixed z-1"
                }
                  
                  
                  
                  mt-32 ${selectedPdfUrl ? "mt-32" : "mt-0 p-2"}
                
                
                
                `}
              >
                <StepperHorizontal
                  stepData={stepData}
                  activeStep={activeStep}
                  start={`${selectedPdfUrl ? "start-0  " : ""}`}
                  stepperClick={handleStepperClick}
                  isScrolled={isScroll}
                />
              </div>

              <>
                {selectedPdfUrl ? (
                  <div className="col-span-12 mt-32 ">
                    {/* <button className="absolute  " onClick={handleClosePdfViewer}>close</button> */}
                    <PDFViewer
                      pdfUrl={mergedData}
                      selectedPdfUrl={selectedPdfUrl}
                      onClose={handleClosePdfViewer}
                    />
                  </div>
                ) : (
                  <>
                    {mergedData && !loading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 mt-24 lg:grid-cols-4 xl:grid-cols-6 px-3  ms-12 p-0 lg:ms-10 2xl:ms-6 xl:-ms-8 mb-5  ">
                        {mergedData?.map((item, index) => {
                          return (
                            <div className="" key={index}>
                              <ResaubleProjectCard
                                showFolderIcon={!item.url}
                                showPdfIcon={!!item.url}
                                showDeleteIcon={true}
                                projectName={item.name}
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
                                drawing={item.noOfDrawings}
                                showDownloadIcon={!item.url}
                                // showDownloadProgress={do}
                                folders={item.noOfFolders}
                                handleDelete={() => handleDelete(item)}
                                // handleDelete={() => handleDelete(item)}
                                handleCard={() => {
                                  if (!checkPDF(item.name)) {
                                    handleCard(item, index);
                                  } else {
                                    setSelectedPdfUrl(item);

                                    sessionStorage.setItem(
                                      "selectedPdfUrl",
                                      JSON.stringify(item)
                                    );
                                    // setMergedDataForPDFViewer(mergedData);
                                    // handleCard(item, index);
                                    setMergedDataForPDFViewer(
                                      filteredMergedData
                                    );
                                    const filteredIndex =
                                      filteredMergedData.indexOf(item);
                                    sessionStorage.setItem(
                                      "selectedPdfIndex",
                                      filteredIndex
                                    );

                                    handleCard(item, index, filteredIndex);
                                  }
                                }}
                                handleDownload={() =>
                                  handleDownload(item, updatedData)
                                }
                                backgroundColor={
                                  !item.url && selectedCardIndex === index
                                    ? "selected-color"
                                    : "default-color"
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="">
                        {loading ? (
                          <div className="flex font-bold text-2xl justify-center">
                            <LoadingScreen loading={loading} />
                          </div>
                        ) : (
                          <div className="flex justify-center  ms-0 mt-28">
                            <NoData />
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SubDirectoriesProject;
