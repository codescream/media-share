import React, { useRef, useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom';
import {RiHomeFill} from 'react-icons/ri';
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { categories } from '../utils/data';

import mlogo from '../assets/ms-mini_logo.png';

const Sidebar = ({ user, closeToggle}) => {
  // const categoryRef = useRef(null);
  // const [atTop, setAtTop] = useState(true);
  // const [atBottom, setAtBottom] = useState(false);
  // const [bottom, setBottom] = useState();
  // const [top, setTop] = useState(0)

  // useEffect(() => {
  //   const container = categoryRef.current;
  //   // Calculate the scroll position
  //   let scrollHeight = container.scrollHeight;
  //   let clientHeight = container.clientHeight;
  //   let scrollTop = container.scrollTop;

  //   const handleScroll = () => {
  //     // Calculate the scroll position
  //     scrollHeight = container.scrollHeight;
  //     clientHeight = container.clientHeight;
  //     scrollTop = container.scrollTop;

  //     console.log(Math.round(scrollTop));
  //     console.log(Math.round(scrollTop + clientHeight));
  //     setTop(Math.round(scrollTop));
  //     setBottom(Math.round(scrollHeight - (scrollTop + clientHeight)));

  //     setAtTop(scrollTop === 0);
  //     setAtBottom(Math.round(scrollTop) + clientHeight === scrollHeight);

  //     // // Check if at the top
  //     // setIsAtTop(scrollTop === 0);

  //     // // Check if at the bottom
  //     // setIsAtBottom(scrollTop + clientHeight === scrollHeight);
  //   };

  //   if (container) {
  //     // Attach the scroll event listener
  //     container.addEventListener('scroll', handleScroll);

  //     // Clean up the event listener on component unmount
  //     return () => {
  //       container.removeEventListener('scroll', handleScroll);
  //     };
  //   }
  // }, []); // Run this effect only once after the initial render


  const isNotActiveStyle = "flex items-center px-5 gap-2 text-gray-500 hover:text-black transition-all duration-200 ease-in";

  const isActiveStyle = "flex items-center px-5 gap-2 font-extrabold border-r-2 transition-all duration-200 ease-in";

  const handleCloseSidebar = () => {
    closeToggle && closeToggle(false);


  }
  return (
    <div className='flex flex-col justify-between bg-white h-full min-w-210 shadow-2xl'>
      <div className='flex flex-col'>
        <Link to={'/'} className='flex px-5 gap-2 my-6 pt-1 w-190 items-center' onClick={handleCloseSidebar}>
          <img src={mlogo} alt="logo" className='w-14' />
        </Link>
        <div className='flex flex-col gap-5'>
          <NavLink to={"/"}
            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle }
            onClick={handleCloseSidebar}
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className='mt-2 px-5 text-base 2xl:text-xl'>
              Discover Categories
          </h3>
        </div>
      </div>
      <div className='relative flex flex-col mt-3 gap-5 overflow-y-scroll hide-scrollbar'>
        {/* { <FaLongArrowAltUp className={`absolute top-[${top}px] right-0`} />}
        {<FaLongArrowAltDown className={`absolute bottom-[${bottom}px] right-0`} />} */}
        {categories.map((category, index) =>
          <NavLink key={category.name} to={`category/${category.name}`}
          className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
          onClick={handleCloseSidebar}
          >
            <img src={category.image} alt="category" 
              className='w-6 h-6 rounded-full shadow-sm'
            />
            {category.name}
          </NavLink>)
        }
      </div>
      {user && (
        <Link to={`user-profile/${user._id}`}
          className='flex flex-row mb-1 mx-1 rounded-lg shadow-lg items-center gap-1 text-[10px]'
          onClick={handleCloseSidebar}
        >
          <img src={user.image} alt="user-profile" className='w-6 h-6 rounded-full' />
          <p>{user.userName}</p>
        </Link>
      )}
    </div>
  )
}

export default Sidebar;