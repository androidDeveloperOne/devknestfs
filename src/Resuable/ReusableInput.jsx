
import React from "react";

export default function ReusableInput({
  name,
  placeholder,
  handleChange,
  handleBlur,
  value,
  className,
  type,
  disableCopyPaste
}) {
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
    <div>
      <input
        name={name}
        placeholder={placeholder}
        required
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
        className={className}
        type={type}
        maxLength={80}
        onPaste={handlePaste} 
        onCopy={handleCopy}  
      />
    </div>
  );
}
