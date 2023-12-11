import React from 'react';
import { useState, useEffect } from 'react';

import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/fetch';
import Spinner from './Spinner';


const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if(searchTerm) {
      const query = searchQuery(searchTerm.toLowerCase());
      client.fetch(query)
      .then(res => {
        setPins(res);
        setLoading(false);
      }).catch((error) => {
        console.log(error);
      });
    }else {
      client.fetch(feedQuery)
      .then((data) => {
        setLoading(false)
        setPins(data);
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }, [searchTerm])
  
   
  return (
    <div>
      {
        loading ? (
          <Spinner message="Searching for pins..." />
        ) : (
          pins?.length ? (
          <MasonryLayout pins={pins} />
          ) : (
            searchTerm !== 0 && <div className='mt-10 text-center text-xl'>
              No Pins Found...
            </div>
          )
        )
      }
    </div>
  )
}

export default Search