import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "./Login.css";
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtpAction } from '../../../Redux/slices/UserSlice';
import { useNavigate } from 'react-router-dom';

const fixedInputClass =
  "rounded-md appearance-none relative block w-full md:text-lg px-3 my-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none  focus:z-10  sm:text-sm";
const phoneregex = /^([+]\d{2})?\d{4}$/;
export default function Otp() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  let userState = useSelector(state => state?.auth?.userdata)
  let isLoggedIn = userState && userState?.token
  
  const OtpSchema = Yup.object().shape({
    OTP: Yup.string()
    .required('* Required OTP!')
    .matches(phoneregex, { message: "* Must be 4 digits!" }),
  });
  
  useEffect(() => {
    if (isLoggedIn) {
      navigate(`/`)
    }
     
  }, [isLoggedIn])
  
  return (
    <div className="flex backgroundColor justify-center items-center min-h-screen">
      <div className="w-full md:w-3/4 px-4 lg:w-2/5">
        <div className="relative bg-white  shadow-black shadow-lg rounded-3xl mx-auto p-6 md:p-10 text-center text-lg md:text-2xl font-medium ">
          <label className="text-xl md:text-2xl mb-6 text-gray-700 ">Please Enter Your OTP Here</label>
          <Formik
       initialValues={{ OTP: ''}}
       validationSchema={OtpSchema}
       onSubmit={(values) => {
       console.log(values)
       dispatch(verifyOtpAction(values?.OTP));
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
        
       }) => (
          <form className="outline-0 border-none m-4 font-medium " onSubmit={handleSubmit}>
            <div className="flex flex-col items-stretch">
            <p className="text-l md:text-xl mt-8 text-gray-700 self-start ">OTP</p>
              <input
                // type="number"
                name='OTP'
                placeholder="Enter Your OTP"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.OTP}
                className={fixedInputClass}
              />
             <p className="text-sm md:text-sm mb-6 text-red-400">{errors.OTP && touched.OTP && errors.OTP}</p>  
             
            <button type='submit' className="bg-[#1f51a6]   relative text-gray-700 font-medium rounded-md py-2 px-3 my-6 duration-400">
             <p className='text-white my-1 font-normal '>Submit</p> 
            </button>
        
            </div>
          </form>
       )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
