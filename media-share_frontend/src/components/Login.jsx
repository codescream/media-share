import React, { useEffect } from 'react'
import { useGoogleLogin, googleLogout } from '@react-oauth/google'

import shareVideo from '../assets/mediashare.mp4';
import logo from '../assets/mediashare_logo.png'
import { FcGoogle } from 'react-icons/fc';
import { getUser } from '../utils/fetch';
import { client } from '../client';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: codeResponse => {
      getUser(codeResponse).then((res) => {
        localStorage.setItem('user', JSON.stringify(res));

        const { name, id, picture } = res;

        const doc = {
          _id: id,
          _type: 'user',
          userName: name,
          image: picture
        }

        client.createIfNotExists(doc)
          .then(() => {
            navigate('/', {replace: true});
          }).catch((error) => {
            navigate('/login', {replace: true});
          });
      });
    },
    onError: errorResponse => console.log('error:',errorResponse),
    flow: 'implicit',
    ux_mode: 'popup',
    onNonOAuthError: onNonOAuthError => console.log(onNonOAuthError),
    state_cookie_domain: "http://localhost",
  });
  return (
      <div className='flex justify-start items-center flex-col h-screen'>
        <div className="relative w-full h-full">
          <video 
            src={shareVideo}
            type="video/mp4"
            loop
            controls={false}
            muted
            autoPlay
            className='w-full h-full object-cover'
          />
          <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay '>
            <div className='p-g'>
              <img src={logo}  width={'140px'} alt='logo' />
            </div>
            <div className='shadow-2xl'>
              <button
                type='button'
                className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded flex justify-center items-center text-sm outline-none"
                onClick={() => login()}
                >
                <FcGoogle className='mr-1 text-xl' /> Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Login;