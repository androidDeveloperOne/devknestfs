import { useDispatch, useSelector } from "react-redux";
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  Link,
  Outlet,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  clearProjectYearwiseData,
  IsSearchProjectlist,
  projectFilesCount,
  projectYearwise,
} from "../../../Redux/slices/YearWiseProject";

import ResaubleProjectCard from "../../../Resuable/ResaubleProjectCard";
import {
  clearfiletrPDFWiseData,
  clearprojectMainDirectriesData,
  filetrPDFWiseData,
  // folderCountData,
  projectMainDirectriesData,
} from "../../../Redux/slices/ProjectMainDirectories";
import {
  addName,
  clearAllParameters,
  clearParameters,
} from "../../../Redux/slices/StepperSlice";
import AWS from "aws-sdk";
// import { deleteObject } from "aws-sdk/lib/s3";
import Upload from "../Upload";
import LoadingCard from "../../../Resuable/ReUsableSkeletonLoader";

import { downloadDirectoreis } from "../../../Redux/slices/DownloadSlice";

import { clearSearchQuery } from "../../../Redux/slices/SearchQerySlice";

import CreateFolder from "../../../Resuable/CreateFolder";
import DownloadToast from "../../../Resuable/DownloadToast";
import LoadingScreen from "../../../Resuable/LoadingScreen";
import StepperHorizontal from "../../stepper";
import Home from "../ActivityIndicator/Home";
import NoData from "../../../Resuable/NoData";
import { deleteFolderData } from "../../../Redux/slices/FolderDeleteSlice";
import CustomAlert from "../../../Resuable/ReusableAlertBox";
import LoaderCDUD from "../../../Resuable/LoaderCDUD";
import { clearFolderStatus } from "../../../Redux/slices/createFolderSlice";
import { fetchActivites } from "../../../Redux/slices/ActivityCheck";
import { clearfilterPDFWiseData } from "../../../Redux/slices/FileSearchSlice";
import FreezeSlice, {
  freezeFolder,
  unfreezeFolder,
} from "../../../Redux/slices/FreezeSlice";

