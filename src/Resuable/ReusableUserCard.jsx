import React, { useEffect, useState } from "react";
import ResuableIcons from "./ResuableIcons";
const ReusableUserCard = ({
  icon2,
  icon1,
  icon3,
  User,
  dept,
  onClick1,
  onClick2,
  onClick3,
  color3,
  size,
  size1,
  color,
  handleCard,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 468);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 468);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      className={`flex justify-center bg-white w-full md:w-11/12 lg:w-11/12 xl:w-10/12 `}
      style={{ width: isMobile ? "100%" : "" }}
      onClick={handleCard}
    >
      <div
        className={`flex justify-center bg-white w-full md:w-11/12 lg:w-11/12 xl:w-10/12 flex-row h-16 items-center border-2 shadow-md rounded-2xl border-inherit mt-6 ${
          onClick1 ? "cursor-pointer" : "cursor-auto"
        } `}
      >
        <div className="ml-4">
          <ResuableIcons
            icon={icon1 ? icon1 : "FaUserCircle"}
            size={size1 ? size1 : 40}
            color={"#000000"}
          />
        </div>
        <div className="flex-grow ml-8 mt-3 truncate" onClick={onClick1}>
          <p
            className={`font-medium tracking-tight text-gray-900  uppercase  ${
              isMobile ? "text-sm" : ""
            } mb-0`}
          >
            {User ? User : null}
          </p>
          <p
            className={`lg:text-sm sm:text-sm text-gray-700   ${
              isMobile ? "text-xs" : ""
            }`}
          >
            {dept ? dept : null}
          </p>
        </div>
        {icon2 && (
          <div className="flex-none w-14 cursor-pointer" onClick={onClick2}>
            <ResuableIcons
              icon={icon2 ? icon2 : null}
              size={size ? size : 30}
              color={color ? color : "#1f51a6"}
            />
          </div>
        )}
        {icon3 && (
          <div
            className="mx-3 flex-none w-14 cursor-pointer"
            onClick={onClick3}
          >
            <ResuableIcons
              icon={icon3 ? icon3 : null}
              size={size ? size : 30}
              color={color3 ? color3 : "red"}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default ReusableUserCard;
