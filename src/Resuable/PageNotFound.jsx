import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const { userType } = useSelector(state => state?.auth?.userdata);
  const navigate = useNavigate();
  // console.log("PageNotFoundPageNotFoundPageNotFound");
  useEffect(() => {
    // console.log("User Type:", userType);
    if (userType !== 'Admin') {
      // console.log("Redirecting to PageNotFound");
      navigate('/page-not-found', { replace: true });
    }
  }, [userType, navigate]);


  return (
    <div className="flex flex-row min-h-screen justify-center items-center">
      <h2>PDF not found....</h2>
    </div>
  );
};

export default PageNotFound;
