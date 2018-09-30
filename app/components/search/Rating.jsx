import React from 'react';

const Rating = function Rating({ ratings }) {
  return (ratings.length ?
    <div className="entry-rating">
      {Math.round(this.props.ratings.reduce((total, rating) => total + rating) / 5)}
    </div> :
    null
  );
};

export default Rating;
