import React from 'react';
import ResuableIcons from './ResuableIcons';
const ReusableDropdown = ({ iconName, disabled, data, labelfield, onBlur, valuefield, value, onChange, placeholder, initialvalue }) => {
  const inputStyle = {
    color: disabled ? 'rgb(163 163 163)' : '#000',
  };
  const sampledata = [{ label: 'No Data Available', value: '1' }];
  data = Array.isArray(data) && data?.length > 0 ? data : sampledata;

  placeholder =
    initialvalue && typeof initialvalue === 'object'
      ? initialvalue[labelfield]
      : typeof placeholder === 'string'
        ? placeholder
        : 'Select Item';

  valuefield =
    typeof valuefield === 'string' && Array.isArray(data) && data?.length && data[0][valuefield]
      ? valuefield
      : 'value';

  labelfield =
    typeof labelfield === 'string' && Array.isArray(data) && data?.length && data[0][labelfield]
      ? labelfield
      : 'label';
 
  return (
    <div className={`flex justify-start bg-white w-full sm:w-96 h-14 sm:h-10 md:h-12 lg:h-14 flex-row items-center shadow-md rounded-2xl `}>
      <div className='ml-3'>
        <ResuableIcons icon={iconName} size={25} color={'#000000'} />
      </div>
      <select
        name="Selectedoption"
        className={`w-full sm:w-96 bg-white h-14 sm:h-10 md:h-12 lg:h-14 outline-none ml-5 mr-5 text-sm md:text-sm lg:text-sm text-neutral-400  ${disabled?'cursor-not-allowed':'cursor-auto'} `}
        disabled={disabled ? disabled : false}
        style={inputStyle}
        onChange={onChange}
        value={value}
 
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {data.map((item, index) => (
          <option key={index} value={String(item[valuefield])}>
            {item[labelfield]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ReusableDropdown;