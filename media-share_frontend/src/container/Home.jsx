import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import { Sidebar, UserProfile } from '../components';
import Pins from './Pins';
import { client } from '../client';
import mlogo from '../assets/ms-mini_logo.png';
import { userQuery } from '../utils/fetch';
import { userInfo } from '../utils/general';
import { IoClose } from 'react-icons/io5';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  // const userInfo = localStorage.getItem('user') ? 
  //   JSON.parse(localStorage.getItem('user')) :
  //   localStorage.clear();

    useEffect(() => {
      scrollRef.current.scrollTo(0, 0);
    }, [])
    

    console.log(userInfo);

    useEffect(() => {
      const query = userQuery(userInfo?.id);

      client.fetch(query)
        .then((res) => {
          setUser(res[0]);
        });
    }, [])
    

  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={user && user}/>
      </div>
      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize={40} className='cursor-pointer text-orange-500' onClick={() => setToggleSidebar(true)} />
          <Link to={'/'}>
            <img src={mlogo} alt='logo' className='w-[50px] mt-2' />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt='logo' className='w-10 mt-2 rounded-full' />
          </Link>
        </div>
        {toggleSidebar && (
          <div className={`fixed w-4/5 bg-white h-[91.5vh] top-[8.5vh] overflow-y-auto shadow-2xl rounded z-10 ${toggleSidebar ? 'animate-slide-out' : 'animate-slide-in'}`}>
            <div className='absolute w-full flex justify-end items-center p-2'>
              <IoClose fontSize={30} className='cursor-pointer text-black bg-orange-500 rounded-full' onClick={() => setToggleSidebar(false)} />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>
      
      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path='/user-profile/:userId' Component={UserProfile} />
          <Route path='/*' element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home;