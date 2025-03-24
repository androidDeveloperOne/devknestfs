import React, { useState } from 'react';
import ReusableTextInput from '../../../Resuable/ReusableTextInput'
import ReusableModal from '../../../Resuable/ReusableModal';
import { useNavigate, useParams } from 'react-router-dom';
import { updateDeptAction } from '../../../Redux/slices/deptSlice';
import { useDispatch, useSelector } from 'react-redux';
import CustomAlert from '../../../Resuable/ReusableAlertBox';

const UpdateDepartment = () => {
    const { item, id } = useParams();
    const [alertVisible, setAlertVisible] = useState(false);
    const [customAlertVisible, setCustomAlertVisible] = useState(false);
    const [errAlertVisible, setErrAlertVisible] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const { updateDeptData, serverErr } = useSelector((state) => state?.dept);
    const dispatch = useDispatch();
    const [deptName, setDeptName] = useState(item);
    const navigate = useNavigate();



    function handleSave() {
        if (deptName.trim() !== '') {
            dispatch(updateDeptAction({ id, deptName }))
                .then((resultAction) => {
                    if (updateDeptAction.fulfilled.match(resultAction)) {
                        setCustomAlertVisible(true);
                        setShowModal(false);

                    } else if (updateDeptAction.rejected.match(resultAction)) {

                        setErrAlertVisible(true);

                    }
                });
        } else {
            setAlertVisible(true);

        }
    }
    return (
        <>
            <CustomAlert
                heading={updateDeptData}
                visible={customAlertVisible}
                setVisible={(isVisible) => setCustomAlertVisible(isVisible)}
                title2={"OK"}
                showNo={true}
                onclickClose={() => {
                    setCustomAlertVisible(false)
                    navigate('/manageDepartments')

                }}

            />
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
            {showModal && (
                <ReusableModal
                    isOpen={true}
                    onClose={() => navigate('/manageDepartments')}
                    onSave={handleSave}
                    title="Update Department"
                >
                    <ReusableTextInput
                        iconName="FaBriefcase"
                        label={"Please Enter department name"}
                        labelfield="departmentName"
                        action={(value) => setDeptName(value)}
                        value={deptName}
                        disabled={false}
                    />
                </ReusableModal>
            )}
        </>
    );
};

export default UpdateDepartment;
