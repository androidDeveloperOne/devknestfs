import React, { useCallback, useEffect, useRef, useState } from "react";
import AWS from "aws-sdk";
import {
  // accessKeyId,
  // secretAccessKey,
  region,
  bucketName,
} from "../../../constants";
import PropTypes from "prop-types";
import ResuableIcons from "../../../Resuable/ResuableIcons";
import { useDispatch } from "react-redux";
import { uploadActivites } from "../../../Redux/slices/ActivityCreate";
import { useLocation } from "react-router-dom";
import CustomAlert from "../../../Resuable/ReusableAlertBox";
import { useDropzone } from "react-dropzone";
import { clearProjectYearwiseData } from "../../../Redux/slices/YearWiseProject";
import { clearprojectMainDirectriesData } from "../../../Redux/slices/ProjectMainDirectories";
const Upload = ({
  folderData,
  title,
  updatedData,
  openModal,
  closeModal,
  uploadPath,
  onUploadStatusChange,
}) => {
  const folderInputRef = useRef(); // Use a different ref for the folder input
  const fileInputRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState(null);

  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showModal, setShowModal] = useState(false);

  const [uploadStatus, setUploadStatus] = useState("select");

  console.log("uploadStatus", uploadStatus);
  const [folderName, setFolderName] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploadType, setUploadType] = useState(null);
  const [folderExists, setFolderExists] = useState(false);

  console.log("folderExists", folderExists);
  console.log("folderExists", folderExists);
  const [fileExists, setFileExists] = useState(false);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [existingFileName, setExistingFileName] = useState([]);
  const [nonexistFolder, setNonexistFolder] = useState([]);
  console.log("existingFileName", existingFileName);

  console.log("uploadType", uploadType);
  const [isReplace, setIsReplace] = useState(false);
  const [titleType, setTitleType] = useState("Uploaded");
  const [uniqueFolders, setUniqueFolders] = useState([]);
  console.log("uniqueFolders", uniqueFolders);
  const [droppedFolder, setDroppedFolder] = useState([]);
  const location = useLocation();
  const locationPathName = location.pathname;
  const pathnameSegments = locationPathName.split("/");

  function replaceSpaces(segment) {
    return segment.replace(/%20/g, " ");
  }
  const resultSegments = pathnameSegments.map(replaceSpaces).filter(Boolean);
  useEffect(() => {
    AWS.config.update({
      // accessKeyId,
      // secretAccessKey,
      region,
    });

    if (isReplace) {
      setCustomAlertVisible(false);
    }
    const checkFolderAndFileExistence = async () => {
      if (folderName && folderName.length > 0) {
        await checkFolderExists({ folder: folderName });
      }

      if (fileName.length > 0) {
        await checkFolderExists({ file: fileName });
      }

      if (uniqueFolders.length > 0) {
        await checkFolderExists({ folder: uniqueFolders });
      }
    };
    checkFolderAndFileExistence();
  }, [folderName, fileName, uniqueFolders]);

  let fileNameData;

  if (uploadType == "folder") {
    fileNameData = {
      folderName: folderName,
      existingFileName: existingFileName,
      nonExistingFolders: nonexistFolder,
    };
  } else {
    // fileNameData = fileName;

    fileNameData = {
      existingFileName: existingFileName,
      nonExistingFolders: nonexistFolder,
    };
  }
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
 

  useEffect(() => {
    if (uploadStatus === "done") {
      if (fileNameData?.nonExistingFolders?.length > 0) {
        dispatch(
          uploadActivites({
            data: resultSegments.join("/"),
            fileType: uploadType,
            fileName: fileNameData?.nonExistingFolders,
            title: `${uploadType === "folder" ? " Uploaded" : "Uploaded"}`,
          })
        );
      }

      if (fileNameData?.existingFileName?.length > 0) {
        dispatch(
          uploadActivites({
            data: resultSegments.join("/"),
            fileType: uploadType,
            fileName: fileNameData?.existingFileName,
            title: `${
              uploadType === "folder"
                ? "Drawings Added in below folder"
                : "Replaced"
            }`,
          })
        );
      }
      // if (condition) {

      // }
    }

    if (uploadStatus == "error") {
      alert("Network error occurred. Upload has stopped.");
    }
    if (onUploadStatusChange) {
      onUploadStatusChange(uploadStatus); // Notify parent of status change
      // dispatch(clearProjectYearwiseData());
      // dispatch(clearprojectMainDirectriesData());
    }
  }, [uploadStatus]);

  const clearFileInput = () => {
    folderInputRef.current.value = "";
    fileInputRef.current.value = "";
    setSelectedFiles(null);

    setUploadStatus("select");
  };

  const handleUpload = async () => {

    if (!selectedFiles || !uploadPath) return alert("No Path Found");

    const fileNames = selectedFiles.map((file) =>
      file.webkitRelativePath ? file.webkitRelativePath : file.name
    );

    console.log("filesNames", fileNames);

    if (uploadStatus === "done") {
      clearFileInput();
      return;
    }

    const s3 = new AWS.S3();
    const MAX_CONCURRENT_UPLOADS = 30;

    try {
      setUploadStatus("uploading");

      const uploadPromises = [];

      for (const file of selectedFiles) {
        // Use a closure to maintain the current file in the loop
        const uploadFile = async (file) => {
          let key;
          if (file.path) {
            key = `${uploadPath}${file.path}`;
          } else if (file.webkitRelativePath) {
            key = `${uploadPath}/${file.webkitRelativePath}`;
          } else {
            key = `${uploadPath}/${file.name}`;
          }

          // Set the chunk size (you can adjust this value)
          const chunkSize = 25 * 1024 * 1024; // 25MB
          const fileSize = file.size;
          const totalChunks = Math.ceil(fileSize / chunkSize);

          console.log("totalChunks", totalChunks);
          let start = 0;
          let end = Math.min(chunkSize, fileSize);

          for (let i = 0; i < totalChunks; i++) {
            const chunk = file.slice(start, end);

            const params = {
              Bucket: bucketName,
              Key: key,
              Body: chunk,
              ContentRange: `bytes ${start}-${end - 1}/${fileSize}`,
              ContentDisposition: "inline",
              ContentType: "application/pdf",
            };

            // Using the upload method

            try {
              // Using the upload method
              await s3.upload(params).promise();
            } catch (uploadError) {
              console.error("Error uploading chunk:", uploadError);
              if (uploadError.code === "NetworkingError") {
                alert(
                  "Network error occurred while uploading. Please check your internet connection and try again."
                );
              } else {
                alert("An error occurred while uploading. Please try again.");
              }
              throw uploadError; // Rethrow the error to stop the upload process
            }

            start = end;
            end = Math.min(start + chunkSize, fileSize);
          }
        };

        // Push the upload function into the array
        uploadPromises.push(uploadFile(file));

        // Manage concurrency
        if (uploadPromises.length >= MAX_CONCURRENT_UPLOADS) {
          await Promise.all(uploadPromises);
          uploadPromises.length = 0; // Clear the array for the next batch
        }
      }

      // Wait for any remaining uploads to finish
      await Promise.all(uploadPromises);

      if (uploadStatus !== "cancel") {
        setUploadStatus("done");
        localStorage.setItem("uploadMessage", "Upload complete!");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus("select");
    }
  };

  const onChooseFolder = () => {
    folderInputRef.current.value = "";
    folderInputRef.current.click();
    setUploadType("folder");
  };

  const onChooseFile = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
    setUploadType("file");
  };
  const handleFileUplaod = async (event) => {
    const files = Array.from(event.target.files);
    console.log("folderFile", files);
    setSelectedFiles(files);

    const pdfFiles = files.filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      return extension === "pdf";
    });

    if (pdfFiles.length > 0) {
      const fileNames = pdfFiles.map((item) => item.name);
      setFileName(fileNames);
      setFolderName(""); // Reset folderName state
    } else {
      const folderNames = files.map((file) => {
        const parts = file.webkitRelativePath.split("/");
        return parts[0];
      });
    }
  };

  const handleFolderUpload = (event) => {
    const files = Array.from(event.target.files);
    // console.log("files%%%%%%%",files);
    const slelctedFolder = files.length > 0 ? files : null;

    const filteredFiles = files.filter((file) => {
      const extenstion = file.name.split(".").pop();
      return (
        extenstion.toLowerCase() === "pdf" || extenstion.toLowerCase() === "dwg"
      );
    });
    console.log("slelctedFolder", slelctedFolder);
    console.log("filteredFiles", filteredFiles);
    setSelectedFiles(filteredFiles);

    const folderNames = files.map((file) => {
      const parts = file.webkitRelativePath.split("/");
      return parts[0];
    });

    console.log("folderNames", event);
    const uniqueFolderNames = [...new Set(folderNames)];

    console.log("folderNames", event);
    setFolderName(uniqueFolderNames);
  };

  const checkFolderExists = async (folder) => {
    let existingFiles = [];
    let existingFolders = [];
    let nonExistingFolders = [];
    let nonExistingFiles = [];

    try {
      let key1 = "";
      // let key2 = "";
      let fileExists = false;
      let folderExistF = false;

      console.log("folderExistF", folderExistF);
      // Flag to track if any file exists
      if (folder.file && folder.file.length > 0) {
        // Iterate through each file in the folder.file array
        for (const file of folder.file) {
          // Checking for file existence
          key1 = `${resultSegments.join("/")}/`;
          const fileKey = `${key1}${file}`;

          console.log("fileKey", fileKey);
          const params = {
            Bucket: bucketName,
            Key: fileKey,
          };
          const s3 = new AWS.S3();
          try {
            await s3.headObject(params).promise();
            // File exists for current file
            console.log("File exists:", fileKey);

            fileExists = true;
            setFileExists(fileExists);
            setCustomAlertVisible(true);
            existingFiles.push(file);
            // Set flag to true if any file exists
          } catch (error) {
            // File does not exist
            nonExistingFiles.push(file);
            console.error("File does not exist:", file);
            setNonexistFolder(nonExistingFiles);
          }
        }
        // Return true if any file exists
        if (fileExists) {
          console.log("existingFiles333", existingFiles);
          console.log("fileExist44", fileExists);
          setExistingFileName(existingFiles);
          // setFileExists(fileExists);
          return true;
        } else {
          setFileExists(false);
          // setNonexistFolder(nonExistingFolders);
          return false;
        }
      } else if (Array.isArray(folder.folder) && folder.folder.length > 0) {
        // Checking for folder existence

        console.log("folderee", folder.folder);
        // for (const folderName of folder.folder) {
        for (const folderName of folder.folder) {
          let key2 = `${resultSegments.join("/")}/`;
          const folderKey = `${key2}${folderName}/`;

          const params = {
            Bucket: bucketName,
            Prefix: folderKey,
          };
          const s3 = new AWS.S3();

          try {
            console.log("Folder does not exist:", folderName);
            // await s3.headObject(params).promise();
            const objects = await s3.listObjectsV2(params).promise();

            if (objects.Contents && objects.Contents.length > 0) {
              // Folder exists
              existingFolders.push(folderName);
              folderExistF = true;

              setExistingFileName(existingFolders);
              setFolderExists(folderExistF);
              setCustomAlertVisible(folderExistF);
            } else {
              nonExistingFolders.push(folderName);
              //               let allnonExistFolder = [folderName];

              // console.log("gggg", allnonExistFolder);

              setNonexistFolder(nonExistingFolders);
            }
          } catch (error) {}
        }

        // }
      } else {
        console.error("Neither file nor folder specified for existence check.");
        return false;
      }
    } catch (error) {
      if (error.code === "NotFound") {
        if (folder.file && folder.file.length > 0) {
          // File does not exist
          setFileExists(false);
        } else {
          // Folder does not exist
          setFolderExists(false);
        }
        return false;
      } else {
        console.error("Error checking folder/file existence:", error);
        setFileExists(false);
        setFolderExists(false);
        return false;
      }
    }
  };



  const handleOpenModal = () => {
    setShowModal(true);
    if (openModal) {
      openModal(true);
    }
  };
  const handleClose = () => {
    localStorage.removeItem("done");
    localStorage.removeItem("updatedData");
    localStorage.removeItem("folderData");
    setFolderExists(false);
    setSelectedFiles(null);
    if (selectedFiles !== null) {
      // window.location.reload();
    }
    setUploadStatus("select");
    // Close the modal
    setShowModal(false);
    setFileExists(false);
    setFolderExists(false);
    setFolderName([]);
    setUniqueFolders([]);
    setDroppedFolder([]);
    setExistingFileName([]);
    setNonexistFolder([]);
    setTitleType("Uploaded");
    setFileName(false);
    if (closeModal) {
      closeModal(false);
    }
  };

  const handleRepalce = () => {
    setIsReplace(true);

    setTitleType("Replaced");
  };

  const handleRepalceCancel = () => {
    if (existingFileName.length === 1) {
      setSelectedFiles(null);
    } else {
      const updatedSelectedFiles = selectedFiles.filter(
        (file) => !existingFileName.includes(file.name)
      );
      setSelectedFiles(updatedSelectedFiles);
    }

    //console.log("updatedSelectedFiles", updatedSelectedFiles);
    setFileName([]);
    setFolderName([]);
    setExistingFileName([]);
    setNonexistFolder([]);
    setFolderExists(false);
    setFileExists(false);
    setSelectedFiles(null);
    setCustomAlertVisible(false);
    setUniqueFolders(false);
  };

  const onDrop = useCallback((acceptedFiles) => {
    console.log("acceptedFiles", acceptedFiles);

    const hasDirectory = acceptedFiles.some(
      (file) => file.path && file.path.includes("/")
    );
    const uniqueFoldersList = extractUniqueFolders(acceptedFiles);

    setUploadType("folder");
    if (hasDirectory === true) {
      setSelectedFiles(acceptedFiles);
      setUniqueFolders(uniqueFoldersList);
    } else {
      setSelectedFiles("");
      setUniqueFolders("");
      alert("Drop folder only");
    }
    console.log("directories", hasDirectory);
  }, []);
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    noClick: false,
    onDrop,
    noDrag: false,
  });

  const extractUniqueFolders = (files) => {
    const folderNames = new Set();
    files.forEach((file) => {
      const folderName = file.path.split("/")[1];
      folderNames.add(folderName);
    });

    return Array.from(folderNames);
  };
  return (
    <div className="">
      {/* <button onClick={handleUpload}>Upload</button> */}
      <CustomAlert
        visible={customAlertVisible}
        setVisible={(isVisible) => setCustomAlertVisible(isVisible)}
        heading={`This ${
          uploadType === "folder" ? "folder" : "file"
        }  already exist you want ${
          uploadType === "folder" ? "add drawings in this" : "Replace"
        } ?`}
        title={"OK"}
        showOk={true}
        title2={"Cancel"}
        data={{
          existingFiles: existingFileName,
          nonexistFolder: nonexistFolder,
        }}
        uploadType={uploadType}
        // data1={uniqueFolders}
        action={handleRepalce}
        showNo={true}
        onclickClose={handleRepalceCancel}
      />
      {showModal ? (
        <form
          className="outline-0 border-none m-4 font-medium "
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="justify-center items-center  bg-slate-900 bg-opacity-50  flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative lg:w-5/12 lg:h-84 my-6 mx-auto lg:left-40 md:left-36">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-3 lg:ms-4 border-b border-none border-blueGray-200 rounded-t">
                  <h3 className="text-xl lg:text-2xl md:text-2xl font-semibold">
                    Upload {title}
                  </h3>
                </div>
                <div
                  className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer"
                  onClick={handleClose}
                >
                  <ResuableIcons icon={"IoMdClose"} size={25} color={"red"} />
                </div>
                <div className=" flex justify-evenly self-center  p-7 flex-auto  align-middle border-dashed border-blue-800 border-2 rounded-md cursor-pointer h-60 w-11/12">
                  {!selectedFiles && (
                    <div
                      className={`flex justify-center items-center ps-60   ${
                        folderData.key == "2" || folderData.key == "3"
                          ? "hidden"
                          : ""
                      }`}
                    >
                      <input
                        ref={folderInputRef}
                        type="file"
                        id="folders"
                        name="folders"
                        multiple=""
                        webkitdirectory=""
                        directory=""
                        className="hidden"
                        onChange={handleFolderUpload}
                      />
                      {!selectedFiles && (
                        <button
                          className="w-10/12 h-1/2 bg-gray-100 justify-center items-center flex flex-col"
                          onClick={onChooseFolder}
                        >
                          <span>
                            <ResuableIcons icon={"CloudUpload"} size={30} />
                          </span>
                          Upload Folder
                        </button>
                      )}
                    </div>
                  )}

                  {!selectedFiles && (
                    <div
                      className={` border flex justify-center items-center  ${
                        folderData.key == "1" || folderData.key == "2"
                          ? "hidden"
                          : ""
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="files"
                        name="files"
                        multiple
                        directory=""
                        className="hidden"
                        onChange={handleFileUplaod}
                      />

                      <button
                        className="w-10/12 h-1/2  justify-center items-center flex flex-col p-6 m-3"
                        onClick={onChooseFile}
                      >
                        <span>
                          <ResuableIcons icon={"MdUploadFile"} size={40} />
                        </span>
                        <p className="my-2">Upload File</p>
                      </button>
                    </div>
                  )}
                  {!selectedFiles && (
                    <div className="flex justify-center items-center md:ps-24 xl:ps-44">
                      <div
                        {...getRootProps({
                          className: ` dropzoneStyle   ${
                            folderData.key == "1" ? "hidden" : ""
                          }`,
                        })}
                      >
                        <input {...getInputProps({ webkitdirectory: true })} />
                        <div className="text-center">
                          <div className="ps-20">
                            <ResuableIcons
                              icon={"MdDriveFolderUpload"}
                              size={45}
                            />
                          </div>
                          <p className="my-2">Drag & Drop your folders</p>
                        </div>

                        {uniqueFolders.length > 0 && (
                          <p>Folder Names: {uniqueFolders.join(", ")}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {uploadStatus === "select" && (
                    <div className="flex">
                      {selectedFiles &&
                        uploadStatus !== "uploading" &&
                        uploadStatus !== "done" && (
                          <div className="">
                            <p className="text-center">
                              {`Selected ${selectedFiles.length} files`}
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                  {uploadStatus === "error" && (
                    <div>
                      {selectedFiles && (
                        <div className="">
                          <p className="text-center">
                            {`Selected ${selectedFiles.length} files`}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {selectedFiles && (
                    <>
                      {uploadStatus === "uploading" && (
                        <button
                          type="button"
                          class="bg-[#1f51a6]  w-36 h-10 flex items-center justify-center rounded-md"
                          disabled
                        >
                          <div class="loader"></div>
                          <span class="ml-2 text-white">Uploading...</span>
                        </button>
                      )}

                      {uploadStatus === "done" && (
                        <div>
                          <div>
                            <h5 className="text-center">Upload completed!</h5>
                          </div>

                          <div className="">
                            <img
                              className="success-size"
                              src="/assets/img/success.gif"
                              alt=""
                            />
                          </div>
                        </div>
                      )}

                      {uploadStatus === "cancel" && (
                        <div>
                          <p> Uploading cancel</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex justify-between  items-center pt-3 pr-3 pb-4 gap-x-2  ">
                  {uploadStatus === "uploading" ? (
                    <div></div>
                  ) : (
                    <button
                      className={
                        "bg-red-600 relative text-white font-medium rounded-md py-2  hover:bg-red-400 transition-colors text-sm md:text-sm sm:text-sm lg:text-base  w-20 md:w-24 lg:w-32 sm:16 ms-2"
                      }
                      type="button"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                  )}
                  {uploadStatus !== "done" && (
                    <button
                      className="bg-[#1f51a6] relative text-white font-medium rounded-md py-2 hover:bg-blue-500 transition-colors text-sm md:text-sm sm:text-sm lg:text-base w-20 md:w-24 lg:w-32 sm:16 sm:16"
                      type="button"
                      onClick={handleUpload}
                    >
                      Upload
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : null}

      <button
        className={`bg-[#1f51a6] px-2 z-100 fixed bottom-10 right-10 md:bottom-6 md:right-6 text-white active:bg-yellow-600 font-bold uppercase text-sm  rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 sm:bottom-4 sm:right-4 sm:text-xs md:text-sm ${
          isMobile && "bottom-10 right-6"
        }`}
        type="button"
        onClick={handleOpenModal}
      >
        <p className="my-3 px-2 ">
          <ResuableIcons icon="CloudUpload" size={30} />
        </p>
      </button>

      {/* <input type="text" value={folderName} onChange={handleFolderNameChange} />
      <button onClick={createFolder}>Create Folder</button> */}
      {/* <h1  className='mt-20'>Under Development</h1> */}
    </div>
  );
};

Upload.propTypes = {
  folderData: PropTypes.object.isRequired,
};

export default Upload;
