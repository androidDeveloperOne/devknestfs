import React, { useEffect } from "react";
import YearWiseProject from "./YearWiseProject";
import { Link, Outlet } from "react-router-dom";
import { clearAllParameters } from "../../../Redux/slices/StepperSlice";
import { useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearAllParameters())
  }, [dispatch]);

  return (
    <>
      <div>
        <Link to="/yearWise">
    
        </Link>
        <Link to="/yearwiseprojectDetails" />
        <Outlet />
      </div>
      {/* <YearWiseProject /> */}
    </>
  );
};

export default Home;
