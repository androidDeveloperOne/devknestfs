import { useSelector } from 'react-redux'
import { NavLink, Outlet } from 'react-router-dom'
import NavbarContainer from '../navbar/NavbarContainer'
import Login from '../componets/pages/Auth/Login'

const ProtectedRoute = () => {
  const { userdata } = useSelector((state) => state?.auth)
 
 
  if (!userdata?.token) {
    return (
      <div className='unauthorized'>

        <Login/>
      </div>
    )
  }

  // returns child route elements
  return (
      <>
    <NavbarContainer />
    <div className='protected-content'>
        {userdata?.token ? (
          // If user is authenticated, render child route elements
          <Outlet />
        ) : (
          // If user is not authenticated, show login form
          <div className='unauthorized'>
            <Login />
          </div>
        )}
      </div>
      </>
    )
}
export default ProtectedRoute