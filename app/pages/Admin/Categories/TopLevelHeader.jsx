import React from 'react';

const divStyle = {
  'display': 'flex',
  'justify-content': 'space-between',
  'height': '40px',
  'width': '700px',
  'margin': 'auto',
  'border-style': 'inset',
  'border-color': 'gray',
  'border-width': '5px',
  'padding': '5px',
  'background': 'lightgray',
  'font-weight': '600',
}

const TopLevelHeader = (props) => {
  return (
    <div style={divStyle}>
      <span>Top Level Categories</span>
      <span>+ Add Category</span>
    </div>
  )
}

export default TopLevelHeader;