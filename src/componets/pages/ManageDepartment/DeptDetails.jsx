import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ReusableUserCard from '../../../Resuable/ReusableUserCard';
import { useDispatch, useSelector } from 'react-redux';
import LoadingCard from '../../../Resuable/ReUsableSkeletonLoader';
import { clearSearchQuery } from '../../../Redux/slices/SearchQerySlice';
import StepperVertical from '../../stepper';
import NoData from '../../../Resuable/NoData';

const DeptDetails = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const userinfo = state?.item?.userinfo;
  const { deptData, loading } = useSelector((state) => state?.dept);
  const { searchQuery } = useSelector((state) => state?.searchData);

  const filterUserInfo = useMemo(() => {
    return userinfo?.filter((item) =>
    typeof searchQuery === 'string' &&  item?.userName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [userinfo, searchQuery]);
  console.log("filterUserInfo",filterUserInfo);
  useEffect(() => {

    dispatch(clearSearchQuery());
  }, [dispatch]);
  return (
    <div className='grid mt-10 px-3 2xl:ms-60 xl:ms-56 lg:ms-40 md:ms-20 '>
      {/* <div className="lg:col-span-2 hidden md:block mt-10 ">
       
      </div> */}
      <div className='mt-10 mx-4 col-span-12'>
        {filterUserInfo && filterUserInfo.length > 0 ? (
          filterUserInfo.map(item => (
            <div>
              {loading ? (<LoadingCard />) : (<ReusableUserCard
                key={item?.id}
                size1={34}
                User={item?.userName}
                dept={item?.userType}
              />)}
            </div>
          ))
        ) : (
         
            <div className="flex justify-center  2xl:me-60 xl:me-56 lg:me-40 md:me-20 mt-20">  <NoData msg="No user allocated to this department"/></div>

         
        )}
      </div>
    </div>
  );
}

export default DeptDetails;
