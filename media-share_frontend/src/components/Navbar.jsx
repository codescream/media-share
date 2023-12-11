import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  return (
    <div className='flex gap-2 mt-5 pb-7 md:gap-5 w-full'>
      <div className='flex justify-satrt items-center w-full p-2 rounded-md border-none bg-white outline-none focus-within:shadow-sm'>
        <IoMdSearch fontSize={21} className='ml-1 text-orange-500' />
        <input type="text"
        placeholder='Search'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => navigate('/search')}
        onBlur={() => navigate('/')}
        className='p-2 w-full bg-white outline-none'
        />
      </div>
      <div className='flex gap-3 items-center'>
        <Link to={`user-profile/${user?._id}`} className='hidden md:block outline-none'>
          <img src={user?.image} alt="user" className='w-16 h-13 md:w-16 md:h-12 lg:w-14 lg:h-12 rounded-full' />
        </Link>
        <Link to={'create-pin'}
          className='flex bg-orange-500 text-black h-11 w-11 md:h-10 md:w-14 rounded-md items-center justify-center lg:w-12 lg:h-10 outline-none'
        >
          <IoMdAdd />
        </Link>
      </div>
    </div>
  )
}

export default Navbar;