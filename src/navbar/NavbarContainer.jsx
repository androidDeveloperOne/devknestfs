import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import ResuableIcons from "../Resuable/ResuableIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSearchQuery,
  setSearchQuerya,
} from "../Redux/slices/SearchQerySlice";
import { userLogoutAction } from "../Redux/slices/UserSlice";
import CustomAlert from "../Resuable/ReusableAlertBox";

const NavbarContainer = () => {
  const [showNav, setShowNav] = useState(false);
  const toggleNavItems = () => {
    setShowNav(!showNav);
  };
  const { userType } = useSelector((state) => state?.auth?.userdata);
  const [activeLink, setActiveLink] = useState("");
  const [showNavbar, setShowNavbar] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const dispatch = useDispatch();
  const data = useSelector((state) => state?.auth?.userdata);
  const { userdata } = useSelector((state) => state?.auth);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { searchQuery } = useSelector((state) => state?.searchData);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  console.log("userType::::::::inNav", userType);
  const navigate = useNavigate();
  const searchQueryClear = useSelector((state) => state?.searchData);
  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };
  const handleShowSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  const handleClick = () => {
    localStorage.removeItem("selectedPdfUrl");
    localStorage.removeItem("pdfdata");
  };
  const handleSearch = (e) => {
    const inputValue = e.target.value;

    dispatch(setSearchQuerya(inputValue));
   
  };

  const handleLogout = async () => {
    dispatch(userLogoutAction());

    if (!userdata?.token) {
      navigate(`/Login`);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    const handlePopstate = () => {
      dispatch(clearSearchQuery());
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [dispatch, deleteModalVisible]);
  useEffect(() => {
    const pathname = location.pathname;
    setActiveLink(pathname);
    console.log("pathname====>", pathname);
  }, [location]);
  return (
    <div className="grid lg: lg:grid:cols-6 sm:cols:1  ">
      <nav className="  z-20 backgroundColor-navabar fixed w-full top-0 start-0 border-b">
        <div className="lg:flex md:flex px-1 ">
          <div className=" ms-3 flex justify-between my-1 ">
            <Link class="text-decoration-none " to="" onClick={handleClick}>
              <div className="flex  justify-center my-2 ">
                <img src="/assets/img/knest logo.png" className="img" />
              </div>
            </Link>

            <div className="menu-icon my-2.5 " onClick={handleShowNavbar}>
              <ResuableIcons size={25} icon="alignRight" color="white" />
            </div>
            <CustomAlert
              heading={"Are you sure you want to logout?"}
              visible={deleteModalVisible}
              setVisible={(isVisible) => setDeleteModalVisible(isVisible)}
              action={() => handleLogout()}
              showOk={true}
              showNo={true}
              title="Logout"
              onclickClose={() => {
                setDeleteModalVisible(false);
              }}
            />
            <div
              className={`nav-elements  ms-5 truncate ${
                showNavbar && "active"
              }`}
            >
              <ul className="mt-2" onClick={handleShowNavbar}>
                {userType === "Admin" && (
                  <li className="text-black">
                    <Link to="/manageDepartments">
                      <ResuableIcons
                        size={25}
                        icon="FaBriefcase"
                        color="white"
                        text={"Manage Departments"}
                      />
                    </Link>
                    {activeLink === "/manageDepartments" ||
                    activeLink.startsWith("/deptDetails/") ? (
                      <hr
                        style={{
                          color: "#fff",
                          margin: "0.3rem 0",
                          borderWidth: "2px",
                          opacity: 87,
                        }}
                      />
                    ) : null}
                  </li>
                )}
                {(userType === "Admin" ||
                  userType === "Plant Admin" ||
                  userType === "Group Admin") && (
                  <li className="text-black">
                    <Link to="/manageUsers">
                      <ResuableIcons
                        size={25}
                        icon="FaUserTie"
                        color="white"
                        text={"Manage Users"}
                      />
                    </Link>
                    {activeLink === "/manageUsers" ||
                    activeLink.startsWith("/userDetails/") ? (
                      <hr
                        style={{
                          color: "#fff",
                          margin: "0.3rem 0",
                          borderWidth: "2px",
                          opacity: 87,
                        }}
                      />
                    ) : null}
                  </li>
                )}
                {userType === "Admin" && (
                  <li>
                    <Link to="/manageUserType">
                      <ResuableIcons
                        size={25}
                        icon="FaUsers"
                        color="white"
                        text={"Manage UserType"}
                      />
                    </Link>
                    {activeLink === "/manageUserType" ? (
                      <hr
                        style={{
                          color: "#fff",
                          margin: "0.3rem 0",
                          borderWidth: "2px",
                          opacity: 87,
                        }}
                      />
                    ) : null}
                  </li>
                )}
                <li>
                  <Link to="/profile">
                    <ResuableIcons
                      size={25}
                      icon="FaUserCircle"
                      color="white"
                      text={"Profile"}
                    />
                  </Link>
                  {activeLink === "/profile" ? (
                    <hr
                      style={{
                        color: "#fff",
                        margin: "0.3rem 0",
                        borderWidth: "2px",
                        opacity: 87,
                      }}
                    />
                  ) : null}
                </li>
                {/* {userType === "Admin" && ( */}
                <li className="">
                  <Link to="/qrScanner">
                    <ResuableIcons
                      size={25}
                      icon="FaQrcode"
                      color="white"
                      text={"QrScanner"}
                    />
                  </Link>
                  {activeLink === "/qrScanner" ? (
                    <hr
                      style={{
                        color: "#fff",
                        margin: "0.3rem 0",
                        borderWidth: "2px",
                        opacity: 87,
                      }}
                    />
                  ) : null}
                </li>
                {/* )} */}
              </ul>
            </div>
          </div>
          <div className={`input-area ps-5 ${isMobile ? "-mt-14 ms-20" : ""}`}>
            <input
              // type="search"
              className="my-2 h-8 w-48 rounded-xl ps-4"
              placeholder="search files"  
              onChange={handleSearch}
              value={searchQuery}
              maxLength={50}
            />
          </div>
          {isMobile ? null : (
            <>
              <div
                className="pe-3 flex  cursor-pointer"
                onClick={() => {
                  setDeleteModalVisible(true);
                }}
              >
                {data && (
                  <div>
                    <p className="text-white my-3">
                      {data.firstName?.replace(/\s/g, "")}
                    </p>
                  </div>
                )}
                <div className="my-3 px-2 hover:transform hover:scale-150  hover:duration-300 ">
                  <ResuableIcons icon="CiLogout" color="white" size={23} />
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavbarContainer;
