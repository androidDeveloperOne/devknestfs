import zIndex from "@mui/material/styles/zIndex";
import React from "react";
import { ClipLoader } from "react-spinners";
//  import Image from '../assets/Spinner.gif';
const LoadingScreen = ({ loading }) => {

  console.log("***8*",loading);

  const override = {
    display: loading ? "flex" : "none",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Full viewport height
    textAlign: "center",
    width: "100vw",
    zIndex:-1



  };



  return (
    <div>
      <div className="loading-container"  style={override}
      
      >
        {loading && (
          <img src="../assets/img/Spinner.gif" 
          alt="Loading..." 
          
          srcset="" 
          style={{ width: '150px', height: '150px' }} 
          
          />
        )}
        {/* <ClipLoader
          color={"#1f51a6"}
          loading={loading}
          cssOverride={override}
          size={50}
        /> */}
      </div>
    </div>
  );
};

export default LoadingScreen;
