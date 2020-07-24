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
      currentLineNumber: 0,
      textAreaInput: '',
      textAreaOutput: '',
      shouldOutputShow: false,
      errorOccured: false,
      loading: false,
    };
    this.lineNumbersRef = React.createRef();
  };
  
  handleTextAreaOnChange = (event) => {
    const textArea = event.currentTarget;
    const lineNumber = textArea.value.substr(0, textArea.selectionStart).split('\n').length;
    const scrollTop = textArea.scrollTop;
    this.setState({
      textAreaInput: textArea.value,
      shouldOutputShow: false,
      currentLineNumber: lineNumber
    }, () => {
      if (this.state.currentLineNumber > 20) {
        this.lineNumbersRef.current.scrollTo({
          top: scrollTop,
          left: 0,
          behaviour: 'smooth'
        });
      }
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
  };
  
  handleSubmitClick = () => {
    
  };
  render () {
    return (
      <div className='bg-whitesmoke'>
        <div className='d-flex justify-content-around mt-1'>
          <Button id='run-button-id-0' classes='shadow rounded-0 btn btn-outline-success' onClick={this.handleRunClick} label='RUN' />
          <Button classes='shadow rounded-0 btn btn-outline-primary' onClick={this.handleSubmitClick} label='SUBMIT'/>  
        </div>
        <div className='row'>
          <div className='ml-2 col-6'>
            <div className='row ml-2'>
              <LineNumbers lineNumbersRef={this.lineNumbersRef} totalLines={this.state.currentLineNumber} classes='col-1 fs-6 mt-2 text-muted mr-5 line-numbers-container'/>
              <textarea onChange={this.handleTextAreaOnChange} className={cx('col-10 border-top-0 border-right-0 border-bottom-0 rounded-0 form-control h-75 fs-6 no-resize')} rows={20} id='code-editor-input'/>
              <div className='col-1' />
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