import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetFilterActivites,
  cleargetActionData,
  fetchActivites,
} from "../../../Redux/slices/ActivityCheck";
import ResuableIcons from "../../../Resuable/ResuableIcons";
import CustomAlert from "../../../Resuable/ReusableAlertBox";
import FilterActivity from "./FilterActivity";
import DateSelect from "./DatePicker";

const Home = ({ moduleNameToFilter }) => {
  const dispatch = useDispatch();
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const { activity, loading } = useSelector((state) => state?.activityData);
  const [isDownload, setIsDownload] = useState(false);
  console.log("customAlertVisible", isDownload);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (activity.length === 0) {
  //       dispatch(fetchActivites());
  //     }
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, [dispatch, activity]);
  const { userType } = useSelector((state) => state?.auth?.userdata);

  console.log("userType", userType);

  const handleGetActivity = () => {
    setCustomAlertVisible(true);
    dispatch(cleargetActionData());
    dispatch(GetFilterActivites({ Name: "Header" }));
  };

  const handleCloseActivity = () => {
    setCustomAlertVisible(false);
    setIsDownload(false);
    console.log("i am press");
  };

  console.log("activity", activity);
  const filterModule = useMemo(() => {
    return activity?.filter((item) => {
      const data = moduleNameToFilter.data;
      return (
        (!data.module || item.module === data.module) &&
        (!data.year || item.year === data.year) &&
        (!data.project || item.project === data.project)
      );
    });
  }, [activity, moduleNameToFilter]);

  const currentDate = new Date();
  const mostRecentDateWithActivity = useMemo(() => {
    const datesWithActivity = filterModule.map(
      (item) => new Date(item.datetime)
    );
    return datesWithActivity.length > 0
      ? new Date(Math.max(...datesWithActivity))
      : null;
  }, [filterModule]);

  const [isOverflowActive, setIsOverflowActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector(".overflow-container");
      if (element.scrollTop > 0) {
        setIsOverflowActive(true);
      } else {
        setIsOverflowActive(false);
      }
    };

    const element = document.querySelector(".overflow-container");
    element.addEventListener("scroll", handleScroll);

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleDownloadActvity = () => {
    setIsDownload(true);
  };
  return (
    <>
      <CustomAlert
        visible={customAlertVisible}
        setVisible={setCustomAlertVisible}
        heading={
          // isDownload ? (
          //   <FilterActivity isdownloading={isDownload} />
          // ) : (
          <div className="">
            <FilterActivity />
          </div>
          // )
        }
        // title={"Download"}
        showOk={false}
        title2={"Cancel"}
        action={handleDownloadActvity}
        showNo={true}
        onclickClose={handleCloseActivity}
      />
      <div
        className="fixed top-15 left-0 h-full w-72 2xl:w-72 xl:w-72 lg:w-72 md:w-56 pt-1.5 rounded-se-xl pb-24 overflow-y-auto overflow-container bg-white border border-gray-200 rounded-xl shadow "
        // style={{scrollbarWidth: "thin",scrollbarColor: "blue",scrollbarTrackColor: "transparent",scrollbarThumbColor: "blue",scrollbarTrackColor: "transparent",scrollbarWidth: "2px"}}
      >
        <div
          className={`text-center  flex px-5  justify-between font-semibold py-2 -mt-2.5 bg-white rounded-se-xl fixed w-72 2xl:w-72 xl:w-72 lg:w-72 md:w-56 z-40 border-x border-t border-gray-200 ${
            isOverflowActive
              ? "bg-white rounded-se-xl border-x border-t border-gray-200"
              : ""
          } `}
        >
          <div>Users Activities</div>
          {userType === "Admin" && (
            <div className="cursor-pointer" onClick={handleGetActivity}>
              <ResuableIcons
                icon="LiaFileDownloadSolid"
                size={25}
                text="Get Activity"
              />
            </div>
          )}          
        </div>

        {activity.length === 0 ? (
          <div className="text-center pt-80 my-4">
           
           {loading?(
            <p>Loading...</p>
           ):(
            <p>No data found.</p>
           )}
         
          </div>
        ) : (
          <div className="mt-12">
            {activity.map((item, index) => {
              const activityDate = new Date(item.datetime);
              const isCurrentDate =
                activityDate.toDateString() === currentDate.toDateString();
              const isMostRecentDate =
                mostRecentDateWithActivity &&
                activityDate.toDateString() ===
                  mostRecentDateWithActivity.toDateString();
              const pathParts = item.path?.split("/");
              let lastNonEmptyElement = "";
              for (let i = pathParts?.length - 1; i >= 0; i--) {
                if (pathParts[i] !== "") {
                  lastNonEmptyElement = pathParts[i];
                  break;
                }
              }
              const pathWithoutLastElement = () => {
                const pathParts = item.path
                  ?.split("/")
                  .filter((part) => part.trim() !== "");
                if (pathParts?.length <= 1) {
                  return item.path;
                }

                pathParts?.pop();
                return pathParts?.join("/");
              };
              let cardBackgroundColor = isCurrentDate
                ? "bg-blue-100"
                : "bg-slate-50";
              if (!isCurrentDate && isMostRecentDate) {
                cardBackgroundColor = "bg-blue-100";
              }

              return (
                <div key={index} className="px-3 my-2">
                  <div
                    className={`p-2 border animate-fadeIn border-gray-200 rounded-xl  dark:border-gray-700 text-start ${cardBackgroundColor}`}
                  >
                    <div className="">
                      <p className="font-extrabold ps-2 text-sm  mt-2 mb-0 text-center">{`
                      
             
                  
              ${
                item.title !== "Drawings Added in below folder" ? item.type : ""
              }    ${item.title}`}</p>

                      <p className="font-semibold text-black my-1 activity-font ">{` ${lastNonEmptyElement} `}</p>
                    </div>
                    <hr className="m-0" />
                    <div className="my-1 text-ellipsis">
                      <span className="font-semibold activity-font ">
                        Path :
                      </span>
                      <small className="break-line">{`${pathWithoutLastElement()}`}</small>
                    </div>
                    <hr className="m-0" />
                    <div className="flex my-1">
                      <div className="mt-0.5 me-0.5">
                        {" "}
                        <ResuableIcons size={15} icon="FaUserCircle" />
                      </div>
                      <small className="activity-font">{item.userName}</small>
                    </div>
                    <div>
                      <small className="activity-font">{item.datetime}</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
