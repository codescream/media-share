import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { allPins, pinQuery } from '../utils/fetch';
import { shuffleArray } from '../utils/general';

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  console.log(pins);

  useEffect(() => {
    setLoading(true);

    if(categoryId) {
      //fetch pins for a particular category
      const query = pinQuery(categoryId);

      client.fetch(query)
        .then((res) => {
          setPins(shuffleArray(res));
          setLoading(false);
        });

    }else {
      //fetch pins for all categories
      client.fetch(allPins)
        .then((res) => {
          setPins(shuffleArray(res));
          setLoading(false);
        });
    }
    
  }, [categoryId])
  

  return loading ? (<Spinner message="We are adding new ideas to your feed!" />) : (
    <div>
      {pins && <MasonryLayout pins={pins} />}
    </div>
  )
}

export default Feed;