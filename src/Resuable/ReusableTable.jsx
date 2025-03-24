import React from "react";

const ReusableTable = ({firstName,lastName, mobile, email,isActive, employeeId, formattedDate,lastActiveTime, userType, department, onClick }) => {
    return (
        
    
                <tr className={`grid grid-cols-12 gap-4  hover:bg-[#1f51a6] hover:text-white  text-gray-900 text-sm sm:text-xs lg:text-xs xl:text-xs 2xl:text-sm   divide-x-2   break-all divide-slate-200 ms-6 truncate h-16  border-2 shadow-md rounded-xl border-inherit text-wrap text-ellipsis cursor-pointer `} onClick={onClick}>
                    <td className={`col-span-2   text-ellipsis ps-1.5  py-3  pe-0`}>
                        {firstName ? firstName?.replace(/\s/g, '') : null}
                    </td>
                    <td className={`col-span-2   text-ellipsis ps-1.5 py-3  pe-0`}>
                        {lastName ? lastName?.replace(/\s/g, '') : null}
                    </td>
                    <td className={`col-span-2  text-ellipsis ps-1.5 py-3  -me-4`}>
                        {email ? email : null}
                    </td>
                    {/* <td className={`text-ellipsis ps-1.5 py-3 -pe-10  pe-0`}>
                        {mobile ? mobile : null}
                    </td>
                    <td className={`text-ellipsis ps-1.5 py-3  pe-0`}>
                        {employeeId ? employeeId : "NA"}
                    </td> */}


                    <td className={`text-ellipsis ps-1.5  py-3  pe-0`}>
                        {userType ? userType : null}
                    </td>

                    <td className={`text-ellipsis ps-1.5  py-3  pe-0`}>
                        {department ? department : null}
                    </td>
                    <td className={`text-ellipsis ps-1.5 py-3  col-span-1  pe-0`}>
                        {formattedDate ? formattedDate : null}
                    </td>

                    <td className={`text-ellipsis ps-1.5 py-3  col-span-1  pe-0`}>
                        {isActive ? isActive : null}
                    </td>
                    <td className={`col-span-2 text-ellipsis ps-1.5 py-3  pe-0`}>
                        {lastActiveTime ? lastActiveTime : "NA"}
                    </td>
                </tr>


   
    );
};

export default ReusableTable;
