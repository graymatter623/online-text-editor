import React from 'react';
import { editorApiBaseUrl } from '../../utility/constants';
import fetch from 'isomorphic-fetch';
import './styles.css';
import cx from 'classnames';

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
      <div >
        <div className='row ml-1 mt-5'>
          <div className='col-1'>
            <button className='shadow rounded-0 btn btn-success mr-3' onClick={this.handleRunClick} >RUN</button>
          </div>
          <div className='col-11'/>
        </div>
        <div className='row'>
          <div className='ml-2 col-6'>
            <div className='row ml-2 shadow'>
              <textarea onChange={this.handleTextAreaOnChange} className={cx('form-control col-11 border-top-0 border-left-0 h-75 overflow fs2')} rows={20} id='code-editor-input'/>
              <div className={cx('col-1 divider')}/>
            </div>
          </div>
          <div className='col-5 divider shadow'>
            <div className={cx(this.state.errorOccured ? 'text-danger' : 'text-success')}>{ this.state.shouldOutputShow ? (this.state.textAreaOutput) : '' }</div>
            { (!this.state.shouldOutputShow && this.state.loading) && <div className='spinner-border text-success' />}
          </div>
        </div>
        <div className='row ml-2 mt-2'>
          <div className='col-1'>
            <button className='btn btn-primary' onClick={this.handleSubmitClick}>SUBMIT</button>  
          </div>
          <div className='col-11'/>
        </div>
      </div>
    );
  }
}