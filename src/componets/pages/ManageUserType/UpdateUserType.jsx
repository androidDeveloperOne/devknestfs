import React, { useState } from 'react';
import ReusableTextInput from '../../../Resuable/ReusableTextInput'
import ReusableModal from '../../../Resuable/ReusableModal';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CustomAlert from '../../../Resuable/ReusableAlertBox';
import { updateUserTypeAction } from '../../../Redux/slices/userTypeSlice';

const UpdateUserType = () => {
    const { item, id } = useParams();

    const [alertVisible, setAlertVisible] = useState(false);
    const [customAlertVisible, setCustomAlertVisible] = useState(false);
    const [errAlertVisible, setErrAlertVisible] = useState(false);

    const { updateUserTypeName ,serverErr} = useSelector((state) => state?.userType);
  
    const dispatch = useDispatch();
    const [userTypeName, setUserTypeName] = useState(item);
    const navigate = useNavigate();



    function handleSave() {
        if (userTypeName.trim() !== '') {
         

            dispatch(updateUserTypeAction({ id, userTypeName }))
                .then((resultAction) => {
                    if (updateUserTypeAction.fulfilled.match(resultAction)) {
                        setCustomAlertVisible(true);
                    
                    } else if (updateUserTypeAction.rejected.match(resultAction)) {
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
                heading={updateUserTypeName}
                visible={customAlertVisible}
                setVisible={(isVisible) => setCustomAlertVisible(isVisible)}
                title2={"OK"}
                showNo={true}
                onclickClose={() => {
                    setCustomAlertVisible(false)
                    navigate('/manageUserType')

                }}

            />
            <CustomAlert
                heading={"UserType name cannot be empty"}
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
                isOpen={true}
                onClose={() => navigate('/manageUserType')}
                onSave={handleSave}
                title="Update UserType"
            >
                <ReusableTextInput
                    iconName="FaBriefcase"
                    label={"Please Enter UserType"}
                    // labelfield="userTypeName"
                    action={(value) => setUserTypeName(value)}
                    value={userTypeName}
                    disabled={false}
                />
            </ReusableModal>
        </>
    );
};

export default UpdateUserType;
