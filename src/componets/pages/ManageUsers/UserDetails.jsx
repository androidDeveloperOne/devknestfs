import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { clearError, deleteUser, manageUserTypes, updateUser } from '../../../Redux/slices/manageUser';
import ReusableTextInput from '../../../Resuable/ReusableTextInput';
import ReusableDropdown from '../../../Resuable/ReusableDropdown';
import ReusableButton from '../../../Resuable/ReusableButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import ResuableIcons from '../../../Resuable/ResuableIcons';
import { manageDeptAction } from '../../../Redux/slices/deptSlice';
import CustomAlert from '../../../Resuable/ReusableAlertBox';
import AdminResetPassword from './AdminResetPassword';

function UserDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state?.user;
  const userTypeData = useSelector(state => state?.user?.userType)
  const deptData = useSelector(state => state?.dept?.deptData);
  const { deleteData, updateUserData, serverErr } = useSelector(state => state?.user)
  const [disable, setdisable] = useState(true);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isResetPassModalVisible, setResetPassModalVisible] = useState(false);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customVisible, setCustomVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { userType } = useSelector((state) => state?.auth?.userdata);
  const [filteredUserTypeData, setFilteredUserTypeData] = useState([]);
  const [allFormValues, setAllFormValues] = useState(null);
  const getFirstErrorMessage = () => {
    if (serverErr?.Email) {
      return serverErr?.Email[0];
    } else if (serverErr?.EmployeeId) {
      return serverErr?.EmployeeId[0];
    }
    else if (serverErr?.Mobile) {
      return serverErr?.Mobile[0];
    }
    else if (serverErr?.FirstName) {
      return serverErr?.FirstName;
    } else if (serverErr?.LastName) {
      return serverErr?.LastName;
    }
    else if (serverErr) {
      return serverErr;
    }
    else {
      return null;
    }
  };
  const phoneRegExp = /^([+]\d{2})?\d{10}$/;
  const employeeIdRegExp = /^(KA|KV)\d{4,}$/;
  const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required')
      .matches(emailRegExp, 'email is not valid'),
    mobile: Yup.string()
      // .required('Required')
      .matches(phoneRegExp, 'Mobile number is not valid'),
    firstName: Yup.string()
      .required('Reruired')
      .min(2, 'Too Short!')
      .max(50, 'Too Long!'),
    lastName: Yup.string()
      .required('Required')
      .min(2, 'Too Short!')
      .max(50, 'Too Long!'),
    department: Yup.string().required('Required'),
    userType: Yup.string().required('Required'),
    employeeId: Yup.string()
      .matches(employeeIdRegExp, 'employeeId is not valid'),
  });
  useEffect(() => {
    dispatch(manageUserTypes());
    dispatch(manageDeptAction());

  }, [dispatch]);
  useEffect(() => {
    const disableHandle = localStorage.getItem("disable");
    console.log("disableHandle---------------", disableHandle);
    if (disableHandle !== null) {
      setdisable(JSON.parse(disableHandle));
    } else {
      setdisable(false); 
      localStorage.setItem("disable", JSON.stringify(false));
    }
    if (userType === "Plant Admin") {
      const filteredData = userTypeData?.filter(
        userType => userType?.name === "Group Admin" || userType?.name === "Operational"
      );
      setFilteredUserTypeData(filteredData);
    } else if (userType === "Group Admin") {
      const filteredData = userTypeData?.filter(
        userType => userType?.name === "Operational"
      );
      setFilteredUserTypeData(filteredData);
    } else {
      setFilteredUserTypeData(userTypeData);
    }
  }, [userType, userTypeData]);


  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  return (
    <div className='grid px-3 '>

      <div className='mx-4 col-span-12'>
        <Formik
          initialValues={{
            userId: user?.userId,
            mobile: user?.mobile || '',
            email: user?.email || '',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            department: user?.department?.id || '',
            userType: user?.userType?.id || '',
            employeeId: user?.employeeId || '',
            isActive: user?.isActive
          }}
          validationSchema={validationSchema}

          onSubmit={(values, { setSubmitting }) => {
            try {
              dispatch(updateUser(values))
                .then((resultAction) => {
                  if (updateUser.fulfilled.match(resultAction)) {
                    dispatch(clearError());
                    localStorage.setItem(
                      "disable",
                      JSON.stringify(true)
                    );
                    //localStorage.removeItem("disable");
                    setCustomVisible(true);
                  }
                })
                .catch((error) => {

                })
                .finally(() => {
                  setSubmitting(false);
                  if (serverErr) {
                    setCustomAlertVisible(true);
                  }
                });
            } catch (error) {
              // Handle any synchronous error here
            }
          }}

        >

          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue

          }) => (
            <div className={`flex-wrap content-center self-center flex flex-col items-center mt-24 `}>

              <div className='flex-wrap content-center self-center bg-white flex flex-col items-center shadow-2xl rounded-md pb-14 px-14 '>
                <div className='self-end -mr-10 mt-2 cursor-pointer' onClick={() => {
                  navigate('/manageUsers')
                  localStorage.setItem(
                    "disable",
                    JSON.stringify(true)
                  );
                }}>
                  <ResuableIcons icon={"IoMdClose"} size={25} color={"red"} />
                </div>
                <div>
                  <ResuableIcons icon={"FaUserCircle"} size={60} color={"#1f51a6"} />
                </div>
                <div>
                  <div><h5>{"User Details"}</h5></div>
                </div>
                {/* <CustomAlert visible={isDeleteModalVisible} setVisible={setDeleteModalVisible} deleteText={'User'} showNo={true} showOk={true}
                  heading={"Are you sure you want to delete?"}
                  onclickClose={() => setDeleteModalVisible(false)}
                  action={() => {
                    try {
                      dispatch(deleteUser(user?.userId))
                        .then((resultAction) => {
                          if (deleteUser.fulfilled.match(resultAction)) {
                            setAlertVisible(true);
                          }
                          else if (deleteUser.rejected.match(resultAction)) {
                            alert("Something went wrong!!!!!")

                          }

                        })

                        .catch((error) => {

                        })
                        .finally(() => {

                        });
                    } catch (error) {
                    }

                  }}

                /> */}
                <CustomAlert visible={isDeleteModalVisible} setVisible={setDeleteModalVisible} deleteText={'User'} showNo={true} showOk={true}
                  heading={`Are you sure you want to make this user ${values.isActive ? 'Inactive' : 'Active'}?`}
                  onclickClose={() => setDeleteModalVisible(false)}
                  title={values.isActive ? 'Inactive' : 'Active'}
                  action={(values, { setSubmitting }) => {
                    try {

                      const updatedValues = { ...allFormValues, isActive: !allFormValues.isActive };
                      console.log("valuesinnew", updatedValues);
                      dispatch(updateUser(updatedValues))
                        .then((resultAction) => {
                          if (updateUser.fulfilled.match(resultAction)) {
                            localStorage.setItem(
                              "disable",
                              JSON.stringify(true)
                            );
                            setAlertVisible(true);
                          } else if (updateUser.rejected.match(resultAction)) {

                            alert("Something went wrong!!!!!", serverErr);
                          }
                        })
                        .catch((error) => {
                          // Handle error
                        })
                        .finally(() => {
                          // Perform any final actions
                        });
                    } catch (error) {
                    }

                  }}

                />
                {/* .........................DeletionSuccessMessageAlert.................... */}
                <CustomAlert
                  heading={"Status changed successfully"}
                  visible={alertVisible}
                  setVisible={(isVisible) => setAlertVisible(isVisible)}
                  title2={"OK"}
                  showNo={true}
                  onclickClose={() => navigate('/manageUsers')}

                />
                {/* .........................UpdateSuccessMessageAlert.................... */}
                <CustomAlert
                  heading={updateUserData}
                  visible={customVisible}
                  setVisible={(isVisible) => setCustomVisible(isVisible)}
                  title2={"OK"}
                  showNo={true}
                  onclickClose={() => navigate('/manageUsers')}

                />
                {/* ........................serverErrMsg......................*/}
                {serverErr ? <CustomAlert
                  heading={getFirstErrorMessage()}
                  visible={customAlertVisible}
                  setVisible={() => setCustomAlertVisible(false)}
                  onclickClose={() => setCustomAlertVisible(false)}
                  title2={"Ok"}
                  showNo={true}

                /> : null
                }


                <form onSubmit={handleSubmit}>
                  <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 py-14 auto-cols-max '>
                    <div>
                      <ReusableTextInput
                        iconName={"FaUserCircle"}
                        labelfield={'First Name'}
                        id={'firstName'}
                        value={values?.firstName?.replace(/\s/g, '')}
                        disabled={disable}
                        action={handleChange('firstName')}
                        onBlur={handleBlur('firstName')}

                      />
                      {errors.firstName ? <h6 className='text-red-500 mx-2'>{errors.firstName}</h6> : null}

                    </div>
                    <div>
                      <ReusableTextInput
                        iconName={"FaUserCircle"}
                        label={'Last Name'}
                        id={'lastName'}
                        disabled={disable}
                        value={values?.lastName?.replace(/\s/g, '')}
                        action={handleChange('lastName')}
                        onBlur={handleBlur('lastName')}

                      />
                      {errors.lastName ? <h6 className='text-red-500 mx-2'>{errors.lastName}</h6> : null}

                    </div>

                    <div>
                      <ReusableTextInput
                        iconName={"FaPhoneAlt"}
                        label={'Mobile'}
                        id={'mobile'}
                        value={values?.mobile}
                        disabled={disable}
                        maxLength={10}
                        action={handleChange('mobile')}
                        onBlur={handleBlur('mobile')} />
                      {/* {errors.mobile ? <h6 className='text-red-500 mx-2'>{errors.mobile}</h6> : null} */}
                    </div>
                    <div>
                      <ReusableTextInput
                        iconName={"PiIdentificationBadgeFill"}
                        label={'EmployeeId'}
                        id={'employeeId'}
                        value={values.employeeId}
                        disabled={disable}
                        action={handleChange('employeeId')}
                        onBlur={handleBlur('employeeId')} />
                      {errors.employeeId ? <h6 className='text-red-500 mx-2'>{errors.employeeId}</h6> : null}

                    </div>

                    <div>
                      <ReusableTextInput
                        iconName={"IoMail"}
                        label={'Email'}
                        id={'email'}
                        value={values.email}
                        disabled={disable}
                        action={handleChange('email')}
                        onBlur={handleBlur('email')} />
                      {errors.email ? <h6 className='text-red-500 mx-2'>{errors.email}</h6> : null}

                    </div>
                    <div>
                      <ReusableTextInput
                        iconName={"FaRegCalendarAlt"}
                        label={'Date Created'}
                        value={formatDate(user.dateCreated)}
                        disabled={true}

                      />
                    </div>
                    <div>
                      <ReusableDropdown
                        iconName={"FaUsers"}

                        placeholder={'User Type'}
                        data={filteredUserTypeData}
                        labelfield={'name'}
                        valuefield={'id'}
                        name={'userType'}

                        disabled={disable}
                        value={values.userType}
                        onChange={e => setFieldValue('userType', e.target.value)}
                      />
                      {errors.userType ? <h6 className='text-red-500 mx-2'>{errors.userType}</h6> : null}

                    </div>
                    <div>

                      <ReusableDropdown
                        iconName={"FaBriefcase"}
                        placeholder={'Department'}
                        disabled={disable}
                        data={deptData}
                        labelfield={'departmentName'}
                        valuefield={'id'}
                        name={'department'}
                        value={values.department}
                        onChange={e => setFieldValue('department', e.target.value)}
                      />
                      {errors.department ? <h6 className='text-red-500 mx-2'>{errors.department}</h6> : null}

                    </div>


                    {/* 
                    <div> <ReusableDropdown
                      iconName={"FaCloudUploadAlt"}
                      name={'uploadAccess'}
                      disabled={disable}
                      data={accessData}
                      labelfield={'label'}
                      valuefield={'value'}
                      value={values.uploadAccess}
                      onChange={(e) => {
                        const booleanValue = JSON.parse(e.target.value);
                        setFieldValue('uploadAccess', booleanValue);
                      }}
                    />

                      {errors.uploadAccess ? <h6 className='text-red-500 mx-2'>{errors.uploadAccess}</h6> : null}</div>


                    <div>
                      <ReusableDropdown
                        iconName={"FaTrashAlt"}
                        disabled={disable}
                        data={accessData}
                        name={'deleteAccess'}
                        labelfield={'label'}
                        valuefield={'value'}
                        value={values.deleteAccess}
                        onChange={(e) => {
                          const booleanValue = JSON.parse(e.target.value);
                          setFieldValue('deleteAccess', booleanValue);
                        }}
                      />
                      {errors.deleteAccess ? <h6 className='text-red-500 mx-2'>{errors.deleteAccess}</h6> : null}
                    </div> */}



                  </div>
                  <div className='flex flex-row justify-evenly content-around w-100'>
                    {disable ? <div className={`bg-[#1f51a6] flex justify-content-center relative font-medium rounded-md py-2 text-sm md:text-sm sm:text-sm lg:text-base  hover:bg-blue-500 transition-colors    w-20 md:w-24 lg:w-32 sm:w-16 text-white cursor-pointer ${isMobile && "w-16"}`}
                      onClick={() => {
                        setdisable(false)
                        localStorage.setItem(
                          "disable",
                          JSON.stringify(false)
                        );
                      }} >Edit</div>
                      : <ReusableButton type="submit" title={"Save"} />
                    }

                    <div className='sm:ml-4 xs:ml-4'> <ReusableButton title={"Reset Password"} type="button"
                      className={`flex justify-content-center relative font-medium rounded-md py-2 mx-2 text-sm md:text-sm sm:text-sm lg:text-base  hover:bg-blue-500 transition-colors w-32 md:w-32 lg:w-32  text-white cursor-pointer ${isMobile && "w-24"} ${!disable ? "bg-blue-200" : "bg-[#1f51a6]" } `}
                      onClick={() => {
                        if (!disable) return;
                        setResetPassModalVisible(true)

                      }} />
                    </div>
                    <div className='sm:ml-4 xs:ml-4'> <ReusableButton title={values.isActive ? 'Active' : 'Inactive'} type="button"
                      className={`relative text-white font-medium rounded-md py-2 text-sm md:text-sm sm:text-sm lg:text-base  hover:bg-red-400 transition-colors    w-20 md:w-24 lg:w-32 sm:w-16 ${isMobile && " w-16"} ${!disable ? "bg-red-200" :"bg-red-600 "}`}
                      onClick={() => {
                        if (!disable) return;
                        setAllFormValues(values); // Set all form values when the button is clicked
                        setDeleteModalVisible(true);
            
                      }} />

                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Formik>
        <AdminResetPassword
          modalVisible={isResetPassModalVisible}
          toggleModal={setResetPassModalVisible}
          data={user} />
      </div>
    </div>
  );
}

export default UserDetails;













































