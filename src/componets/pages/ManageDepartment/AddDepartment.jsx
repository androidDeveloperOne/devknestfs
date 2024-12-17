import React, { useState } from 'react';
import ReusableTextInput from '../../../Resuable/ReusableTextInput'
import Fab from '../../../Resuable/Fab';
import { useDispatch, useSelector } from 'react-redux';
import { addDeptAction, clearDeleteData } from '../../../Redux/slices/deptSlice';
import ReusableModal from '../../../Resuable/ReusableModal';
import CustomAlert from '../../../Resuable/ReusableAlertBox';
import { useNavigate } from 'react-router-dom';
const AddDepartment = () => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [deptName, setDeptName] = useState('');
    const [customAlertVisible, setCustomAlertVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [errAlertVisible, setErrAlertVisible] = useState(false);

    const { user, serverErr } = useSelector((state) => state?.dept);
    const navigate = useNavigate();
    const toggleModal = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setDeptName('');
        }
    };

    function handleSave() {
        if (deptName.trim() !== '') {

            dispatch(clearDeleteData())
            setDeptName('');
            dispatch(addDeptAction(deptName))
                .then((resultAction) => {
                    if (addDeptAction.fulfilled.match(resultAction)) {
                        setIsOpen(!isOpen)
                        setCustomAlertVisible(true);
                      
                        
                       
                    } else if (addDeptAction.rejected.match(resultAction)) {
                        // Handle error if needed
                        setErrAlertVisible(true);

                    }
                });
        } else {
            setAlertVisible(true);

        }
    }
    return (
        <>
            <div onClick={toggleModal} >
                <Fab />
            </div>
            {/* ........................DepartmentAddeddSuccessMsg......................*/}
            <CustomAlert
                heading={user}
                visible={customAlertVisible}
                setVisible={(isVisible) => setCustomAlertVisible(isVisible)}
                title2={"OK"}
                showNo={true}
                onclickClose={() => {
                    setCustomAlertVisible(false)
                    
                }}

            />
            {/* ........................errorMsg......................*/}
            <CustomAlert
                heading={"Department name cannot be empty"}
                visible={alertVisible}
                setVisible={(isVisible) => setAlertVisible(isVisible)}
                title2={"OK"}
                showNo={true}
                onclickClose={() => setAlertVisible(false)}

            />
            {/* .........................ServerErrAlert.................... */}
            <CustomAlert
                heading={serverErr}
                visible={errAlertVisible}
                setVisible={(isVisible) => setErrAlertVisible(isVisible)}
                title2={"OK"}
                showNo={true}
                onclickClose={() => setErrAlertVisible(false)}

            />
            <ReusableModal
                isOpen={isOpen}
                onClose={toggleModal}
                onSave={handleSave}
                title="Add Department"

            >
                <ReusableTextInput
                    iconName="FaBriefcase"
                    label={"Please Enter department name"}
                    labelfield="Department"
                    id="name"
                    action={(value) => setDeptName(value)}
                    value={deptName}
                    disabled={false}
                />
            </ReusableModal>
        </>
    );
};

export default AddDepartment;
