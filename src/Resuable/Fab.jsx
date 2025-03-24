import * as React from 'react';
import ResuableIcons from './ResuableIcons';
const Fab = ({ action }) => (
  <div onclick={action}
    className='bg-[#1f51a6] flex justify-content-center items-center rounded-full shadow-2xl shadow-slate-800 lg:w-16 lg:h-16'>
    <ResuableIcons icon={'IoMdAdd'} size={35} color={'#ffffff'} />
  </div>
);

export default Fab;