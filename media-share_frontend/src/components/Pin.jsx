import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { v4 } from 'uuid';

import { urlFor, client } from '../client';
import { userInfo } from '../utils/general';


const Pin = ({ pin: { destination, postedBy, _id, image, save } }) => {
  const navigate = useNavigate();
  const [postHovered, setPostHovered] = useState(false);
  const [saveArray, setSaveArray] = useState(save);


  const alreadySaved = (saveArray?.filter((item) => item.postedBy?._id === userInfo?.id || item.postedBy?._ref === userInfo?.id))?.length ? true : false;

  const savePost = (e) => {
      e.stopPropagation();
      
      client.patch(_id)
        .setIfMissing({ save: []})
        .insert('after', 'save[-1]', [{
          _key: v4(),
          userId: userInfo.id,
          postedBy: {
            _type: 'postedBy',
            _ref: userInfo.id,
          }
        }]).commit()
        .then((res) => {
          setSaveArray(res.save);   
        }).catch((error) => {
          console.log(error);
        });
  }

  const deletePin = (e) => {
    e.stopPropagation();
    client.delete(_id)
    .commit()
    .then(() => {
        navigate('/');
      })
    .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className='flex flex-col m-2 gap-1'>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-details/${_id}`)}
        className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden tranisition-all duration-500 ease-in-out'
      >
        <img src={urlFor(image).width(250).url()} alt='user-post' className='rounded-lg w-full' />

        {postHovered && (
          <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'>
            <div className='flex items-center justify-between '>
              <div className='flex gap-2'>
                <a href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className='flex bg-white w-7 h-7 justify-center items-center rounded-full opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                >
                  <MdDownloadForOffline className='w-5 h-5' />
                </a>
              </div>
              {alreadySaved ? (
                <button type='button'
                   className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-3 text-sm rounded-3xl hover:shadow-md outline-none'
                >
                  { saveArray?.length } Saved
                </button>
              ) : (
                <button onClick={savePost}
                  type='button'
                  className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-3 text-sm rounded-3xl hover:shadow-md outline-none'
                >
                  Save
                </button>
              )}
            </div>
            <div className='flex flex-row items-center justify-between w-full'>
                {
                  destination && (
                    <a
                      href={destination}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='bg-white flex flex-row items-center justify-center text-black font-bold p-1 rounded-full opacity-70 hover:opacity-100 hover:shadow-md text-sm lg:text-[10px]'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <BsFillArrowUpRightCircleFill className='w-10' />
                      <p>{`${destination.slice(0, 15)}...`}</p>
                    </a>
                  )
                }
                {
                  postedBy?._id === userInfo?.id && (
                    <button
                      type='button'
                      className='bg-white text-black opacity-60 hover:opacity-100 font-bold px-2 py-2 text-sm rounded-full hover:shadow-md outline-none'
                      onClick={() => deletePin}
                    >
                      <AiTwotoneDelete />
                    </button>
                  )
                }
            </div>
          </div>
        )}
      </div>
      <div className='w-fit'> 
        <Link to={`/user-profile/${postedBy?._id}`}
          className='flex flex-row gap-2 text-sm justify-center items-center'
        >
          <img src={postedBy?.image} alt="posted by" 
            className='h-7 w-7 rounded-full'
          /> <p>{ postedBy?.userName }</p>
        </Link>
      </div>
    </div>
  )
}

export default Pin;