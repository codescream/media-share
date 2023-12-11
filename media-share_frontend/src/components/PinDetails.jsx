import React, { useState, useEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { IoIosSend } from "react-icons/io";
import { BsSendCheckFill } from "react-icons/bs";
import { ThreeDots } from 'react-loader-spinner';
import { Link, useParams } from'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/fetch';
import Spinner from './Spinner';

const PinDetail = () => {
  const [pins, setPins] = useState(null);
  const [pinDetails, setPinDetails] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [sent, setSent] = useState(false)
  const { pinId } = useParams();

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if(query) {
      client.fetch(query)
      .then((data) => {
        setPinDetails(data[0]);

        if(data[0]) {
          query = pinDetailMorePinQuery(data[0]);

          if(query) {
            client.fetch(query)
            .then((data) => {
                              setPins(data);
              }).catch((error) => {
                console.log(error);
              })
          }
        }
      }).catch((error) => {
        
      })
    }
  }

  const addComment =  () => {
    if(comment) {
      setAddingComment(true);

      client.patch(pinId)
      .setIfMissing({comments: []})
      .insert('after', 'comments[-1]', [{
        comment,
        _key: uuidv4(),
        postedBy: {
          _type: 'postedBy',
          _ref: pinDetails?.postedBy?._id
        }
      }]).commit()
      .then(() => {
        setComment('');
        setSent(true);
        setTimeout(()=> {setSent(false); setAddingComment(false);}, 3000);
        fetchPinDetails();
      })
    }
  } 

  if(!pinDetails)
    return <Spinner message='Loading pin...' />

  

  return (
    <>
      <div className='flex flex-col m-auto max-w-[400px]'>
        <div className='flex justify-center items-center md'>
          <img src={pinDetails?.image && urlFor(pinDetails.image).url()} alt="pin"
            className='rounded-t-2xl rounded-b-lg'
          />
        </div>
        <div className='w-full p-5 flex-1 x:min-w-620'>
          <div className='relative flex items-center justify-between'>
            <div className='flex gap-2 items-center'>
              <a href={`${urlFor(pinDetails.image).url()}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className='absolute left-0 flex bg-white justify-center items-center rounded-full opacity-75 hover:opacity-100 hover:shadow-lg hover:p-1 outline-none'
              >
                <MdDownloadForOffline className='w-5 h-5 text-orange-500' />
              </a>
            </div>
            <a href={pinDetails?.destination} target='_blank' rel="noreferrer"
              className='absolute right-0  flex flex-row gap-1 items-center justify-between hover:shadow-lg hover:p-1 hover:rounded-md opacity-75 hover:opacity-100'
            >
              <p className='text-xs'>{pinDetails?.destination.slice(0, 20)}</p>
              <BsFillArrowUpRightCircleFill className='w-5 text-orange-500' />
            </a>
          </div>
        </div>
        <div className='w-full px-3 flex flex-1 flex-col gap-2 capitalize x:min-w-620'>
          <h1 className='text-3xl break-words'>{pinDetails?.title}</h1>
          <p className='text-[12px]'>{pinDetails?.about}</p>
          <Link to={`/user-profile/${pinDetails?.postedBy?._id}`}
            className='flex flex-row gap-2 text-sm items-center font-bold'
          >
            <img src={pinDetails?.postedBy?.image} alt="posted by" 
              className='h-7 w-7 rounded-full'
            /> <p>{ pinDetails?.postedBy?.userName }</p>
          </Link>
          <h2>Comments:</h2>
          <div>
            {
              pinDetails?.comments?.map((comment, index) => 
                <div className='flex gap-2 mt-1 items-center rounded-lg' key={index}>
                  <img src={comment?.postedBy?.image} alt="user-profile" 
                    className='w-10 h-10 rounded-full cursor-pointer'
                  />
                  <div className='flex flex-col'>
                    <p className='font-bold'>{comment?.postedBy?.userName}</p>
                    <p>{comment.comment}</p>
                  </div>
                </div>
              )
            }
          </div>
          <div className='flex flex-row mt-6 gap-3'>
            <Link to={`/user-profile/${pinDetails?.postedBy?._id}`}
              className='flex flex-row gap-2 text-sm items-center'
            >
              <img src={pinDetails?.postedBy?.image} alt="posted by" 
                className='h-7 w-7 rounded-full'
              />
            </Link>
            <input type="text" 
                className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-200'
                placeholder='drop a comment...'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            <button type='button'
              className={`bg-orange-500 flex flex-col text-white rounded-full font-semibold text-base outline-none opacity-70 hover:opacity-100 justify-center items-center p-4 ${addingComment ? 'pointer-events-none' : 'pointer-events-auto'}`}
              onClick={addComment}
            >
              {
                !addingComment && <IoIosSend className='text-lg' />
              }
              {
                sent && <BsSendCheckFill className='text-white-900 text-lg animate-fade-out' />
              }
              { !sent && 
                <ThreeDots 
                height="100%" 
                width="18"
                color='#'
                visible={addingComment}
                wrapperStyle={{padding:"7px 0px"}} />
              }
            </button>
          </div>
        </div>
      </div>
      <div>
        {
          pins ? (
            <>
              <h2 className='flex flex-col gap-0.5 items-center font-bold mt-5'>
                See Similar Posts....
                <hr className='w-3/4 border-t-4 border-gray-300 rounded-md' />
              </h2>
              <MasonryLayout pins={pins} />
            </>
          ) : (
            <Spinner message='Loading pins...' />
          )
        }
      </div>
    </>
  )
}

export default PinDetail