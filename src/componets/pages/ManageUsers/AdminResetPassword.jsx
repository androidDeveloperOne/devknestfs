// import React, { useState } from 'react';
// import ReusableTextInput from '../../../Resuable/ReusableTextInput';
// import ReusableModal from '../../../Resuable/ReusableModal';
// import { useDispatch, useSelector } from 'react-redux';
// import { adminResetPassword } from '../../../Redux/slices/AdminResetPasswordSlice';
// import CustomAlert from '../../../Resuable/ReusableAlertBox';
// import LoadingScreen from '../../../Resuable/LoadingScreen';

// const AdminResetPassword = ({ toggleModal, modalVisible, data }) => {
//     const dispatch = useDispatch();
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [password, setPassword] = useState('');
//     const [errAlertVisible, setErrAlertVisible] = useState(false);
//     const [customAlertVisible, setCustomAlertVisible] = useState(false);
//     const { adminResetPasswordData, loading } = useSelector((state) => state?.adminResetPassword);

//     function handleSave() {
//         console.log("userId", data?.userId);
//         console.log("password", password);
//         console.log("confirmPassword", confirmPassword);
//         const payload = {
//             userId: data?.userId,
//             password: password,
//             confirmPassword: confirmPassword,
//         };

//         dispatch(adminResetPassword(payload))
//             .then((resultAction) => {
//                 if (adminResetPassword.fulfilled.match(resultAction)) {
//                     setPassword('');
//                     setConfirmPassword('');
//                     setCustomAlertVisible(true);
//                     toggleModal(false);
//                 } else if (adminResetPassword.rejected.match(resultAction)) {

//                 }
//             });
//     }

//     return (
//         <>
//             <CustomAlert
//                 heading={adminResetPasswordData}
//                 visible={customAlertVisible}
//                 setVisible={(isVisible) => setCustomAlertVisible(isVisible)}
//                 title2={"OK"}
//                 showNo={true}
//                 onclickClose={() => setCustomAlertVisible(false)}

//             />
//             <ReusableModal
//                 isOpen={modalVisible}
//                 onClose={() => {
//                     setPassword('');
//                     setConfirmPassword('');
//                     toggleModal(false)
//                 }}
//                 onSave={handleSave}
//                 title="Reset Password"
//             >
//                 <div className='flex flex-col justify-around'>
//                     <div className=''>
//                         <label className="text-base md:text-base text-gray-700 self-start ms-2">
//                             Password
//                         </label>
//                         <ReusableTextInput

//                             label="Password"
//                             id="password"
//                             value={password}
//                             action={(value) => setPassword(value)}
//                         />
//                     </div>
//                     <div className='mt-10'>
//                         <label className="text-base md:text-base text-gray-700 self-start ms-2">
//                             Confirm Password
//                         </label>
//                         <ReusableTextInput

//                             label="Confirm Password"
//                             id="confirmPassword"
//                             value={confirmPassword}
//                             action={(value) => setConfirmPassword(value)}
//                         />
//                     </div>
//                 </div>
//                 {loading && <LoadingScreen loading={loading} />}
//             </ReusableModal>
//         </>
//     );
// };

// export default AdminResetPassword;




import React, { useEffect, useState } from 'react';
import ReusableTextInput from '../../../Resuable/ReusableTextInput';
import ReusableModal from '../../../Resuable/ReusableModal';
import { useDispatch, useSelector } from 'react-redux';
import { adminResetPassword } from '../../../Redux/slices/AdminResetPasswordSlice';
import CustomAlert from '../../../Resuable/ReusableAlertBox';
import LoadingScreen from '../../../Resuable/LoadingScreen';
import { Formik, resetForm } from 'formik';
import * as Yup from 'yup';

const AdminResetPassword = ({ toggleModal, modalVisible, data }) => {
    const dispatch = useDispatch();
    const [customAlertVisible, setCustomAlertVisible] = useState(false);
    const { adminResetPasswordData, loading } = useSelector((state) => state?.adminResetPassword);



    const passwordRegExp = /^(?=.*[a-z].*[a-z].*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\|[\]{};:'",.<>/?]).{9,15}$/;
    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required('Password is Required')
            .matches(passwordRegExp, 'Password:9-15chars, 3 lowercase, 1 uppercase, 1 digit, 1 special char'),
        confirmPassword: Yup.string()
            .required('Confirm Password is Required')
            .test('passwords-match', 'Passwords must match', function (value) {
                return value === this.parent.password;
            }),
    });

    return (
        <div>
            <Formik
                initialValues={{
                    password: '',
                    confirmPassword: '',

                }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm, setErrors }) => {
                    try {
                        const payload = {
                            userId: data?.userId,
                            password: values?.password,
                            confirmPassword: values?.confirmPassword,
                        };
                        dispatch(adminResetPassword(payload))
                            .then((resultAction) => {
                                if (adminResetPassword.fulfilled.match(resultAction)) {
                                    setCustomAlertVisible(true);
                                    toggleModal(false);
                                    resetForm();

                                }
                            })
                            .catch((error) => {

                            });
                    } catch (error) {

                    }

                }}
            >
                {({
                    values,
                    errors,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    resetForm,
                    setErrors

                }) => (
                    <div>
                        <CustomAlert
                            heading={adminResetPasswordData}
                            visible={customAlertVisible}
                            setVisible={(isVisible) => setCustomAlertVisible(isVisible)}
                            title2={"OK"}
                            showNo={true}
                            onclickClose={() => setCustomAlertVisible(false)}

                        />
                        <form onSubmit={handleSubmit}>
                            <ReusableModal
                                isOpen={modalVisible}
                                onClose={() => {
                                    setErrors({ errors: {} });
                                    toggleModal(false);
                                    resetForm();

                                }}

                                onSave={handleSubmit}
                                title="Reset Password"
                            >
                                <div className='flex flex-col justify-around'>
                                    <div className=''>
                                        <label className="text-base md:text-base text-gray-700 self-start ms-2">
                                            Password
                                        </label>
                                        <ReusableTextInput
                                            maxLength={15}
                                            label="Password"
                                            id="password"
                                            value={values?.password}
                                            action={handleChange('password')}
                                            autoComplete={true}
                                            disableCopyPaste={true}
                                        />
                                        {errors.password ? <h6 className={`text-red-500 mx-2`}>{errors.password}</h6> : null}

                                    </div>
                                    <div className='mt-10'>
                                        <label className="text-base md:text-base text-gray-700 self-start ms-2">
                                            Confirm Password
                                        </label>
                                        <ReusableTextInput
                                            maxLength={15}
                                            label="Confirm Password"
                                            id="confirmPassword"
                                            value={values?.confirmPassword}
                                            action={handleChange('confirmPassword')}
                                            autoComplete={true}
                                            disableCopyPaste={true}
                                        />
                                        {errors.confirmPassword ? <h6 className='text-red-500 mx-2'>{errors.confirmPassword}</h6> : null}

                                    </div>
                                </div>
                                {loading && <LoadingScreen loading={loading} />}
                            </ReusableModal>
                        </form>
                    </div>
                )}
            </Formik>
        </div>
    );
};

export default AdminResetPassword;