const YearWiseProjectDetails = React.memo(() => {
  const { year } = useParams();
  console.log("i am rendering", year);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState("");
  // const [deletedLoding, setDeletedLoding] = useState(false);

  // console.log("deletedLoding", deletedLoding);

  const [createFolderLoading, setCreateFolderLoading] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [progressBaractive, setProgressbarActive] = useState(false);
  const [isModalShown, setIsModalShown] = useState(false);
  const [isUploadModalShown, setIsUploadModalShown] = useState(false);
  console.log("isUploadModalShown", isUploadModalShown);
  const [deleteData, setDeleteData] = useState([]);
  const [freezeAlertVisible, setFreezeAlertVisible] = useState(false);
  const [freezeServerErrAlert, setFreezeServerErrAlert] = useState(false);
  const [freezeSuccessAlert, setFreezeSuccessAlert] = useState(false);
  const [unFreezeSuccessAlert, setUnFreezeSuccessAlert] = useState(false);
  const [freezeData, setFreezeData] = useState([]);
  const [unfreezeAlertVisible, setUnFreezeAlertVisible] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("select");
  const [unFreezeData, setUnFreezeData] = useState([]);
  const [showDownloadConfirmation, setShowDownloadConfirmation] =
    useState(false);
  const [downloadItemData, setDownloadItemData] = useState(null);
  const [isScroll, setIsScroll] = useState(false);
  const {
    projectYearWiseData,
    loading,
    error,
    projectfiles,
    hasMore,
    PageSize,
    pageNo,
    searchProject,
  } = useSelector((state) => state?.yearWiseProject);
  console.log("hasMore", hasMore);
  console.log("pageNo", pageNo);
  console.log("projectYearWiseData", projectYearWiseData);
  console.log("uploadStatus", uploadStatus);
  console.log("loading", loading);

  let stepData = useSelector((state) => state?.stepperData);
  const [createFolderData, setCreateFolderData] = useState(false);
  const { searchQuery } = useSelector((state) => state?.searchData);
  const progress = useSelector((state) => state.downloadData.downloadProgress);
  const { userType } = useSelector((state) => state?.auth?.userdata);
  const {
    freezeLoading,
    serverErr,
    unFreezeLoading,
    folderfreezed,
    folderUnFreezed,
  } = useSelector((state) => state?.freezeFolder);

  const { deleteFolderName, deleteloading, deleteFolderItem } = useSelector(
    (state) => state?.deleteFolder
  );
  const { createLoading, folderCreateStatus } = useSelector(
    (state) => state?.createFolderData
  );

  console.log("folderCreateStatus", folderCreateStatus);
  console.log("deleteFolderItem", deleteFolderItem);
  const location = useLocation();

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

  useEffect(() => {
    sessionStorage.removeItem("pdfdata");
    dispatch(clearprojectMainDirectriesData());
    dispatch(projectYearwise({ year: year, pageNo: 1, PageSize: 30 }));
    dispatch(IsSearchProjectlist(year));
    dispatch(projectFilesCount({ year: year }));
    console.log("i am dispach at  not catch");
    dispatch(fetchActivites({ data: resultSegments }));
    sessionStorage.removeItem("selectedPdfUrl");

    dispatch(clearParameters("2"));
    // dispatch(clearParameters("2"));
    // dispatch(clearParameters("3"));

    dispatch(clearSearchQuery());
    localStorage.removeItem("selectedCardIndex2");
    setActiveStep(year);

    const storedIndex = localStorage.getItem("selectedCardIndex1");
    if (storedIndex !== null) {
      setSelectedCardIndex(parseInt(storedIndex, 10));
    }

    dispatch(clearfilterPDFWiseData());
  }, [dispatch, year]);

  const handleCard = (year, project, index) => {
    navigate(`/${year}/${project}`);
    localStorage.setItem("selectedCardIndex1", index);
    localStorage.setItem("project", project);
    dispatch(
      addName({
        key: "1",
        value: `${year}/${project}`,
        parameter: project,
        project: project,
      })
    );
  };
  var searchProjectList =
    searchQuery.length > 0 ? searchProject : projectYearWiseData;

  console.log("searchProjectList", searchProjectList);

  const mergeProjectData = (yearWiseData, filesData) => {
    return yearWiseData.map((item) => {
      const fileData = filesData.find(
        (file) => file.projectName === item.project
      );

      if (fileData) {
        return {
          ...item,
          count: fileData.count,
        };
      } else {
        return item;
      }
    });
  };

  const projectWithCount = mergeProjectData(searchProjectList, projectfiles);

  console.log("projectWithCount", projectfiles);

  const filterYearWiseData = useMemo(() => {
    return projectWithCount?.filter(
      (item) =>
        item?.project.toLowerCase().includes(searchQuery.toLowerCase()) &&
        item.project !== deleteFolderName
    );
  }, [projectWithCount, searchQuery, deleteFolderName]);

  console.log("filterYearWiseData", projectYearWiseData);

  const handleDelete = (year, project) => {
    // let deletePath = { year: year, project: project };
    setCustomAlertVisible(true);
    setDeleteData(project);
  };

  const handleOkDelete = () => {
    dispatch(
      deleteFolderData({ data: resultSegments, currentName: deleteData })
    );
    // setDeletedLoding(true);
  };
  useEffect(() => {
    if (deleteloading === false) {
      setDeleteData([]);
    }
    if (deleteFolderItem || uploadStatus == "done" || folderCreateStatus) {
      console.log("Dispatching projectYearwise with deleteCache true");

      // dispatch(clearProjectYearwiseData());

      dispatch(
        projectYearwise({
          year: year,
          pageNo: 1,
          PageSize: 30,
          deleteCache: true,
        })
      );
      dispatch(fetchActivites({ data: resultSegments }))
        .then(() => {
          console.log("Dispatch successful");
        })
        .catch((error) => {
          console.error("Dispatch failed:", error);
        });

      // setDeletedLoding(false);
      // setCreateFolderLoading(false);
    }
  }, [deleteFolderItem, uploadStatus, dispatch, folderCreateStatus]);

  const handleDownload = (year, project) => {
    setDownloadItemData(project);
    setShowDownloadConfirmation(true);
  };

  const handleOkDownload = () => {
    setProgressbarActive(true);

    dispatch(
      downloadDirectoreis({
        data: resultSegments,
        currentName: downloadItemData,
      })
    ).then(() => {
      setDownloadItemData(null);
    });
    setShowDownloadConfirmation(false);
  };

  const handleCreatFolder = (isopen) => {
    setIsModalShown(isopen);
    // setCreateFolderLoading(true)
  };

  const handleCloseModal = (closeModal) => {
    setIsModalShown(closeModal);
    if (folderCreateStatus) {
      // dispatch(projectYearwise(year));
      dispatch(clearFolderStatus());
    }
  };
  const { downloadloading } = useSelector((state) => state?.downloadData);

  console.log("filterYearWiseData", filterYearWiseData);

  const handleOpenUpload = (isopen) => {
    setIsUploadModalShown(isopen);
    localStorage.removeItem("uploadMessage");
  };

  const handleCloseUpload = (isClose) => {
    setIsUploadModalShown(isClose);
    // const uploadMessage = localStorage.getItem("uploadMessage");
    // if (uploadMessage === "Upload complete!") {
    //   dispatch(projectYearwise({year:year ,pageNo:1,PageSize:30, }));
    //   dispatch(fetchActivites());
    // }
  };

  const handleFreeze = (year, project) => {
    let data = { year: year, project: project };
    setFreezeAlertVisible(true);
    setFreezeData(data);
  };

  const handleOKFreeze = async () => {
    const resultAction = await dispatch(freezeFolder(freezeData));
    if (freezeFolder.fulfilled.match(resultAction)) {
      dispatch(
        projectYearwise({ year: freezeData?.year, pageNo: 1, PageSize: 30 })
      );
      setFreezeSuccessAlert(true);
    }
    if (freezeFolder.rejected.match(resultAction)) {
      setFreezeServerErrAlert(true);
      setFreezeData([]);
    }
  };

  const handleUnFreeze = (year, project) => {
    let data = { year: year, project: project };
    setUnFreezeAlertVisible(true);
    setUnFreezeData(data);
  };
  console.log("data----->", global.FreezedFolder);
  const handleOKUnFreeze = async () => {
    const resultAction = await dispatch(unfreezeFolder(unFreezeData));
    if (unfreezeFolder.fulfilled.match(resultAction)) {
      dispatch(
        projectYearwise({ year: unFreezeData?.year, pageNo: 1, PageSize: 30 })
      );
      setUnFreezeSuccessAlert(true);
    }
    if (unfreezeFolder.rejected.match(resultAction)) {
      setFreezeServerErrAlert(true);
      setUnFreezeData([]);
    }
  };

  const handleUploadStatusChange = (status) => {
    setUploadStatus(status);
  };
  const handleFolderCreateStatus = (status) => {
    // setCreateFolderLoading(status);
  };
  const loadMoreData = () => {
    if (!loading && hasMore) {
      dispatch(
        projectYearwise({
          year: year,
          pageNo: pageNo,
          pageSize: 30,
        })
      );
    }
  };
  const handleScroll = useCallback(
    (event) => {
      const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

      console.log("scrollTop", scrollTop);

      if (scrollTop >= 1) {
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

      <div className="ms-12 p-0 lg:ms-16 2xl:ms-10 xl:-ms-4">
        <DownloadToast downloadloading={downloadloading} />
        {deleteloading && (
          <LoaderCDUD loading={deleteloading} message={"Deleting..."} />
        )}
        {/* /////////////////////////////////FreezeAlert///////////////////////////// */}
        <CustomAlert
          visible={freezeAlertVisible}
          setVisible={(isVisible) => setFreezeAlertVisible(isVisible)}
          heading={`Are you sure you want to freeze this Project ?`}
          title={"OK"}
          showOk={true}
          title2={"Cancel"}
          action={handleOKFreeze}
          showNo={true}
          onclickClose={() => {
            setFreezeAlertVisible(false);
            setFreezeData([]);
          }}
        />
        {freezeLoading && <LoadingScreen loading={freezeLoading} />}
        {unFreezeLoading && <LoadingScreen loading={unFreezeLoading} />}
        {serverErr ? (
          <CustomAlert
            visible={freezeServerErrAlert}
            setVisible={(isVisible) => setFreezeServerErrAlert(isVisible)}
            heading={serverErr}
            title={"OK"}
            showOk={true}
            action={() => {
              setFreezeServerErrAlert(false);
              setFreezeData([]);
            }}
          />
        ) : null}
        {/* ////////////////////successAlert///////////// */}
        <CustomAlert
          visible={freezeSuccessAlert}
          setVisible={(isVisible) => setFreezeSuccessAlert(isVisible)}
          heading={folderfreezed}
          title={"OK"}
          showOk={true}
          action={() => {
            setFreezeSuccessAlert(false);
            setFreezeData([]);
          }}
        />

        {/* /////////////////////////////////FreezeAlert///////////////////////////// */}

        {/* /////////////////////////////////UnFreezeAlert///////////////////////////// */}
        <CustomAlert
          visible={unfreezeAlertVisible}
          setVisible={(isVisible) => setUnFreezeAlertVisible(isVisible)}
          heading={`Are you sure you want to unfreeze this Project ?`}
          title={"OK"}
          showOk={true}
          title2={"Cancel"}
          action={handleOKUnFreeze}
          showNo={true}
          onclickClose={() => {
            setUnFreezeAlertVisible(false);
            setUnFreezeData([]);
          }}
        />
        <CustomAlert
          visible={unFreezeSuccessAlert}
          setVisible={(isVisible) => setUnFreezeSuccessAlert(isVisible)}
          heading={folderUnFreezed}
          title={"OK"}
          showOk={true}
          action={() => {
            setUnFreezeSuccessAlert(false);
            setUnFreezeData([]);
          }}
        />
        {/*/////////////////////////////////UnFreezeAlert///////////////////////////// */}

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

        {(userType === "Admin" || userType === "Operational Admin") && (
          <div className="fixed z-1 ">
            <Upload
              folderData={{ key: "1", year: year }}
              uploadPath={isUploadModalShown ? resultPathname : null}
              closeModal={handleCloseUpload}
              openModal={handleOpenUpload}
              onUploadStatusChange={handleUploadStatusChange}
            />
          </div>
        )}
        {(userType === "Admin" || userType === "Operational Admin") && (
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
        {createLoading && (
          <LoaderCDUD loading={createLoading} message={"Creating..."} />
        )}

        <div className="grid  mt-16  ">
          <div className="col-span-3 2xl:col-span-2 hidden md:block my-2  ">
            <Home moduleNameToFilter={{ data: { year: year } }} />
          </div>
          <div
            onScroll={handleScroll}
            style={{ height: "98vh", 
              overflowY: "scroll" ,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none"
              }
            
            }}
            className="scroll-container  col-span-9 2xl:col-span-10"
          >
            <div
              className={`col-span-full p-2  hidden md:block ${
                (isUploadModalShown || isModalShown) === true
                  ? " fixed -z-1 "
                  : "fixed z-1"
              }`}
            >
              <StepperHorizontal
                stepData={stepData}
                activeStep={activeStep}
                isScrolled={isScroll}
              />
            </div>
            {filterYearWiseData && filterYearWiseData.length <= 0 ? (
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
              <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-2   lg:grid-cols-4 xl:grid-cols-6  gap-1 mt-12">
                {filterYearWiseData?.map((item, index) => {
                  return (
                    <div className="p-2" key={index}>
                      {loading ? (
                        <LoadingCard gridLoader={true} />
                      ) : (
                        <ResaubleProjectCard
                          projectName={item.project}
                          showFolderIcon={true}
                          showDeleteIcon={true}
                          showDownloadIcon={true}
                          showUnFreezeIcon={year !== global.FreezedFolder}
                          showFreezeIcon={year === global.FreezedFolder}
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
                          backgroundColor={
                            selectedCardIndex === index
                              ? "selected-color"
                              : "default-color"
                          }
                          folders={item.noofMainDirectories}
                          filesCount={item.count}
                          handleCard={() =>
                            handleCard(item.year, item.project, index)
                          }
                          handleDelete={() =>
                            handleDelete(item.year, item.project)
                          }
                          handleDownload={() =>
                            handleDownload(item.year, item.project)
                          }
                          handleFreeze={() =>
                            handleFreeze(item?.year, item?.project)
                          }
                          handleUnFreeze={() =>
                            handleUnFreeze(item?.year, item?.project)
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

export default YearWiseProjectDetails;
