import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReusableUserCard from "../../../Resuable/ReusableUserCard";
import {
  deleteDeptAction,
  manageDeptAction,
} from "../../../Redux/slices/deptSlice";
import AddDepartment from "./AddDepartment";
import CustomAlert from "../../../Resuable/ReusableAlertBox";
import LoadingCard from "../../../Resuable/ReUsableSkeletonLoader";
import { clearSearchQuery } from "../../../Redux/slices/SearchQerySlice";

import NoData from "../../../Resuable/NoData";

import {

  setHeaderName,
} from "../../../Redux/slices/StepperSlice";
import { clearQrScannerData } from "../../../Redux/slices/QrScannerSlice";
import LoadingScreen from "../../../Resuable/LoadingScreen";

import CryptoJS from "crypto-js";
import { encryptionkey } from "../../../constants";
const ManageDepartments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { deptData, serverErr, deleteData, loading } = useSelector(
    (state) => state?.dept
  );

  console.log("deleteData",deleteData);
  
  console.log("deptData",deptData);
  
  const [alertVisible, setAlertVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState({});

  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const { searchQuery } = useSelector((state) => state?.searchData);
  const filterDeptData = useMemo(() => {
    return deptData?.filter(
      (item) =>
        typeof searchQuery === "string" &&
        item.departmentName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [deptData, searchQuery]);


console.log("filterDeptData",filterDeptData);



  useEffect(() => {
    localStorage.setItem("disable", JSON.stringify(true));

    sessionStorage.removeItem("pdfdata");

    sessionStorage.removeItem("selectedPdfUrl");
    dispatch(manageDeptAction());
    dispatch(clearSearchQuery());
    dispatch(clearQrScannerData());
    dispatch(setHeaderName("DEPARTMENT"));
    localStorage.setItem("disable", JSON.stringify(true));
    dispatch(clearQrScannerData());
  }, [dispatch]);

  const handleClick = (item) => {
    const encryptedId = CryptoJS.AES.encrypt(item?.id.toString(), encryptionkey).toString();
    navigate(`/deptDetails/${encodeURIComponent(encryptedId)}`, { state: { item } });
  };
  const handleDelete = async (item) => {
    try {
      const resultAction = await dispatch(deleteDeptAction(item.id));
      if (deleteDeptAction.rejected.match(resultAction)) {
        setCustomAlertVisible(true);
      }
      if (deleteDeptAction.fulfilled.match(resultAction)) {
        setAlertVisible(true);
      }
      setDeleteModalVisible({ ...deleteModalVisible, [item.id]: false });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="grid mt-10 px-3 2xl:ms-60 xl:ms-56 lg:ms-40 md:ms-20 ">
      {/* <div
          className="lg:col-span-2 hidden md:block my-2"
   
        > */}

      {/* <Home moduleNameToFilter="Department" /> */}
      {/* </div> */}
      <div className="mt-10 mx-4 col-span-12">
        {
        filterDeptData ? 
        (
          filterDeptData?.map((item, index) => (
            <div className=" " key={index}>
              <CustomAlert
                heading={"Are you sure you want to delete?"}
                visible={deleteModalVisible[item.id]}
                setVisible={(isVisible) =>
                  setDeleteModalVisible({
                    ...deleteModalVisible,
                    [item.id]: isVisible,
                  })
                }
                deleteText={`${item.departmentName} department`}
                action={() => handleDelete(item)}
                showOk={true}
                showNo={true}
                onclickClose={() => setDeleteModalVisible(false)}
              />
              {/* ........................ServerErrMsg......................*/}
              <CustomAlert
                // heading={serverErr}
                visible={customAlertVisible}
                setVisible={(isVisible) => setCustomAlertVisible(isVisible)}
                title2={"OK"}
                showNo={true}
                onclickClose={() => setCustomAlertVisible(false)}
              />
              {/* ........................DepartmentDeletedSuccessMsg......................*/}
              <CustomAlert
                 heading={deleteData}
                visible={alertVisible}
                setVisible={(isVisible) => setAlertVisible(isVisible)}
                title2={"OK"}
                showNo={true}
                onclickClose={() => setAlertVisible(false)}
              />
              {loading ? (
                <LoadingCard />
              ) : (
                <ReusableUserCard
                  key={item.id}
                  User={item.departmentName}
                  dept={`${item.userinfo.length} user`}
                  icon1={"FaBriefcase"}
                  size1={30}
                  icon2={"MdEdit"}
                  icon3={"FaTrashAlt"}
                  onClick2={() =>
                    navigate(
                      `/updateDepartment/${item.departmentName}/${item.id}`
                    )
                  }
                  onClick1={() => handleClick(item)}
                  onClick3={() =>
                    setDeleteModalVisible({
                      ...deleteModalVisible,
                      [item.id]: true,
                    })
                  }
                />
              )}
            </div>
          ))
        ) : (
          <div className="">
            {loading ? (
              <LoadingScreen />
            ) : (
              <div className="flex justify-center  2xl:me-60 xl:me-56 lg:me-40 md:me-20 mt-20">
                {" "}
                <NoData />
              </div>
            )}
          </div>
        )
        
        
        }

        <div className="bottom-10 right-10 absolute">
          <AddDepartment />
        </div>
      </div>
    </div>
  );
};

export default ManageDepartments;
