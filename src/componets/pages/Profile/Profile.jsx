import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userLogoutAction } from '../../../Redux/slices/UserSlice'
import { useNavigate } from 'react-router-dom'
import ReusableTextInput from '../../../Resuable/ReusableTextInput'
import ResuableIcons from '../../../Resuable/ResuableIcons'
import ReusableButton from '../../../Resuable/ReusableButton'
import { clearSearchQuery } from '../../../Redux/slices/SearchQerySlice'
import { clearQrScannerData } from '../../../Redux/slices/QrScannerSlice'
import CustomAlert from '../../../Resuable/ReusableAlertBox'

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const data = useSelector(state => state?.auth?.userdata);
  const [deleteModalVisible,setDeleteModalVisible] = useState(false);
  const handleLogout = async () => {
    dispatch(userLogoutAction())
    if (!data?.token) {
      navigate(`/Login`,)
    }
  }
  useEffect(() => {
    localStorage.setItem("disable",JSON.stringify(true));
    dispatch(clearQrScannerData())

    sessionStorage.removeItem("pdfdata");

    sessionStorage.removeItem("selectedPdfUrl");
    dispatch(clearSearchQuery());
    localStorage.setItem("disable",JSON.stringify(true));
  }, []);
  return (
    <div className={`flex-wrap content-center self-center flex flex-col items-center mt-24 `}>
      <div className='flex-wrap content-center bg-white self-center flex flex-col items-center shadow-2xl rounded-md pb-14 px-14'>
      <div className='self-end -mr-10 mt-2 cursor-pointer' onClick={() => navigate('/')}>
                  <ResuableIcons icon={"IoMdClose"} size={25} color={"red"} />
                </div>
        <div>
          <ResuableIcons icon={"FaUserCircle"} size={80} color={"#1f51a6"} />
        </div>
        <div>
          <h5>{data?.firstName}</h5>
    
        </div>

        <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 py-14 auto-cols-max '>
        <ReusableTextInput
          iconName={"FaUserCircle"}
          label={'First Name'}
          disabled={true}
          value={data?.firstName}
          width={true}
        />
          <ReusableTextInput
          iconName={"FaUserCircle"}
          label={'Last Name'}
          disabled={true}
          value={data?.lastName}
          width={true}
        />
  
        <ReusableTextInput
          iconName={"FaPhoneAlt"}
          label={'Mobile'}
          disabled={true}
          value={data?.mobile}
          width={true}
        />
        <ReusableTextInput
          iconName={"IoMail"}
          label={'Email'}
          disabled={true}
          value={data?.email}
          width={true}
        />
        <ReusableTextInput
          iconName={"FaBriefcase"}
          label={'Department'}
          disabled={true}
          value={data?.department}
          width={true}
        />
        <ReusableTextInput
          iconName={"FaUsers"}
          label={'User Type'}
          disabled={true}
          value={data?.userType}
          width={true}
        />
        </div>
        <ReusableButton title={"LOGOUT"} onClick={()=>{setDeleteModalVisible(true)}}/>
      </div>
      <CustomAlert
              heading={"Are you sure you want to logout?"}
              visible={deleteModalVisible}
              setVisible={(isVisible) => setDeleteModalVisible(isVisible)}
              action={() => handleLogout()}
              showOk={true}
              showNo={true}
              title="Logout"
              onclickClose={() => setDeleteModalVisible(false)}
            />
    </div>
  )
}

export default Profile






