import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { QrScanerData } from "../../../Redux/slices/QrScannerSlice";
const ScannerInput = () => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();

    const interval = setInterval(() => {
      inputRef.current.focus();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const handleChange = (e) => {
    const numericRegex = /^[0-9]+$/;
    let pdfValue = e.target.value;
    if (e.key === "Enter") {
      e.target.value = "";
      if (!numericRegex.test(pdfValue)) {
        dispatch(QrScanerData(pdfValue));
        // setValue(e.target.value);
      } else {
        alert("Please scan Qr code only");
      }
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        id="first_name"
        autoFocus
        onKeyDown={handleChange}
        // onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="Scan the Qr"
        required
      />
    </div>
  );
};

export default ScannerInput;
