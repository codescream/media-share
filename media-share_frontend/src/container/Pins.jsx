import React from 'react';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Feed, CreatePin, Navbar, Search, PinDetails } from '../components';

const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');

  console.log(user);

  return (
    <div className='px-2 md:px-5'>
      <div>
         <Navbar user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
         </Navbar>
      </div>
      <div className='h-full'>
        <Routes>
          <Route path='/' Component={Feed} />
          <Route path='/category/:categoryId' Component={Feed} />
          <Route path='/pin-details/:pinId' Component={PinDetails} />
          <Route path='/create-pin' element={<CreatePin user={user} />} />
          <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Pins;