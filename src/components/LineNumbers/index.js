import React from 'react';

export default function LineNumbers (props) {
  return (
    <div className='d-flex flex-column'>
      {
        [...new Array(props.totalLines)].map((val, index) => (<div>{index + 1}</div>))
      }
    </div>
  );
}