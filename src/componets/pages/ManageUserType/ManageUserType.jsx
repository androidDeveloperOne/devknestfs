import React, { useEffect, useMemo, useState } from 'react'
import { deleteUserTypeAction, manageUserTypeAction } from '../../../Redux/slices/userTypeSlice';
import { useDispatch, useSelector } from 'react-redux';
import ReusableUserCard from '../../../Resuable/ReusableUserCard';
import AddUserType from './AddUserType';
import CustomAlert from '../../../Resuable/ReusableAlertBox';
import { useNavigate } from 'react-router-dom';
import LoadingCard from '../../../Resuable/ReUsableSkeletonLoader';
import { clearSearchQuery } from '../../../Redux/slices/SearchQerySlice';
import StepperVertical from '../../stepper';
import { clearParameters, setHeaderName } from '../../../Redux/slices/StepperSlice';
import { clearQrScannerData } from '../../../Redux/slices/QrScannerSlice';
import LoadingScreen from '../../../Resuable/LoadingScreen';
import NoData from '../../../Resuable/NoData';

const ManageUserType = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { serverErr, userTypeData, deleteUserTypedata, loading } = useSelector((state) => state?.userType);

  console.log(" userTypeData", userTypeData);
  const [deleteModalVisible, setDeleteModalVisible] = useState({});
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customVisible, setCustomVisible] = useState(false);
  const { searchQuery } = useSelector((state) => state?.searchData);
  let stepData = useSelector((state) => state?.stepperData);
  const filterUserTypeData = useMemo(() => {
    return userTypeData?.filter((item) =>
    typeof searchQuery === 'string' &&  item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [userTypeData, searchQuery]);
  useEffect(() => {
    localStorage.setItem("disable",JSON.stringify(true));
    dispatch(clearQrScannerData());
    dispatch(manageUserTypeAction());
    dispatch(clearSearchQuery());
    dispatch(setHeaderName("USERTYPE"));

    sessionStorage.removeItem("pdfdata");

    sessionStorage.removeItem("selectedPdfUrl");
    dispatch(clearQrScannerData())
    localStorage.setItem("disable",JSON.stringify(true));
  }, []);

  const handleDelete = async (item) => {
    try {
      const resultAction = await dispatch(deleteUserTypeAction(item.id));
      if (deleteUserTypeAction.fulfilled.match(resultAction)) {
        setCustomAlertVisible(true);
      }
      if (deleteUserTypeAction.rejected.match(resultAction)) {
        setCustomVisible(true)
      }
      setDeleteModalVisible({ ...deleteModalVisible, [item.id]: false });
    } catch (error) {
      return;
    }



  }

  return (
    <div className='grid mt-10 px-3 2xl:ms-60 xl:ms-56 lg:ms-40 md:ms-20 '>

      <div className='mt-10 mx-4 col-span-12'>
        {filterUserTypeData && filterUserTypeData.length > 0 ?
          filterUserTypeData?.map((item, index) => (
            <div className=" " key={index}>
              <CustomAlert
                heading={"Are you sure you want to delete?"}
                visible={deleteModalVisible[item.id]}
                setVisible={(isVisible) => setDeleteModalVisible({ ...deleteModalVisible, [item.id]: isVisible })}
                deleteText={`${item.name} userType`}
                action={() => handleDelete(item)}
                showOk={true}
                showNo={true}
                onclickClose={() => setDeleteModalVisible(false)}
              />
              {/* .........................DeletionSuccessMessageAlert.................... */}
              <CustomAlert
                heading={deleteUserTypedata}
                visible={customAlertVisible}
                setVisible={(isVisible) => setCustomAlertVisible(isVisible)}
                title2={"OK"}
                showNo={true}
                onclickClose={() => setCustomAlertVisible(false)}

              />
              {/* .........................ServerAlert.................... */}
              <CustomAlert
                heading={serverErr}
                visible={customVisible}
                setVisible={(isVisible) => setCustomVisible(isVisible)}
                title2={"OK"}
                showNo={true}
                onclickClose={() => setCustomVisible(false)}


            />
            {loading ? <LoadingCard /> : <ReusableUserCard
              key={item.id}
              icon1={"FaUsers"}
              size1={34}
              User={item.name}

              // icon2={"MdEdit"}
              //icon3={"FaTrashAlt"}
              // onClick2={() => navigate(`/updateUserType/${item.name}/${item.id}`)}
              // onClick3={() => setDeleteModalVisible({ ...deleteModalVisible, [item.id]: true })}

              />}

            </div>
          )) : (
            <div className="">
              {loading ? (
                <LoadingScreen />
              ) : (
                <div className="flex justify-center  2xl:me-60 xl:me-56 lg:me-40 md:me-20 mt-20">  <NoData /></div>
              )}
            </div>
          )}
        <div className='bottom-10 right-10 absolute'>
          <AddUserType />
        </div>
      </div>
    </div>
  )
}

export default ManageUserType

