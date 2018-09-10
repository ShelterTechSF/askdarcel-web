import React from 'react';

const Quote = function Quote({ quote }) {
  return (quote ?
    <div className="quote">
      <img className="quote-img" src={quote.url} />
      <div className="quote-content">
        <p className="quote-meta">{quote.username} • {quote.date}</p>
        <p className="quote-text">{quote.text}</p>
      </div>
    </div> :
    null
  )
}

export default Quote; 
