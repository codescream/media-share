import React, { useEffect } from 'react';
import { useState } from 'react';
import { AiOutlineCloudUpload } from'react-icons/ai';
import { MdDelete } from'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { client } from '../client';
import { categories } from '../utils/data';
import Spinner from './Spinner';


const CreatePin = ({ user }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [category, setCategory] = useState('');
  const [imageAsset, setImageAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fields, setFields ] = useState(false);
  const [about, setAbout] = useState('');
  const [wrongImageType, setWrongImageType] = useState(false);
  const [loadingIssues, setLoadingIssues] = useState(false)

  useEffect(() => {
    
  }, []);

  console.log(user);

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];
  
    switch (type) {
      case 'image/jpeg':
      case 'image/png':
      case 'image/jpg':
      case 'image/gif':
      case 'image/tiff':
        setLoadingIssues(false);
        setWrongImageType(false);
        setLoading(true);
        client.assets
        .upload('image', e.target.files[0], {contentType: type, filename: name})
        .then((doc) => {
        setImageAsset(doc);
        setLoading(false);
        }).catch((error) => {
        setLoadingIssues(true);
        setLoading(false);
        })
        break;
    
      default:
        setTimeout(()=> setWrongImageType(false), 3000);
        setWrongImageType(true);
        break;
    }
  }

  const savePin = () => {
    if (!title || !destination || !category || !imageAsset?._id || !about) {
      setTimeout(()=> setFields(false), 3000);
      setFields(true);
    } else {
      setFields(false);
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user?._id,
        postedBy: {
          _type:'postedBy',
          _ref: user?._id
        },
        category,
      }
      client.create(doc)
        .then(() => {
          navigate('/');
        })
    }
  }

  return (
    <div className='flex flex-col gap-2 justify-center items-center mt-5 lg:h-4/5'>
      {
          fields && (<p
          className='text-red-500 text-sm font-bold transition-all duration-150 ease-in animate-fade-out'
          >Please fills all necessary fields....
          </p>
          )
      }
      <div className='bg-stone-300 flex w-2/3 h-auto p-2 rounded-md'>
        <div className='flex justify-center items-center h-[360px] w-full border-dotted border-stone-400 border rounded-md' >
          <div className='flex flex-col justify-center items-center text-center'>
            {
              loading && (
                <Spinner />
              )
            }
            {
              wrongImageType && (<p
                className='text-red-500 text-sm font-bold transition-all duration-150 ease-in animate-fade-out'
              >Wrong image type!</p>)
            }
            {
              loadingIssues && (<p
                className='text-red-500 text-sm font-bold transition-all duration-150 ease-in-out animate-fade-out'
              >There was a problem loading your image - check Internet Connection!</p>)
            }
            {
              !imageAsset ? (
                <label>
                  <div className='flex flex-col justify-center items-center'>
                  <AiOutlineCloudUpload />
                  <p>Click to upload</p>
                  <p className='text-stone-500 text-[10px] md:text-sm mt-10 mx-2'>Use high-quality JPG, SVG, PNG, GIF less than 20MB</p>
                  <input type="file" className='w-0 h-0' name='upload-image' 
                  onChange={uploadImage}
                  />
                  </div>
                </label>
              ) : (
                <div className='relative h-[350px]'>
                  <img src={imageAsset?.url} alt='uploaded-pix' className='rounded-lg w-full h-full' />
                  <button
                    className='absolute bottom-0.5 right-0.5 bg-black text-white p-1 rounded-full opacity-70 hover:opacity-100'
                    onClick={() => setImageAsset(null)}
                  >
                    <MdDelete />
                  </button>
                </div>
              )
            }
          </div>
        </div>
      </div>
      
      <div className='flex flex-1 flex-col w-2/3 text-xs'>
        <div className='gap-3 flex flex-col w-2/3'>
          <input type="text" placeholder='Add your title here...' 
            className='p-2 rounded-md mb-4 outline-none'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {
            user && (
              <div className='flex flex-row gap-1 font-bold items-center'>
                <img src={user.image} alt="" 
                className='w-6 rounded-full'
              />
                <p>{user.userName}</p>
              </div>
            )
          }
          <input type="text" placeholder='What is your pin about?'
            className='p-2 rounded-md outline-none'
            value={about}
            onChange={(e) => {setAbout(e.target.value)}}
          />
          <input type="text" placeholder='Add your destination link' 
            className='p-2 rounded-md outline-none'
            value={destination}
            onChange={(e) => {setDestination(e.target.value)}}
          />

          <p className='font-bold'>Choose Pin Category</p>
          <select name="category" id="category" value={category}
            className='outline-none capitalize shadow-md p-2 rounded-md mb-4 border-b-2 border-gray-200 cursor-pointer'
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="other">Select Category....</option>
            {
              categories.map((category, index) => (
                <option key={index} value={category.name}
                  className='border-0 outline-none'
                >
                  {category.name}
                </option>
              ))
            }
          </select>
          <div className='flex justify-end'>
            <button
              className='bg-orange-500 rounded-md p-2 font-bold opacity-100 hover:opacity-70'
              onClick={savePin}
            >Save Pin</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin