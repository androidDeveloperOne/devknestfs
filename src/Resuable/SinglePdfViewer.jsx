import React, { useEffect, useState } from "react";

import { Document, pdfjs, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import ResuableIcons from "./ResuableIcons";
import { useSelector } from "react-redux";
const SinglePdfViewer = ({ pdfUrl, onClose, fileLocation, isSearch }) => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const [fileLocationView, setFileLocationaView] = useState();

  const [filePriorityPdfTwo, setfilePriorityPdfTwo] = useState();

  const handleClosePdf = () => {
    if (onClose) {
      onClose();
    }

    setFileLocationaView("");
  };

  const [pdfData, setPdfData] = useState(
    localStorage.getItem("pdfSearchData") !== null
      ? parseInt(localStorage.getItem("pdfSearchData"))
      : []
  );

  console.log("pdfDatarr", pdfData);

  useEffect(() => {
    const storedPdfData = localStorage.getItem("pdfSearchData");
    if (storedPdfData) {
      setPdfData(JSON.parse(storedPdfData));
    }
    setPdfData(pdfUrl);
  }, [pdfUrl]);
  useEffect(() => {
    localStorage.setItem("pdfSearchData", JSON.stringify(pdfUrl));

    const pattern = /https:\/\/[^\/]+\/([^?]+)\//;

    const matches = pdfUrl?.url?.match(pattern);

    if (matches && matches.length === 2) {
      const location = matches[1];
      const updataLoaction = decodeURIComponent(location).replace(/\+/g, " ");
      setFileLocationaView(updataLoaction);
    }

    const pdfPriorityTwoUrl = pdfUrl?.priority2URl?.match(pattern);
    if (pdfPriorityTwoUrl && pdfPriorityTwoUrl.length === 2) {
      const location = pdfPriorityTwoUrl[1];
      const updataLoaction = decodeURIComponent(location).replace(/\+/g, " ");
      setfilePriorityPdfTwo(updataLoaction);
    }
  }, [pdfUrl]);

  return (
    <div className="">
      <div className="">
        <div className="fixed right-1  mb-2 mt-16 ">
          <button
            className="bg-[#1f51a6] rounded-full "
            onClick={handleClosePdf}
          >
            <div className="my-3 px-3  ">
              <ResuableIcons icon="GrFormClose" color="white" />
            </div>
          </button>
        </div>
{!isSearch === true? (
  <marquee class="marq" direction="left" loop="">
  <div className="text-red-700">
    <h6>
  
      We're still testing this feature. Please check the drawings before
      you use them.
    </h6>
  </div>
</marquee>
):null}
      
 

        {pdfData?.url && (pdfData?.priority2URl || !pdfData?.priority2URl) && (
          <>
            {!isSearch === true && <p className="text-center">Priority 1</p>}

            <div className="flex justify-around">
              <h6 className="text-center ">
                <span className="font-bold  ">File Name:</span> {pdfData?.name}
              </h6>
              <h6 className="text-center ">
                <span className="font-bold">File Location:</span>{" "}
                {fileLocation || fileLocationView}
              </h6>
            </div>
            <iframe
              src={pdfData?.url}
              style={{ width: "100%", height: 1300 }}
            ></iframe>
          </>
        )}

        {pdfData?.priority2URl && (pdfData?.url || !pdfData?.url) && (
          <>
            {}
            {!isSearch === true && <p className="text-center">Priority 2</p>}

            <div className="flex justify-around">
              <h6 className="text-center ">
                <span className="font-bold  ">File Name:</span>{" "}
                {pdfData?.priority2Name}
              </h6>
              <h6 className="text-center ">
                <span className="font-bold  ">File Location:</span>{" "}
                {filePriorityPdfTwo}
              </h6>
            </div>
            <iframe
              src={pdfData?.priority2URl}
              style={{ width: "100%", height: 1300 }}
            ></iframe>
          </>
        )}

        {pdfData?.priority2URl && !pdfData?.url && (
          <>
            <p className="text-center">Priority 2</p>
            <div className="flex justify-around">
              <h6 className="text-center ">
                <span className="font-bold">File Name:</span>{" "}
                {pdfData?.priority2Name}
              </h6>

              <h6 className="text-center ">
                <span className="font-bold">File Location:</span> {fileLocation}
              </h6>
            </div>
            <iframe
              src={pdfData?.priority2URl}
              style={{ width: "100%", height: 1300 }}
            ></iframe>
          </>
        )}

        {!pdfData?.url && !pdfData?.priority2URl && <p>No PDF available</p>}
      </div>
    </div>
  );
};

export default SinglePdfViewer;
