import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Link,
  Outlet,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ResaubleProjectCard from "../../../Resuable/ResaubleProjectCard";
import { clearSubDirectiresData } from "../../../Redux/slices/SubDirectriesSlice";
import {
  clearprojectMainDirectriesData,
  folderCountData,
  projectMainDirectriesData,
} from "../../../Redux/slices/ProjectMainDirectories";
// import {
//   addName,
//   clearAllParameters,
//   clearParameters,
// } from "../../../Redux/slices/StepperSlice";
import Upload from "../Upload";
import SinglePdfViewer from "../../../Resuable/SinglePdfViewer";
import LoadingCard from "../../../Resuable/ReUsableSkeletonLoader";

import { downloadDirectoreis } from "../../../Redux/slices/DownloadSlice";

import { clearSearchQuery } from "../../../Redux/slices/SearchQerySlice";
import CreateFolder from "../../../Resuable/CreateFolder";

import DownloadToast from "../../../Resuable/DownloadToast";
import LoadingScreen from "../../../Resuable/LoadingScreen";
import StepperHorizontal from "../../stepper";
import Home from "../ActivityIndicator/Home";
import NoData from "../../../Resuable/NoData";
import {
  clearDeleteFolder,
  deleteFolderData,
} from "../../../Redux/slices/FolderDeleteSlice";
import CustomAlert from "../../../Resuable/ReusableAlertBox";
import LoaderCDUD from "../../../Resuable/LoaderCDUD";
import { clearFolderStatus } from "../../../Redux/slices/createFolderSlice";
import { fetchActivites } from "../../../Redux/slices/ActivityCheck";
import {
  clearfilterPDFWiseData,
  filetrPDFWiseData,
} from "../../../Redux/slices/FileSearchSlice";
import { clearProjectYearwiseData } from "../../../Redux/slices/YearWiseProject";
import { deleteFileData } from "../../../Redux/slices/FileDeleteSlice";
import { uploadProjectData } from "../../../Redux/slices/UploadDataSlice";

