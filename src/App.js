import { Provider } from "react-redux";
import "./App.css";
import { useDispatch } from "react-redux";
import NavbarContainer from "./navbar/NavbarContainer";
import { store } from "./Redux/Store";
import AppRoutes from "./Routes";
import {

  useLocation,
} from "react-router-dom";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { useEffect } from "react";
import { clearfilterPDFWiseData, filetrPDFWiseData } from "./Redux/slices/FileSearchSlice";



if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}


if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  // disableReactDevTools();
}



function App() {
  global.FreezedFolder = 'UPCOMING PROJECTS';
//   const location = useLocation();
//   const dispatch = useDispatch();
// const locationPathName = location.pathname;
// const pathnameSegments = locationPathName.split("/");
// function replaceSpaces(segment) {
//   return segment.replace(/%20/g, " ");
// }
// const resultSegments = pathnameSegments.map(replaceSpaces).filter(Boolean);

// console.log("resultSegments  in app  ", resultSegments);


// useEffect(() => {

//   dispatch(clearfilterPDFWiseData())
//  dispatch(filetrPDFWiseData({data:resultSegments})) 


// }, [dispatch, resultSegments])

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
