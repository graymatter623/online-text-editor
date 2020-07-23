import React from 'react';

function Button (props) {
  return (
    <div>
      <button className={props.classes} onClick={props.onClick} id={props.id}>{props.label}</button>
    </div>
  );
}
export default Button;