import React from 'react';
import { editorApiBaseUrl } from '../../utility/constants';
import fetch from 'isomorphic-fetch';
import './styles.scss';
import cx from 'classnames';
import Button from '../Shared-Components/Button';
import LineNumbers from '../LineNumbers';

export default class App extends React.PureComponent {
  constructor () {
    super();
    this.state = {
      textAreaInput: '',
      textAreaOutput: '',
      shouldOutputShow: false,
      errorOccured: false,
      loading: false
    };
  }
  
  handleTextAreaOnChange = (event) => {
    this.setState({
      textAreaInput: event.currentTarget.value,
      shouldOutputShow: false,
    });
  };

  handleRunClick = () => {
    this.setState({
      loading: true,
    });

    const options = {
      body: JSON.stringify({ 
        code: this.state.textAreaInput,
        scriptType: 'node',
       }) || {},
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST'
    };
    fetch(`${editorApiBaseUrl}/api/code-compile`, options)
      .then(response => response.json()).then(data => {
        console.log(data);
        if (data.success) {
          this.setState({
            shouldOutputShow: true,
            textAreaOutput: data.output,
            errorOccured: false,
            loading: false
          });
        } else if (!data.success) {
          this.setState({
            shouldOutputShow: true,
            textAreaOutput: data.output ,
            loading: false,
            errorOccured: true,
          });
        }
      }).catch(err => console.log(err));
  }
  
  handleSubmitClick = () => {
    
  }
  render () {
    return (
      <div className='bg-whitesmoke'>
        <div className='d-flex ml-3 mt-1'>
          <Button id='run-button-id-0' classes='shadow rounded-0 btn btn-outline-success' onClick={this.handleRunClick} label='RUN' />
          <Button classes='shadow rounded-0 btn btn-outline-primary' onClick={this.handleSubmitClick} label='SUBMIT'/>  
        </div>
        <div className='row'>
          <div className='ml-2 col-6'>
            <div className='row ml-2 shadow'>
              <LineNumbers totalLines={20} />
              <textarea onChange={this.handleTextAreaOnChange} className={cx('col border-0 form-control h-75 overflow fs-2 no-resize')} rows={20} id='code-editor-input'/>
            </div>
          </div>
          <div className='col-5 shadow ml-5 bg-white'>
            <div className={cx(this.state.errorOccured ? 'text-danger' : 'text-success')}>{ this.state.shouldOutputShow ? (this.state.textAreaOutput) : '' }</div>
            { (!this.state.shouldOutputShow && this.state.loading) && <div className='spinner-border text-success' />}
          </div>
        </div>
      </div>
    );
  }
}