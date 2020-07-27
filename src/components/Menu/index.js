import React from 'react';
import Button from '../Shared-Components/Button';

export default function Menu (props) {
  return (
    <>
      <ul className='nav nav-pills ml-5 pl-4'>
        <li className='nav-item dropdown'>
          <a href='#' className='navlink dropdown-toggle border-0 btn btn-outline-dark w-100 ' data-toggle='dropdown' >Languages</a>
          <div className='dropdown-menu'>
            { props.languages.map((value, index) => (<div key={index + value.language} className='dropdown-item border-0 btn btn-dark w-100' onClick={props.onLanguageSelect}>{value.language}</div>))}
          </div>
        </li>
        <li className='nav-item'>
          <Button id='run-button-id-0' classes='border-0 btn btn-outline-dark w-100' onClick={props.handleRunClick} label='Run' />
        </li>
        <li className='nav-item'>
          <Button classes='border-0 btn btn-outline-dark w-100' onClick={props.handleSubmitClick} label='Submit'/>  
        </li>
      </ul>
    </>
  );
}