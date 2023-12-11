import React, { useState, useEffect } from 'react';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/fetch';
import { client } from '../client';
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner';



const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  // const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('Saved');
  const navigate = useNavigate();
  const { userId } = useParams();

  const randomImg = "https://source.unsplash.com/random/900x900/?nature,technology,photography,science";

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query)
    .then((data) => {
      console.log(data[0]);
      setUser(data[0])
    });
  }, [userId]);

  const logout = () => {
    googleLogout();
    localStorage.clear();
    navigate('/login', {replace: true});
  }

  useEffect(() => {
    if(userId) {
      if(activeBtn === 'Created') {
        const query = userCreatedPinsQuery(userId);

        client.fetch(query)
          .then((data) => {
            console.log(data)
            setPins(data);
        }).catch((error) => {
          console.log(error);
        })
      }else {
        const query = userSavedPinsQuery(userId);

        client.fetch(query)
          .then((data) => {
            console.log(data);
            setPins(data);
          }).catch((error) => {
            console.log(error);
          })
      }
    }
  }, [userId, activeBtn])
  

  const activeStyles = 'bg-orange-500 rounded-2xl p-2 py-1 outline-none';
  const notActiveStyles = 'bg-white-500 rounded-2xl p-2 py-1 outline-none';


  if(!user)
    return <Spinner message="Loading profile..." />

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img src={randomImg} alt="banner" 
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
            />
            <img src={user?.image} alt="user" className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover' />
            <h1 className='font-bold text-3xl text-center mt-3'>
              {user?.userName}
            </h1>
            <div className='absolute top-0 z-1 right-0 p-2'>
              {
                userId === user?._id && (
                  <button 
                    className='bg-black p-2 rounded-full cursor-pointer outline-none shadow-md'
                    onClick={logout}
                  >
                    <RiLogoutCircleRLine className='text-orange-500' />
                  </button>
                )
              }
            </div>
          </div>
          <div className='flex flex-row gap-1 justify-center items-center text-sm'>
            <button 
            className={activeBtn === 'Saved' ? activeStyles : notActiveStyles}
            onClick={(e) => {setActiveBtn(e.target.textContent)}}
            >
              Saved
            </button>
            <button
            className={activeBtn === 'Created' ? activeStyles : notActiveStyles}
            onClick={(e) => {setActiveBtn(e.target.textContent)}}
            >
              Created
            </button>
          </div>
          <div>
            <MasonryLayout pins={pins} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile