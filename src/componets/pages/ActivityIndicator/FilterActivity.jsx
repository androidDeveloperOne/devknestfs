import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetActions,
  GetCSVfile,
  GetFilterActivites,
  GetProjectActivity,
  clearActivityData,
} from "../../../Redux/slices/ActivityCheck";
import DateSelect from "./DatePicker";


const FilterActivity = ({ isdownloading }) => {
  const { filterActivity, getAction, projectactivity, filterloading } =
    useSelector((state) => state?.activityData);
  console.log("activityloading", filterloading);
  // console.log("getAction ", getAction);
  const [selectedValue, setSelectedValue] = useState(null);

  console.log("selectedValue", selectedValue);
  const [actionValue, setActionValue] = useState(null);
  console.log(" getAction", actionValue);
  const [projectValue, setProjectValue] = useState(null);

  console.log(" projectValue", projectValue);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedValueChanges, setSelectedValueChanges] = useState(0);

  const [selectedProjectChanges, setProjectValueChanges] = useState(0);
  console.log(" selectedEndDate", selectedEndDate);
  const dispatch = useDispatch();
  const onOptionChangeHandler = (e) => {
    const selectedValue = e.target.value;
    setSelectedValueChanges(selectedValueChanges + 1);
    setSelectedValue(selectedValue);
    setProjectValue(null);
    if (selectedValueChanges >= 1) {
      setActionValue(null);
    }

    dispatch(GetActions({ name: selectedValue }));
  };

  const onActionChangeHandler = (e) => {
    setProjectValueChanges(selectedProjectChanges +1)

    if (selectedProjectChanges) {
      setActionValue(null);
    }
    let seletedAction = e.target.value;
    console.log("seletedAction", seletedAction);
    setActionValue(seletedAction);
  };

  const onProjectChangeHandler = (e) => {
    let selectedProject = e.target.value;
    // setProjectValueChanges
    setProjectValue(selectedProject);
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };
  const handleDownload = () => {
    if (selectedValue === "Date") {
      if (selectedStartDate === null || selectedEndDate === null) {
        window.alert("Please choose both start and end dates");
      } else {
        dispatch(
          GetCSVfile({
            Name: selectedValue,
            action: actionValue,
            project: projectValue,
            startDate: selectedStartDate,
            endDate: selectedEndDate,
          })
        );
      }
    } else if (selectedValue === "All") {
      dispatch(
        GetCSVfile({
          Name: selectedValue,
          action: actionValue,
          project: projectValue,
          startDate: selectedStartDate,
          endDate: selectedEndDate,
        })
      );
    } else {
      if (selectedValue === null || actionValue === null) {
        window.alert("Please choose one option");
      } else if (selectedValue === "Year" && projectValue === null) {
        window.alert("Please choose a project");
      } else {
        dispatch(
          GetCSVfile({
            Name: selectedValue,
            action: actionValue,
            project: projectValue,
            startDate: selectedStartDate,
            endDate: selectedEndDate,
          })
        );
      }
    }
  };
  

  useEffect(() => {
    if (selectedValue == "Year") {
      dispatch(GetProjectActivity({ name: actionValue }));
    }
  }, [dispatch, selectedValue, actionValue]);

  console.log(" filterActivityrr", filterActivity);

  return (
    <div className="-z-99">
      <h5>Get Activity</h5>

      <select
        className="border-slate-600  border-1 my-2"
        onChange={onOptionChangeHandler}
        value={selectedValue}
      >
        {!selectedValue && <option>Please choose one option</option>}
        {filterActivity?.map((item, index) => {
          return <option key={index}>{item}</option>;
        })}
      </select>
      <div className="">
        {selectedValue !== "Date" &&
          selectedValue !== "All" &&
          selectedValue !== "Please choose one option" &&
          getAction.length > 0 && (
            <div className="">
              <select
                className="border-slate-600  border-1 my-2"
                onChange={onActionChangeHandler}
                value={actionValue}
              >
                {!actionValue && !projectValue && <option>Please choose one option</option>}
                {getAction?.map((item, index) => {
                  return (
                    <option className="" key={index}>
                      {item}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
      </div>

      <div className="">
        {selectedValue === "Year" && projectactivity?.length > 0 && (
          <div className=" ">
            <select
              className="border-slate-600  border-1 my-2"
              onChange={onProjectChangeHandler}
              value={projectValue}
            >
              {/* Render "Please choose one option" only if no option is selected */}
              {!projectValue && <option>Please choose one option</option>}
              {projectactivity?.map((item, index) => {
                return (
                  <option className="" key={index}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>
      {selectedValue === "Date" && (
        <DateSelect
          onStartChange={handleStartDateChange}
          onEndChange={handleEndDateChange}
        />
      )}

      <div className="my-2">
        <button className="bg-[#1f51a6] rounded-xl" onClick={handleDownload}>
          <small className="text-white  px-2">Download</small>
        </button>
      </div>
    </div>
  );
};

export default FilterActivity;
