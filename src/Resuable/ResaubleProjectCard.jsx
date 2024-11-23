import React, { useState } from "react";
import ResuableIcons from "./ResuableIcons";
import ProgressBar from "./ProgressBar";
import { useSelector } from "react-redux";

const ResaubleProjectCard = ({
  projectName,
  projectCount,
  handleCard,
  folders,
  drawing,
  showFolderIcon,
  showPdfIcon,
  showDeleteIcon,
  handleDelete,
  showDownloadIcon,
  handleDownload,
  showDownloadProgress,
  backgroundColor,
  lastModified,
  showFreezeIcon,
  showUnFreezeIcon,
  handleFreeze,
  handleUnFreeze,
  filesCount,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const selectedColor = "#1f51a6";
  const defaultColor = "#ffffff";

  const backgroundStyle =
    backgroundColor === "selected-color" ? selectedColor : defaultColor;
  const { userType } = useSelector((state) => state?.auth?.userdata);

  return (
    <div className="-z-10000">
      <div>
        {/* <div
          className={`no-underline block lg:w-24lg:h-30 md:w-25 md:h-50 sm:h-50 border  
           bg-[${backgroundStyle}]  border-gray-200 rounded-2xl shadow z-0  before:-z-10 hover:bg-`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        > */}

        <div
          className={` group  animate-fadeIn relative z-0 overflow-hidden ${
            backgroundColor === "selected-color"
              ? "defaultColor"
              : "bg-gradient-to-b from-[#dbeafe] to-[#dbeafe] "
          }   no-underline block lg:w-24lg:h-30 md:w-25 md:h-50 sm:h-50 border  
           bg-[${backgroundStyle}]   rounded-2xl  shadow-md  `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div class="absolute z-[-1] top-[-16px] right-[-16px] bg-gradient-to-br from-[#1f51a6] to-[#1f51a6] h-[32px] w-[32px] rounded-full scale-100 transform origin-center transition-transform duration-[0.40s] ease-out group-hover:scale-[28]"></div>
          <div className="ms-3">
            <div className="cursor-pointer" onClick={handleCard}>
              <div className="flex justify-between ">
                <div>
                  {showFolderIcon && (
                    <ResuableIcons
                      icon="FcOpenedFolder"
                      size={50}
                      text={!showFolderIcon}
                    />
                  )}
                  {showPdfIcon && (
                    <div className="my-2">
                      <ResuableIcons
                        icon="FaFilePdf"
                        size={50}
                        color="#ff0000"
                      />
                    </div>
                  )}
                </div>
                {lastModified && (
                  <div
                    className={`pe-3 ${
                      isHovered || backgroundStyle === selectedColor
                        ? "text-white"
                        : "text-black truncate"
                    }`}
                  >
                    <p
                      className={`items-center text-xs md:text:xs my-3 md:px-3 tracking-tight ${
                        isHovered || backgroundStyle === selectedColor
                          ? "text-white"
                          : "text-black truncate"
                      }`}
                    >
                      {lastModified}
                    </p>
                  </div>
                )}
              </div>
              <a className="cursor-pointer no-underline ">
                <div className="">
                  {/* {showPdfIcon && (
                  <ResuableIcons icon="FaFilePdf" size={50} color="#ff0000" />
                )} */}
                </div>

                <p
                  className={` items-center xl:text-sm font-bold tracking-tight ${
                    isHovered || backgroundStyle === selectedColor
                      ? "text-white"
                      : "text-black truncate  "
                  }`}
                >
                  {projectName}
                </p>
                {projectCount && (
                  <p
                    className={`truncate items-center xl:text-sm  tracking-tight ${
                      isHovered || backgroundStyle === selectedColor
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {`${projectCount} project  `}
                  </p>
                )}
                <div className="flex justify-start ">
                  <div className="">
                    {folders && folders !== "0" && (
                      <p
                        className={`truncate items-center xl:text-sm  tracking-tight ${
                          isHovered || backgroundStyle === selectedColor
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {`${folders} Folders  `}
                      </p>
                    )}
                  </div>

                  <div className="">
                    {filesCount && filesCount !== "0" && (
                      <p
                        className={`truncate items-center xl:text-sm ps-2 tracking-tight ${
                          isHovered || backgroundStyle === selectedColor
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {`${filesCount} Files  `}
                      </p>
                    )}
                  </div>

                  <div>
                    {drawing && drawing !== "0" && (
                      <p
                        className={`truncate items-center xl:text-sm ps-1 tracking-tight ${
                          isHovered || backgroundStyle === selectedColor
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {`${drawing} Drawings`}
                      </p>
                    )}
                  </div>

                  <div>
                    {folders === "0" && drawing === "0" && (
                      <p
                        className={`truncate items-center xl:text-sm  tracking-tight ${
                          isHovered || backgroundStyle === selectedColor
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        0 Count
                      </p>
                    )}
                    {folders === "0" && drawing === undefined && (
                      <p
                        className={`truncate items-center xl:text-sm ps-1  tracking-tight ${
                          isHovered || backgroundStyle === selectedColor
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        0 Count
                      </p>
                    )}
                  </div>
                </div>
              </a>
            </div>

            <div className="flex justify-between mb-2">
              <div className=" cursor-pointer pe-1   ">
                <a onClick={handleDelete} className=" ">
                  {showDeleteIcon && userType === "Admin" && (
                    // < className="ps-2 pe-1 hover:transition hover:duration-150 hover:ease-in-out   ">
                    <div className="ps-2 pe-1 hover:transform hover:scale-150   hover:duration-300 ">
                      <ResuableIcons
                        icon="FaTrashAlt"
                        size={18}
                        color="#ff0000"
                      />
                    </div>
                  )}
                </a>
              </div>
              {/* ///////////////////////FreezeIcon///////////////////// */}
              {showFreezeIcon && userType === "Admin" && (
                <div className=" cursor-pointer pe-1    ">
                  <a onClick={handleUnFreeze}>
                    <div className=" ps-2 pe-1  hover:transform hover:scale-150  hover:duration-300  ">
                      <ResuableIcons
                        icon="BsFillStopCircleFill"
                        size={20}
                        color={`${
                          isHovered || backgroundStyle === selectedColor
                            ? "white"
                            : "#1f51a6"
                        }`}
                      />
                    </div>
                  </a>
                </div>
              )}
              {showUnFreezeIcon && userType === "Admin" && (
                <div className="cursor-pointer pe-1 ">
                  <a onClick={handleFreeze}>
                    <div className=" ps-2 pe-1 hover:transform hover:scale-150  hover:duration-300   ">
                      <ResuableIcons
                        icon="FaCirclePause"
                        size={20}
                        color={`${
                          isHovered || backgroundStyle === selectedColor
                            ? "white"
                            : "#1f51a6"
                        }`}
                      />
                    </div>
                  </a>
                </div>
              )}
              {/* ///////////////////////FreezeIcon///////////////////// */}

              <div className=" rounded-sm pe-3">
                {showDownloadIcon && (
                  <a className="cursor-pointer   " onClick={handleDownload}>
                    <div className="hover:transform hover:scale-150   hover:duration-300 ">
                      <ResuableIcons
                        icon="MdOutlineFileDownload"
                        color={`${
                          isHovered || backgroundStyle === selectedColor
                            ? "white"
                            : "#1f51a6"
                        }`}
                        size={26}
                      />
                    </div>
                  </a>
                )}

                {showDownloadProgress && (
                  <div>
                    <ProgressBar />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResaubleProjectCard;
