import React, { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import ResuableIcons from "./ResuableIcons";
import { useLocation, useNavigate } from "react-router-dom";
const PDFViewer = ({ pdfUrl, selectedPdfUrl, onClose }) => {
  const [selectedPdfIndex, setSelectedPdfIndex] = useState(
    sessionStorage.getItem("selectedPdfIndex") !== null
      ? parseInt(sessionStorage.getItem("selectedPdfIndex"))
      : 0
  );

  const location = useLocation();
  // const navigate = useNavigate();
  const filterPdfUrl = pdfUrl?.filter((item) => item.url);

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  const [pdfdata, setPdfdata] = useState(
    // filterPdfUrl.map(item => ({
    //   ...item,
    //   // loading: true,
    //   loadingProgress: 0,
    // })),
    []
  );

  console.log("selectedPdfIndex", selectedPdfIndex);
  console.log("pdfdata", pdfdata);
  console.log("selectedPdfUrl", selectedPdfUrl);
  // useEffect(() => {
  //   const storedIndex = localStorage.getItem("selectedPdfIndex");

  //   console.log("storedIndex",storedIndex);
  //   if (storedIndex !== null ) {
  //     const parsedIndex = parseInt(storedIndex);
  //     setSelectedPdfIndex(parsedIndex);
  //    }
  // }, []);
  useEffect(() => {
    const storedPdfData = sessionStorage.getItem("pdfdata");
    if (storedPdfData) {
      setPdfdata(JSON.parse(storedPdfData));
    }
  }, []);
  useEffect(() => {
    if (pdfdata.length === 0 && filterPdfUrl.length > 0) {
      setPdfdata(filterPdfUrl);
      sessionStorage.setItem("pdfdata", JSON.stringify(filterPdfUrl));
    }
  }, [filterPdfUrl]);

  const handlePrevoiusClick = () => {
    if (selectedPdfIndex > 0) {
      const newIndex = selectedPdfIndex - 1;
      setSelectedPdfIndex(newIndex);
      sessionStorage.setItem("selectedPdfIndex", JSON.stringify(newIndex));

      // updatePathname(selectedPdfIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (selectedPdfIndex < filterPdfUrl.length - 1) {
      const newIndex = selectedPdfIndex + 1;
      setSelectedPdfIndex(newIndex);
      sessionStorage.setItem("selectedPdfIndex", JSON.stringify(newIndex));
      // updatePathname(selectedPdfIndex + 1);
    }
  };

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo(0, 0);
    };

    if (selectedPdfIndex || selectedPdfIndex === 0) {
      handleScrollToTop();
    }
  }, [selectedPdfIndex]);

  const handleClosePdf = () => {
    if (onClose) {
      onClose();
    }
    setSelectedPdfIndex(0);
    sessionStorage.removeItem("selectedPdfIndex");
    sessionStorage.removeItem("pdfdata");
    // localStorage.setItem("pdfdata", JSON.stringify(filterPdfUrl));
    let newPathname = location.pathname.replace(/\/[^/]+\.pdf$/, " ");
    localStorage.setItem("newPathname", JSON.stringify(newPathname));
    // navigate(newPathname);
  };

  return (
    <>
      <div className="grid ">
        <div className="col-span-12">
          <div className="mt-2.5">
            <h6 className="text-center font-bold  ">
              {pdfdata[selectedPdfIndex]?.name}
            </h6>
          </div>
          <div className="fixed left-1 mt-80 ">
            <button
              className="bg-[#1f51a6] rounded-full left-10  "
              onClick={handlePrevoiusClick}
            >
              <div className="my-4 px-4">
                <ResuableIcons icon="GrPrevious" color="white" />
              </div>
            </button>
          </div>

          <div className="fixed right-1  mt-80 ">
            <button
              className="bg-[#1f51a6] rounded-full "
              onClick={handleNextClick}
            >
              <div className="my-4 px-4  ">
                <ResuableIcons icon="GrNext" color="white" />
              </div>
            </button>
          </div>

          <div className="fixed right-1 mt-16 ">
            <button
              className="bg-[#1f51a6] rounded-full "
              onClick={handleClosePdf}
            >
              <div className="my-4 px-4  ">
                <ResuableIcons icon="GrFormClose" color="white" />
              </div>
            </button>
          </div>
          <iframe
            src={pdfdata[selectedPdfIndex]?.url}
            frameborder="0"
            width="100%"
            height={1200}
            key={pdfdata[selectedPdfIndex]?.url}
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default PDFViewer;
