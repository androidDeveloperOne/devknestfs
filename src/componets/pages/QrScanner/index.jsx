import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  QrScanerData,
  clearQrError,
  clearQrScannerData,
} from "../../../Redux/slices/QrScannerSlice";
import PDFViewer from "../../../Resuable/PDFViewer";
import SinglePdfViewer from "../../../Resuable/SinglePdfViewer";
import { clearSearchQuery } from "../../../Redux/slices/SearchQerySlice";
import { useNavigate } from "react-router-dom";
import { clearprojectMainDirectriesData } from "../../../Redux/slices/ProjectMainDirectories";
import CustomAlert from "../../../Resuable/ReusableAlertBox";
import { addName, clearParameters } from "../../../Redux/slices/StepperSlice";
import LoadingScreen from "../../../Resuable/LoadingScreen";

const QrScanner = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [errAlertVisible, setErrAlertVisible] = useState(false);
  const [fileLocation, setFileLocation] = useState();
  const [inputDisabled, setInputDisabled] = useState(false);
  const { ScannerValue, loading, Qrerror } = useSelector(
    (state) => state?.scannedData
  );

  console.log("Qrerror", Qrerror);
  // console.log("alertVisible", alertVisible);
  // console.log("fileLocationrrr", fileLocation);
  // console.log(" ScannerValue", ScannerValue);
  const inputRef = useRef(null);
  useEffect(() => {
    dispatch(clearSearchQuery());

    sessionStorage.removeItem("pdfdata");

    sessionStorage.removeItem("selectedPdfUrl");
    inputRef.current.focus();

    const interval = setInterval(() => {
      inputRef.current.focus();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (ScannerValue?.url) {
      setShowPdfViewer(true);
      setCustomAlertVisible(false);
    }
    console.log("ScannerValue:", ScannerValue);
    if (showPdfViewer) {
      setAlertVisible(false);
      dispatch(clearQrError());
    }

    const pattern = /https:\/\/[^\/]+\/([^?]+)\//;
    // if (ScannerValue) {
    const matches = ScannerValue?.url?.match(pattern);

    if (matches && matches?.length === 2) {
      const location = matches[1];
      const updataLoaction = decodeURIComponent(location).replace(/\+/g, " ");
      setFileLocation(updataLoaction);
    }
    // }
  }, [ScannerValue, showPdfViewer]);

  useEffect(() => {
    if (Qrerror?.drawingnotFound) {
      const confirmed = setAlertVisible(true);
      setInputDisabled(false);
      if (confirmed) {
        const ScannerValueString = value?.split("$");
        if (ScannerValueString.length >= 8) {
          const project = ScannerValueString[7];
          if (project && project.length >= 3) {
            const year = "20" + project[1] + project[2];
            console.log("yearrrr", year);
            console.log("year@@@@@@@@@@@@", ScannerValueString);
            navigate(`/${year}/${project}`);
            if (year) {
              dispatch(
                addName({
                  key: "0",
                  value: `${year}`,
                  parameter: year,
                  year: year,
                })
              );
            }

            if (project) {
              dispatch(
                addName({
                  key: "1",
                  value: `${year}/${project}`,
                  parameter: project,
                  project: project,
                  year: year,
                })
              );
            }
          } else {
            console.error("Invalid project value or length");
          }
        } else {
          console.error("ScannerValueString does not have enough elements");
        }

        dispatch(clearQrError());
        dispatch(clearQrScannerData());
      }
    } else if (Qrerror?.invalidInput) {
      const message = Qrerror.invalidInput;
      setInputDisabled(false);
      const confirmed = setCustomAlertVisible(true);
      if (confirmed) {
        dispatch(clearQrError());
        dispatch(clearQrScannerData());
      }
    } else {
      // If Qrerror is empty, hide the custom alert
      setAlertVisible(false);
      setCustomAlertVisible(false);
    }
  }, [Qrerror, navigate, value, dispatch]);

  const handleChange = (e) => {
    dispatch(clearQrError());
    const numericRegex = /^[0-9]+$/;
    let pdfValue = e.target.value;
    setValue(pdfValue);
    console.log(" pdfValue", pdfValue);
    if (e.key === "Enter") {
      e.target.value = "";
      if (!numericRegex.test(pdfValue)) {
        dispatch(QrScanerData(pdfValue));
      } else {
        // alert("Please scan Qr code only");
        setErrAlertVisible(true);
      }
    }
  };

  const handleClosePDF = () => {
    dispatch(clearQrScannerData());
    setShowPdfViewer(false);
    setFileLocation();
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:mt-10 place-items-stretch ">
        <div className="text-center place-content-center mt-7 px-3 ">
          <CustomAlert
            heading={Qrerror?.invalidInput}
            visible={customAlertVisible}
            setVisible={(isVisible) => setCustomAlertVisible(isVisible)}
            showOk={true}
            title={"OK"}
            title2={"Cancel"}
            action={() => {
              setCustomAlertVisible(false);
              setShowPdfViewer(false);
              dispatch(clearQrError());
              dispatch(clearQrScannerData());
            }}
            showNo={true}
            onclickClose={() => {
              setCustomAlertVisible(false);
              dispatch(clearQrError());
              dispatch(clearQrScannerData());
              setInputDisabled(false);
            }}
          />

          {loading ? (
            <div>
              <LoadingScreen />
            </div>
          ) : null}

          <CustomAlert
            heading={Qrerror?.drawingnotFound}
            visible={alertVisible}
            setVisible={(isVisible) => setAlertVisible(isVisible)}
            showOk={true}
            action={() => {
              const ScannerValueString = value?.split("$");
              const folderName = ScannerValueString[5];
              const project = ScannerValueString[7];
              const year = "20" + project[1] + project[2];

              navigate(`/${year}/${project}`);
              dispatch(clearQrError());
              dispatch(clearQrScannerData());

              if (year) {
                dispatch(
                  addName({
                    key: "0",
                    value: `${year}`,
                    parameter: year,
                    // project: project,
                    year: year,
                  })
                );
              }

              if (project) {
                dispatch(
                  addName({
                    key: "1",
                    value: `${year}/${project}`,
                    parameter: project,
                    project: project,
                    year: year,
                  })
                );
              }
            }}
            title={"OK"}
            title2={"Cancel"}
            showNo={true}
            onclickClose={() => {
              setAlertVisible(false);
              setShowPdfViewer(false);

              dispatch(clearQrError());
              dispatch(clearQrScannerData());
              setInputDisabled(false);
            }}
          />

          <input
            ref={inputRef}
            type="text"
            id="first_name"
            autoFocus
            disabled={inputDisabled}
            onKeyDown={handleChange}
            // onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
            placeholder="Scan the Qr"
            required
          />
        </div>

        <div className="">
          {(showPdfViewer &&
            // ScannerValue.length > 0
            //  &&
            ScannerValue?.url) ||
          ScannerValue?.priority2URl ? (
            <SinglePdfViewer
              pdfUrl={ScannerValue}
              onClose={handleClosePDF}
              fileLocation={fileLocation}
            />
          ) : (
            <>
              <div>
                <marquee class="marq" direction="left" loop="">
                  <div className="text-red-700">
                    <h6>
                      We're still testing this feature. Please check the
                      drawings before you use them.
                    </h6>
                  </div>
                </marquee>
              </div>

              <div className="flex flex-row min-h-screen justify-center items-center">
                <h2>File Not Found.....</h2>
                <h2>Please Scan QR code</h2>
                {/* </div> */}

                {/* <div>
                <h2 className="text-red-700">
                  We're still testing this feature. Please check the drawings
                  before you use them.
                </h2>
              </div> */}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default QrScanner;
