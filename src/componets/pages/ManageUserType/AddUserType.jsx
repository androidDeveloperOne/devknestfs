import React, { useState } from 'react';
import ReusableTextInput from '../../../Resuable/ReusableTextInput'
import Fab from '../../../Resuable/Fab';
import { useDispatch, useSelector } from 'react-redux';
import ReusableModal from '../../../Resuable/ReusableModal';
import { addUserTypeAction } from '../../../Redux/slices/userTypeSlice';
import CustomAlert from '../../../Resuable/ReusableAlertBox';
const AddUserType = () => {
    const dispatch = useDispatch();
    const { user,serverErr } = useSelector((state) => state?.userType);
    const [isOpen, setIsOpen] = useState(false);
    const [customAlertVisible, setCustomAlertVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [errAlertVisible, setErrAlertVisible] = useState(false);
    const [userTypeName, setUserTypeName] = useState('');


    const toggleModal = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setUserTypeName('');
        }
    };

    function handleSave() {
        if (userTypeName.trim() !== '') {
            setUserTypeName('');

            dispatch(addUserTypeAction(userTypeName))
                .then((resultAction) => {
                    if (addUserTypeAction.fulfilled.match(resultAction)) {
                        setCustomAlertVisible(true);
                        setIsOpen(!isOpen)
                    
                    } else if (addUserTypeAction.rejected.match(resultAction)) {
                        setErrAlertVisible(true);
                    }
                });
        } else {
            setAlertVisible(true);
       
        }
    }
    return (
        <>
            <div onClick={toggleModal}>
                <Fab />
            </div>
            {/* .........................AddedUserTypeSuccessMessageAlert.................... */}
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
            {/* .........................EmptyAlert.................... */}
            <CustomAlert
                heading={"User type cannot be empty"}
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
                setVisible={(isVisible) =>setErrAlertVisible(isVisible)}
                title2={"OK"}
                showNo={true}
                onclickClose={() => setErrAlertVisible(false)}

            />
            <ReusableModal
                isOpen={isOpen}
                onClose={toggleModal}
                onSave={handleSave}
                title="Add UserType"
            >
                <ReusableTextInput
                    iconName="FaUsers"
                    label={"Please Enter UserType"}
                    labelfield="UserType"
                    id={'name'}
                    action={(value) => setUserTypeName(value)}
                    value={userTypeName}
                    disabled={false}

                />
            </ReusableModal>
        </>
    );
};

export default AddUserType;

