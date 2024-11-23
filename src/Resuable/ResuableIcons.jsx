import React from "react";
import {
  FaAlignRight,
  FaArrowCircleRight,
  FaFilePdf,
  FaFileUpload,
  FaUserCircle,
  FaPhoneAlt,
  FaCloudUploadAlt,
  FaRegCalendarAlt,
  FaTrashAlt,
  FaBriefcase,
  FaUsers,
  FaUserTie,
  FaQrcode,
} from "react-icons/fa";
import { FcOpenedFolder } from "react-icons/fc";
import { GrNext, GrPrevious, GrFormClose } from "react-icons/gr";
import { IoMail } from "react-icons/io5";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { RiComputerFill, RiLockPasswordFill } from "react-icons/ri";
import { IoReloadCircleOutline } from "react-icons/io5";
import {
  PiUserCirclePlusFill,
  PiIdentificationBadgeFill,
} from "react-icons/pi";
import Tooltip from "@mui/material/Tooltip";
import {
  MdCreateNewFolder,
  MdCloudUpload,
  MdOutlineFileDownload,
  MdEdit,
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
  MdUploadFile,
  MdDriveFolderUpload,
  MdDone 
} from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";
import { IoIosNotifications } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { BsFillStopCircleFill } from "react-icons/bs";
import { FaCirclePause } from "react-icons/fa6";
import { VscCircleLargeFilled } from "react-icons/vsc";
const ResuableIcons = ({ icon, size, color, text }) => {
  let IconComponent = null;

  switch (icon) {
    case "PiIdentificationBadgeFill":
      IconComponent = PiIdentificationBadgeFill;
      break;
    case "BsFillStopCircleFill":
      IconComponent = BsFillStopCircleFill;
      break;
    case "FaCirclePause":
      IconComponent = FaCirclePause;
      break;
    case "TbPasswordUser":
      IconComponent = TbPasswordUser;
      break;
    case "alignRight":
      IconComponent = FaAlignRight;
      break;
    case "FcOpenedFolder":
      IconComponent = FcOpenedFolder;
      break;
    case "FaFilePdf":
      IconComponent = FaFilePdf;
      break;
    case "FaUsers":
      IconComponent = FaUsers;
      break;
    case "FaUserTie":
      IconComponent = FaUserTie;
      break;
    case "FaUserCircle":
      IconComponent = FaUserCircle;
      break;
    case "FaArrowCircleRight":
      IconComponent = FaArrowCircleRight;
      break;

    case "GrNext":
      IconComponent = GrNext;
      break;

    case "GrPrevious":
      IconComponent = GrPrevious;
      break;
    case "FaPhoneAlt":
      IconComponent = FaPhoneAlt;
      break;
    case "IoMail":
      IconComponent = IoMail;
      break;
    case "FaRegCalendarAlt":
      IconComponent = FaRegCalendarAlt;
      break;
    case "FaCloudUploadAlt":
      IconComponent = FaCloudUploadAlt;
      break;
    case "FaTrashAlt":
      IconComponent = FaTrashAlt;
      break;
    case "FaBriefcase":
      IconComponent = FaBriefcase;
      break;
    case "RiComputerFill":
      IconComponent = RiComputerFill;
      break;
      case "MdDriveFolderUpload":
        IconComponent = MdDriveFolderUpload;
        break;
    case "IoMdAdd":
      IconComponent = IoMdAdd;
      break;
    case "PiUserCirclePlusFill":
      IconComponent = PiUserCirclePlusFill;
      break;
    case "RiLockPasswordFill":
      IconComponent = RiLockPasswordFill;
      break;
    case "CreateFolder":
      IconComponent = MdCreateNewFolder;
      break;
    case "GrFormClose":
      IconComponent = GrFormClose;
      break;
    case "MdEdit":
      IconComponent = MdEdit;
      break;
    case "IoMdClose":
      IconComponent = IoMdClose;
      break;
    case "CloudUpload":
      IconComponent = MdCloudUpload;
      break;
      case "MdUploadFile":
        IconComponent = MdUploadFile;
        break;

    case "MdDone":
      IconComponent = MdDone;
      break;

      case "MdOutlineFileDownload":
        IconComponent = MdOutlineFileDownload;
        break;

    case "MdOutlineFileDownload":
      IconComponent = MdOutlineFileDownload;
      break;

    case "CiLogout":
      IconComponent = CiLogout;
      break;

    case "FaQrcode":
      IconComponent = FaQrcode;
      break;

    case "MdOutlineArrowDropDown":
      IconComponent = MdOutlineArrowDropDown;
      break;

    case "MdOutlineArrowDropUp":
      IconComponent = MdOutlineArrowDropUp;
      break;
      case "VscCircleLargeFilled":
        IconComponent = VscCircleLargeFilled;
        break;
    case "IoIosNotifications":
      IconComponent = IoIosNotifications;
      break;

      case "LiaFileDownloadSolid":
        IconComponent = LiaFileDownloadSolid;
        break;

     case "IoReloadCircleOutline":
    IconComponent = IoReloadCircleOutline;
          break;
    

    default:
      // IconComponent = FaAlignRight;
      break;
  }

  const renderIcon = () => {
    if (IconComponent) {
      return (
        <Tooltip
          title={text}
          componentsProps={{ tooltip: { sx: { backgroundColor: "#184084" } } }}
        >
          <div>
            <IconComponent size={size} color={color} />
          </div>
        </Tooltip>
      );
    }

    return null;
  };

  return renderIcon();
};

export default ResuableIcons;
