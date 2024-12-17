import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReusableTable from "../../../Resuable/ReusableTable";
import StepperVertical from "../../stepper";
import {
  clearParameters,
  setHeaderName,
} from "../../../Redux/slices/StepperSlice";
import { clearSearchQuery } from "../../../Redux/slices/SearchQerySlice";
import {
  manageUserAction,
  manageUserTypes,
} from "../../../Redux/slices/manageUser";
import { useNavigate } from "react-router-dom";
import Fab from "../../../Resuable/Fab";
import LoadingCard from "../../../Resuable/ReUsableSkeletonLoader";
import ReusableUserCard from "../../../Resuable/ReusableUserCard";
import { clearQrScannerData } from "../../../Redux/slices/QrScannerSlice";
import LoadingScreen from "../../../Resuable/LoadingScreen";
import NoData from "../../../Resuable/NoData";
import { encryptionkey } from "../../../constants";
import CryptoJS from "crypto-js";
import ResuableIcons from "../../../Resuable/ResuableIcons";
const ManageUsers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state) => state?.user);

  console.log("userData",userData);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "",
  });
  const { searchQuery } = useSelector((state) => state?.searchData);

  const sortData = (key) => {
    console.log("key", key);
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUserData = useMemo(() => {
    if (!Array.isArray(userData)) {
      return [];
    }

    let sortableData = [...userData];
    console.log("sortableData", sortableData);

    if (sortConfig.key || searchQuery) {
      sortableData = sortableData.filter(
        (item) =>
          typeof searchQuery === "string" &&
          (item?.firstName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase().trim()) ||
            item?.lastName
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase().trim()) ||
            item?.email
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase().trim()) ||
            item?.userType?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase().trim()) ||
            item?.department?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase().trim()))
      );

      if (sortConfig.key) {
        sortableData.sort((a, b) => {
          let valueA, valueB;
          if (
            sortConfig.key === "userType.name" ||
            sortConfig.key === "department.name"
          ) {
            valueA = (a[sortConfig.key.split(".")[0]]?.name || "")
              .toString()
              .toLowerCase()
              .trim();
            valueB = (b[sortConfig.key.split(".")[0]]?.name || "")
              .toString()
              .toLowerCase()
              .trim();
          } else {
            valueA = (a[sortConfig.key] || "").toString().toLowerCase().trim();
            valueB = (b[sortConfig.key] || "").toString().toLowerCase().trim();
          }

          if (valueA < valueB) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (valueA > valueB) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        });
      }
    }

    return sortableData;
  }, [userData, sortConfig, searchQuery]);

  console.log("sortedUserData", sortedUserData);
  useEffect(() => {
    localStorage.setItem("disable", JSON.stringify(true));
    dispatch(clearQrScannerData());
    dispatch(manageUserAction());
    dispatch(manageUserTypes());
    dispatch(clearSearchQuery());
    dispatch(setHeaderName("USER"));
    
    sessionStorage.removeItem("pdfdata");

    sessionStorage.removeItem("selectedPdfUrl");
    localStorage.setItem("disable", JSON.stringify(true));
    dispatch(clearQrScannerData());
  }, [dispatch]);

  const handleClick = (item) => {
    const encryptedId = CryptoJS.AES.encrypt(
      item?.userId.toString(),
      encryptionkey
    ).toString();

    navigate(`/userDetails/${encodeURIComponent(encryptedId)}`, {
      state: { user: item },
    });
  };
  const handleClick2 = () => {
    navigate(`/createUser`);
  };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderTableDiv = () => {
    if (windowWidth >= 1047) {
      return (
        <div className="grid  px-3 me-8">
          <div className="mt-14 ms-4 col-span-12 ">
            {sortedUserData && sortedUserData.length > 0 ? (
              <table className="my-8 w-full ">
                <thead className="sticky top-14  ">
                  <tr className="grid grid-cols-12 gap-4  bg-blue-50  text-gray-900 text-sm sm:text-xs lg:text-xs xl:text-xs 2xl:text-sm divide-x-2   break-all divide-slate-200 ms-6 truncate h-16  border-2 shadow-md rounded-xl border-inherit text-wrap text-ellipsis ">
                    <th className="col-span-2   text-ellipsis ps-1.5 py-3">
                      <div className="flex  justify-between">
                        <div>First Name </div>

                        <div
                          className="cursor-pointer"
                          onClick={() => sortData("firstName")}
                        >
                          <ResuableIcons
                            icon={
                              sortConfig.key === "firstName"
                                ? sortConfig.direction === "ascending"
                                  ? "MdOutlineArrowDropUp"
                                  : "MdOutlineArrowDropDown"
                                : "MdOutlineArrowDropDown"
                            }
                            size={25}
                          />
                        </div>
                      </div>
                    </th>
                    <th className="col-span-2   text-ellipsis ps-1.5 py-3">
                      <div className="flex  justify-between">
                        <div> Last Name</div>

                        <div
                          className="cursor-pointer"
                          onClick={() => sortData("lastName")}
                        >
                          <ResuableIcons
                            icon={
                              sortConfig.key === "lastName"
                                ? sortConfig.direction === "ascending"
                                  ? "MdOutlineArrowDropUp"
                                  : "MdOutlineArrowDropDown"
                                : "MdOutlineArrowDropDown"
                            }
                            size={25}
                          />
                        </div>
                      </div>
                    </th>
                    <th className="col-span-2  text-ellipsis ps-1.5 py-3">
                      <div className="flex  justify-between">
                        <div> Email Id</div>

                        <div
                          className="cursor-pointer"
                          onClick={() => sortData("email")}
                        >
                          <ResuableIcons
                            icon={
                              sortConfig.key === "email"
                                ? sortConfig.direction === "ascending"
                                  ? "MdOutlineArrowDropUp"
                                  : "MdOutlineArrowDropDown"
                                : "MdOutlineArrowDropDown"
                            }
                            size={25}
                          />
                        </div>
                      </div>
                    </th>

                    <th className="text-ellipsis ps-1.5 py-3  -me-4 ">
                      <div className="flex  justify-between">
                        <div> User Type</div>

                        <div
                          className="cursor-pointer"
                          onClick={() => sortData("userType.name")}
                        >
                          <ResuableIcons
                            icon={
                              sortConfig.key === "userType.name"
                                ? sortConfig.direction === "ascending"
                                  ? "MdOutlineArrowDropUp"
                                  : "MdOutlineArrowDropDown"
                                : "MdOutlineArrowDropDown"
                            }
                            size={25}
                          />
                        </div>
                      </div>
                    </th>
                    <th className="text-ellipsis ps-1.5 py-3 -me-4">
                      <div className="flex  justify-between">
                        <div>Department</div>

                        <div
                          className="cursor-pointer"
                          onClick={() => sortData("department.name")}
                        >
                          <ResuableIcons
                            icon={
                              sortConfig.key === "department.name"
                                ? sortConfig.direction === "ascending"
                                  ? "MdOutlineArrowDropUp"
                                  : "MdOutlineArrowDropDown"
                                : "MdOutlineArrowDropDown"
                            }
                            size={25}
                          />
                        </div>
                      </div>
                    </th>
                    <th className="col-span-1 text-ellipsis ps-1.5 py-3 ">
                      <div className="flex  justify-between">
                        <div> Creation Date</div>

                        <div
                          className="cursor-pointer"
                          onClick={() => sortData("dateCreated")}
                        >
                          <ResuableIcons
                            icon={
                              sortConfig.key === "dateCreated"
                                ? sortConfig.direction === "ascending"
                                  ? "MdOutlineArrowDropUp"
                                  : "MdOutlineArrowDropDown"
                                : "MdOutlineArrowDropDown"
                            }
                            size={25}
                          />
                        </div>
                      </div>
                    </th>
                    <th className="col-span-1 text-ellipsis ps-1.5 py-3 ">
                      <div className="flex  justify-between">
                        <div>Status</div>

                        <div
                          className="cursor-pointer"
                          onClick={() => sortData("isActive")}
                        >
                          <ResuableIcons
                            icon={
                              sortConfig.key === "isActive"
                                ? sortConfig.direction === "ascending"
                                  ? "MdOutlineArrowDropUp"
                                  : "MdOutlineArrowDropDown"
                                : "MdOutlineArrowDropDown"
                            }
                            size={25}
                          />
                        </div>
                      </div>
                    </th>
                    <th className="col-span-2 text-ellipsis ps-1.5 py-3 ">
                      <div className="flex  justify-between">
                        <div> Last Active</div>

                        <div
                          className="cursor-pointer"
                          onClick={() => sortData("lastActiveTime")}
                        >
                          <ResuableIcons
                            icon={
                              sortConfig.key === "lastActiveTime"
                                ? sortConfig.direction === "ascending"
                                  ? "MdOutlineArrowDropUp"
                                  : "MdOutlineArrowDropDown"
                                : "MdOutlineArrowDropDown"
                            }
                            size={25}
                          />
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="overflow-hidden">
                  {sortedUserData?.map((item, index) => {
                    const options = {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    };
                    const formattedDate = new Date(
                      item?.dateCreated
                    ).toLocaleDateString("en-IN", options);
                    const status = item.isActive ? "Active" : "Inactive";

                    //LastActiveTime
                    const beautifyLastActiveTime = (lastActiveTime) => {
                      if (
                        !item?.lastActiveTime ||
                        isNaN(new Date(item?.lastActiveTime))
                      ) {
                        return "N/A";
                      }

                      const options = {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      };
                      const formattedDate = new Date(
                        item?.lastActiveTime
                      ).toLocaleDateString("en-IN", options);
                      return `${formattedDate}`;
                    };
                    return (
                      <ReusableTable
                        key={index}
                        firstName={item?.firstName}
                        lastName={item.lastName}
                        email={item?.email}
                        employeeId={item?.employeeId}
                        mobile={item?.mobile}
                        formattedDate={formattedDate}
                        userType={item?.userType?.name}
                        department={item?.department?.name}
                        isActive={status}
                        lastActiveTime={beautifyLastActiveTime()}
                        onClick={() => handleClick(item)}
                      />
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="">
              {loading ? (
                <LoadingScreen />
              ) : (
                <div className="flex justify-center  mt-20">
                  {" "}
                  <NoData />
                </div>
              )}
            </div>
            )}
          </div>
          <div onClick={handleClick2} className="bottom-10 right-10 fixed">
            <Fab />
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid mt-10 px-3 md:ms-20">
          <div className="mt-10 mx-4 col-span-12">
            {sortedUserData && sortedUserData.length > 0 ? (
              sortedUserData?.map((item, index) => (
                <div className=" " key={index}>
                  {loading ? (
                    <LoadingCard />
                  ) : (
                    <ReusableUserCard
                      User={item.firstName}
                      dept={item?.department?.name}
                      onClick1={() => handleClick(item)}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="">
                {loading ? (
                  <LoadingScreen />
                ) : (
                  <div className="flex justify-center  mt-20">
                    {" "}
                    <NoData />
                  </div>
                )}
              </div>
            )}
          </div>
          <div onClick={handleClick2} className="bottom-10 right-10 fixed">
            <Fab />
          </div>
        </div>
      );
    }
  };
  return <>{renderTableDiv()}</>;
};

export default ManageUsers;
