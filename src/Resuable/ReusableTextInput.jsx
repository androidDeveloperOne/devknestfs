// import React, { useState } from 'react';
// import { Input } from 'antd';
// import ResuableIcons from './ResuableIcons';
// const ReusableTextInput = ({ label, action, id, iconName, disabled, value, type,size }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const handleFocus = () => {
//     setIsFocused(true);
//   };
//   const handleBlur = () => {
//     setIsFocused(false);
//   };
//   const inputStyle = {
//     borderColor: isFocused ? '#f9f9f9' : '#f9f9f9',
    
//   };
//   return (
//     <div className="w-full sm:w-64  md:w-full lg:w-full  h-14 sm:h-10  md:h-12 lg:h-14 ">
//       <Input
//         id={id}
//         type={type === 'numeric' ? 'number' : 'text'}
//         disabled={disabled ? disabled : false}
//         maxLength={type === 'numeric' ? 10 : undefined}
//         placeholder={label}
//         prefix={
//           <div className='pr-4'>
//             <ResuableIcons icon={iconName} size={size?size:40} color={isFocused ? '#000000' : '#000000'} />
//           </div>
//         }
//         className="w-full sm:w-64  md:w-full lg:w-full h-14 sm:h-10 md:h-12 lg:h-14 bg-white items-center shadow-md rounded-2xl text-sm md:text-base lg:text-base"
//         value={value}
//         onChange={(e) => action(e.target.value)}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         style={inputStyle}
//       />
//     </div>
//   );
// };

// export default ReusableTextInput;


import React, { useState } from 'react';
import { Input } from 'antd';
import ResuableIcons from './ResuableIcons';
const ReusableTextInput = ({ label, action, id, iconName, disabled, value, type,size,width,maxLength,autoComplete,disableCopyPaste }) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  const inputStyle = {
    borderColor: isFocused ? '#f9f9f9' : '#f9f9f9',
    
  };
  const handlePaste = (e) => {
    if (disableCopyPaste) {
        e.preventDefault(); 
    }
};

const handleCopy = (e) => {
    if (disableCopyPaste) {
        e.preventDefault();
    }
};
  return (
    <div className={`h-14 sm:h-10  md:h-12 lg:h-14`}>
      <Input
        id={id}
        type={type === 'numeric' ? 'number' : 'text'}
        disabled={disabled ? disabled : false}
        maxLength={maxLength ? maxLength : 50}
        placeholder={label}
        prefix={
          <div className='pr-4'>
            <ResuableIcons icon={iconName} size={size?size:25} color={isFocused ? '#000000' : '#000000'} />
          </div>
        }
        className={`${width && "w-80"} h-14 sm:h-10 md:h-12 lg:h-14 bg-white items-center shadow-md rounded-2xl text-sm md:text-sm lg:text-sm`}
        value={value}
        onChange={(e) => action(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={inputStyle}
        autoComplete={autoComplete ? "off" : "on"}
        onPaste={handlePaste} 
        onCopy={handleCopy}   
      />
    </div>
  );
};

export default ReusableTextInput;
