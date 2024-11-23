import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const DateSelect = ({ onStartChange, onEndChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  console.log("startDate", startDate);

  const handleStartChange = (date) => {
    setStartDate(date);
    onStartChange(date);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
    onEndChange(date);
  };

  return (
    <>
      <div className="flex  justify-between px-2">
        <div className="px-2">
          <small>From</small>
          <DatePicker
            showIcon
            className="date-input"
            selected={startDate}
            onChange={handleStartChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="dd-MM-yyyy"
            placeholderText="SelectDate"
          />
        </div>
        <div>
          <small>To</small>
          <DatePicker
            showIcon
            className="date-input"
            selected={endDate}
            onChange={handleEndChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="dd-MM-yyyy"
            placeholderText="SelectDate"
          />
        </div>
      </div>
    </>
  );
};

export default DateSelect;
