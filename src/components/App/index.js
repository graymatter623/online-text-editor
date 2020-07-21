import React from 'react';
import { editorApiBaseUrl } from '../../utility/constants';
import fetch from 'isomorphic-fetch';
import styles from './styles.scss';
import cx from 'classnames';
export default class App extends React.PureComponent {
  constructor () {
    super();
    this.state = {
      textAreaInput: '',
      textAreaOutput: '',
      shouldOutputShow: false,
    };
  }
  
  handleTextAreaOnChange = (event) => {
    this.setState({
      textAreaInput: event.currentTarget.value,
      shouldOutputShow: false,
    });
  };

  handleRunClick = () => {
    const options = {
      body: JSON.stringify({ code: this.state.textAreaInput }) || {},
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST'
    };
    fetch(`${editorApiBaseUrl}/api/code-compile`, options)
      .then(response => response.json()).then(data => {
        if (data.success) {
          this.setState({
            shouldOutputShow: true,
            textAreaOutput: data.output,
          });
        }
      }).catch(err => console.log(err));
  }
  
  handleSubmitClick = () => {
    
  }

  render () {
    return (
      <div>
        <div className='row'>
          <div className='col-6 mt-3 display-4 text-center'>JS CODE</div>
          <div className='col-6 mt-3 display-4 text-center'>OUTPUT</div>
        </div>
        <div className='row'>
          <div className='col-4'>
            <textarea onChange={this.handleTextAreaOnChange} className={cx('form-control h-50', styles.overflow, styles.fs2)} rows={20} id='code-editor-input'/>
          </div>
          <div className={cx('col-4', styles.divider)}/>
          <div className='col-4'>
            { this.state.shouldOutputShow ? this.state.textAreaOutput : ''}
          </div>
        </div>
        <div className='row ml-2 mt-3'>
          <div className='col-1'>
            <button className='btn btn-primary mr-3' onClick={this.handleRunClick} >RUN</button>
            <button className='btn btn-success' onClick={this.handleSubmitClick}>SUBMIT</button>  
          </div>
          <div className='col-11'/>
        </div>
      </div>
    );
  }
}