const ProjectMainDirectories = () => {
  const { year, project } = useParams();
  console.log("year", year);

  const [activeStep, setActiveStep] = useState("");
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);

  console.log("selectedPdfUrl", selectedPdfUrl);

  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [deleteData, setDeleteData] = useState([]);
  const [deleteFilePath, setDeleteFilePath] = useState([]);
  const [deletedLoding, setDeletedLoding] = useState(false);
  const [createFolderLoading, setCreateFolderLoading] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  console.log("deleteData", deleteData);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [isModalShown, setIsModalShown] = useState(false);
  const [isUploadModalShown, setIsUploadModalShown] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("select");
  const [showDownloadConfirmation, setShowDownloadConfirmation] =
    useState(false);
  const [downloadItemData, setDownloadItemData] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const locationPathName = location.pathname;

  const pathnameSegments = locationPathName.split("/");
  const { createLoading, folderCreateStatus } = useSelector(
    (state) => state?.createFolderData
  );
  console.log("uploadStatus", uploadStatus);

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

  const {
    projectMainData,
    folderCount,
    loading,
    floading,
    hasMore,
    PageSize,
    pageNo,
  } = useSelector((state) => state?.projectMain);
  console.log("hasMore", hasMore);
  console.log("loadingmain", loading);
  console.log("projectMainData", projectMainData);
  const mainDirectoriesData = useSelector((state) => state?.searchData);

  const { searchQuery } = mainDirectoriesData;
  const { deleteFileloading, errorDeleteFile, deleteItemFile } = useSelector(
    (state) => state?.delteFile
  );
  const { userType } = useSelector((state) => state?.auth?.userdata);
  const { filterPDF, floadingFilter } = useSelector(
    (state) => state?.filterFile
  );

  console.log("filterPDF", filterPDF);

  let stepData = useSelector((state) => state?.stepperData);

  const { deleteloading, errorDeleteFolder, deleteFolderItem } = useSelector(
    (state) => state?.deleteFolder
  );

  console.log("deleteloading", deleteFolderItem);

  const debounceDelay = 500;
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    // dispatch(clearprojectMainDirectriesData());
    dispatch(
      projectMainDirectriesData({
        year: year,
        project: project,
      })
    );
    dispatch(clearProjectYearwiseData());
    dispatch(clearDeleteFolder());
    dispatch(clearSearchQuery());
    dispatch(clearSubDirectiresData());
    localStorage.removeItem("selectedCardIndex3");
    const storedIndex = localStorage.getItem("selectedCardIndex2");
    if (storedIndex !== null) {
      setSelectedCardIndex(parseInt(storedIndex, 10));
    }
    dispatch(fetchActivites({ data: resultSegments }));
  }, [year, project]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      dispatch(clearfilterPDFWiseData());
    }

    if (searchQuery.length > 0) {
      debounceTimerRef.current = setTimeout(() => {
        dispatch(
          filetrPDFWiseData({
            data: { year: year, project: project, searchQuery: searchQuery },
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
    if (deleteloading === false) {
      setDeleteData([]);
      setDeleteFilePath([]);
    }
    if (
      deleteFolderItem ||
      deleteItemFile ||
      uploadStatus == "done" ||
      folderCreateStatus
    ) {
      // dispatch(clearprojectMainDirectriesData());
      dispatch(
        projectMainDirectriesData({
          year: year,
          project: project,
          deleteCache: true,
        })
      );

      dispatch(fetchActivites({ data: resultSegments }));
    }
  }, [
    deleteFolderItem,
    deleteItemFile,
    dispatch,
    uploadStatus,
    folderCreateStatus,
  ]);

  const checkPDF = (item) => {
    if (
      item.url &&
      (item.name.toLowerCase().includes(".pdf") ||
        item.name.toLowerCase().includes(".PDF"))
    ) {
      return true;
    } else if (Array.isArray(item.files)) {
      return item.files.some(
        (file) =>
          file.name.toLowerCase().includes(".pdf") ||
          file.name.toLowerCase().includes(".PDF")
      );
    } else if (item.files) {
      return (
        item.files.name.toLowerCase().includes(".pdf") ||
        item.files.name.toLowerCase().includes(".PDF")
      );
    } else {
      return false;
    }
  };

  const handleProjectCard = (item, index) => {
    localStorage.setItem("selectedCardIndex2", index);
    console.log("itematmain", item);

    if (item.noOfDirectories && !isNaN(item.noOfDirectories)) {
      if (!searchQuery) {
        navigate(`/${item.year}/${item.project}/${item.drawingType}`);
      }
    } else {
      if (checkPDF(item)) {
        if (item.files) {
          const [filesArray] = item.files;
          console.log("item after handleClick", filesArray);
          setSelectedPdfUrl(filesArray);
        } else {
          setSelectedPdfUrl(item);
        }
      }
    }
  };
  const filterMainDirectoriesData = useMemo(() => {
    return filterPDF?.filter((item) =>
      item.name
        .replace(/\s/g, "")
        .toLowerCase()
        .includes(searchQuery.replace(/\s/g, "").toLowerCase().trim())
    );
  }, [filterPDF, searchQuery]);

  const dataToRender = searchQuery
    ? filterMainDirectoriesData
    : projectMainData;
  console.log("dataToRender", dataToRender);

  const handleClosePdfViewer = () => {
    setSelectedPdfUrl(null);
    dispatch(clearSearchQuery());
  };

  const handleDownload = (item) => {
    setDownloadItemData(item);
    setShowDownloadConfirmation(true);
  };
  const handleOkDownload = () => {
    dispatch(
      downloadDirectoreis({
        data: resultSegments,
        currentName: downloadItemData?.drawingType,
      })
    ).then(() => {
      setDownloadItemData(null);
    });
    setShowDownloadConfirmation(false);
  };

  const handleCreatFolder = (isopen) => {
    setIsModalShown(isopen);
  };

  const handleCloseModal = (closeModal) => {
    setIsModalShown(closeModal);
    // if (folderCreateStatus) {
    //   dispatch(folderCountData({ year: year, project: project }));
    //   dispatch(projectMainDirectriesData({ year: year, project: project }));
    //   dispatch(clearFolderStatus());
    // }
  };

  const handleDelete = (year, project, drawingType, item) => {
    // const [fileName] = item?.files;
    // console.log("item after handleClick", item);

    if (item.noOfDirectories && !isNaN(item.noOfDirectories)) {
      setDeleteData(item.drawingType);
    } else {
      if (checkPDF(item)) {
        if (item.files && item.files.length > 0) {
          const [filesArray] = item.files;
          console.log("item after handleClick", filesArray);
          setDeleteFilePath(filesArray.name);
        } else {
          setDeleteData(item.name);
        }
      }
    }

    console.log("deleteitem", item);
    setCustomAlertVisible(true);
  };

  const handleOkDelete = () => {
    if (deleteData && deleteData.length > 0) {
      dispatch(
        deleteFolderData({ data: resultSegments, currentName: deleteData })
      );
    }

    // setDeletedLoding(true);

    if (deleteFilePath && deleteFilePath.length > 0) {
      dispatch(
        deleteFileData({ data: resultSegments, currentName: deleteFilePath })
      );
      // setDeletedLoding(true);
    }
  };
  const { downloadloading } = useSelector((state) => state?.downloadData);

  const handleOpenUpload = (isopen) => {
    setIsUploadModalShown(isopen);
    localStorage.removeItem("uploadMessage");
  };

  const handleCloseUpload = (isClose) => {
    setIsUploadModalShown(isClose);
    // const uploadMessage = localStorage.getItem("uploadMessage");
    // if (uploadMessage === "Upload complete!") {
    //   dispatch(folderCountData({ year: year, project: project }));
    //   dispatch(projectMainDirectriesData({ year: year, project: project }));
    //   dispatch(fetchActivites());
    // }
  };

  const handleStepperClick = (data) => {
    setSelectedPdfUrl(data);
    // if (!selectedPdfUrl) {
    dispatch(clearSearchQuery());
    // }
  };

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo(0, 0);
    };

    if (selectedPdfUrl) {
      handleScrollToTop();
    }
  }, [selectedPdfUrl]);
  const handleUploadStatusChange = (status) => {
    setUploadStatus(status);
  };
  const handleFolderCreateStatus = (status) => {
    setCreateFolderLoading(status);
  };

  const loadMoreData = () => {
    if (!loading && hasMore) {
      dispatch(
        projectMainDirectriesData({
          year: year,
          project: project,
          pageSize: PageSize,
          pageNo: pageNo,
        })
      );
    }
  };
  const handleScroll = useCallback(
    (event) => {
      const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
      var isScroll = scrollHeight - scrollTop <= clientHeight * 1.5;

      if (scrollTop >= 0) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        loadMoreData();
      }
    },

    [loadMoreData]
  );

  const handleFolderContent = (zipContent) => {
    console.log("Received zipContent:", zipContent);

    dispatch(
      uploadProjectData({
        data: resultSegments,
        file: zipContent,
        replaceFiles: false,
      })
    );
  };

  return (
    <>
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

      <div className="">
        <DownloadToast downloadloading={downloadloading} />
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
          }}
        />
        {!selectedPdfUrl &&
          (userType === "Admin" || userType === "Operational Admin") && (
            <div className="fixed z-1">
              <Upload
                folderData={{ key: "2", year: year, project: project }}
                closeModal={handleCloseUpload}
                openModal={handleOpenUpload}
                uploadPath={isUploadModalShown ? resultPathname : null}
                onUploadStatusChange={handleUploadStatusChange}
                folderContent={handleFolderContent}
              />
            </div>
          )}

        {!selectedPdfUrl &&
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

        <div
          className={`grid  ${selectedPdfUrl ? "px-0 mt-16  " : "mt-16  px-3"}`}
        >
          <div
            className={`2xl:col-span-2  ${
              selectedPdfUrl ? "hidden " : " hidden md:block col-span-3 my-2   "
            }`}
          >
            <Home
              moduleNameToFilter={{ data: { year: year, project: project } }}
            />
          </div>

          <div
            onScroll={handleScroll}
            style={{
              height: "92vh",
              overflowY: "scroll",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
            className={` scroll-container  2xl:col-span-10 2xl:col-span-${
              selectedPdfUrl ? "12" : "9"
            } col-span-${selectedPdfUrl ? "12" : "9"}`}
          >
            {/*             
            { !selectedPdfUrl && ( */}
            <div
              className={` col-span-full p-2   hidden md:block ${
                (isUploadModalShown || isModalShown) === true
                  ? " fixed -z-1  "
                  : "fixed z-1  "
              }`}
            >
              <StepperHorizontal
                stepData={stepData}
                activeStep={activeStep}
                start={`${selectedPdfUrl ? "start-0  " : ""}`}
                stepperClick={handleStepperClick}
                isScrolled={isScroll}
              />
            </div>

            {selectedPdfUrl ? (
              <>
                {loading ? (
                  <LoadingCard gridLoader={true} />
                ) : (
                  <div className="mt-20 ">
                    <SinglePdfViewer
                      onClose={handleClosePdfViewer}
                      pdfUrl={selectedPdfUrl}
                      isSearch={true}
                    />
                  </div>
                )}
              </>
            ) : dataToRender && dataToRender.length > 0 ? (
              <div className="    grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 ms-12 p-0 lg:ms-16 2xl:ms-10 xl:-ms-4  mt-20 lg:grid-cols-4 xl:grid-cols-6  mb-3">
                {dataToRender?.map((item, index) => {
                  return (
                    <div className="" key={index}>
                      {loading ? (
                        <LoadingCard gridLoader={true} />
                      ) : (
                        <ResaubleProjectCard
                          projectName={
                            item?.files && Array.isArray(item.files)
                              ? item?.files
                                  .map((file, index) => file.name)
                                  .join(" ,")
                              : searchQuery
                              ? item.name
                              : item.drawingType
                          }
                          lastModified={
                            new Date(item.lastModifiedDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            ) +
                            " " +
                            new Date(item.lastModifiedDate).toLocaleTimeString(
                              "en-US",
                              {
                                hour12: true,
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          }
                          drawing={item.noOfDrawings}
                          showFolderIcon={
                            !searchQuery &&
                            (!item.files || !Array.isArray(item.files))
                          }
                          showPdfIcon={
                            searchQuery ||
                            (item.files && Array.isArray(item.files))
                          }
                          folders={item.noOfDirectories}
                          showDeleteIcon={!searchQuery}
                          handleCard={() => handleProjectCard(item, index)}
                          showDownloadIcon={
                            item.noOfDirectories &&
                            !Array.isArray(item.noOfDirectories)
                              ? item.noOfDirectories
                              : null
                          }
                          backgroundColor={
                            selectedCardIndex === index
                              ? "selected-color"
                              : "default-color"
                          }
                          handleDownload={() => handleDownload(item)}
                          handleDelete={() =>
                            handleDelete(
                              item.year,
                              item.project,
                              item.drawingType,
                              item
                            )
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="">
                <div className="">
                  {loading || floadingFilter ? (
                    <div className="flex font-bold text-2xl justify-center">
                      <LoadingScreen loading={loading || floadingFilter} />
                    </div>
                  ) : (
                    <div className="flex justify-center ms-0 mt-28">
                      <NoData />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ProjectMainDirectories);
