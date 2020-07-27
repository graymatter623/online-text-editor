import React from 'react';
import { editorApiBaseUrl } from '../../utility/constants';
import fetch from 'isomorphic-fetch';
import './styles.scss';
import cx from 'classnames';
import Menu from '../Menu';
import LineNumbers from '../LineNumbers';

export default class App extends React.PureComponent {
  constructor () {
    super();
    this.state = {
      selectedLanguage: '',
      currentLineNumber: 0,
      prevFocusedLine: 0,
      focusedLine: 0,
      textAreaInput: '',
      textAreaOutput: '',
      shouldOutputShow: false,
      errorOccured: false,
      loading: false,
    };
    this.lineNumbersRef = React.createRef();
    this.languages = [
      { language: 'Node js', scriptType: 'node' },
      { language: 'Python', scriptType: 'python' },
      { language: 'Java', scriptType: 'java' },
      { language: 'C++', scriptType: 'cpp' },
      { language: 'HTML', scriptType: 'html' },
    ];
  };
  
  handleTextAreaOnChange = (event) => {
    const textArea = event.currentTarget;
    const scrollTop = textArea.scrollTop;
    const currentLineNumber = textArea.value.substr(0, textArea.selectionStart).split('\n').length;
    this.setState({
      currentLineNumber,
      textAreaInput: textArea.value,
      shouldOutputShow: false,
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

  handleKeyPress = (event) => {
    if (event.keyCode === 38) { // UP
      console.log(this.state.focusedLine);
      if (this.state.currentLineNumber > 0) {
        this.setState({
          focusedLine: this.state.currentLineNumber > 0 && this.state.focusedLine > 0 ? this.state.focusedLine - 1 : 1,
          prevFocusedLine: this.state.focusedLine
        });
      }
    }
    
    if (event.keyCode === 40) { // DOWN
      console.log(this.state.focusedLine);
      this.setState({
        focusedLine: this.state.focusedLine + 1,
        prevFocusedLine: this.state.focusedLine
      });  
    } 

    if (event.keyCode === 13) { // ENTER
      console.log(this.state.focusedLine);
      this.setState({
        prevFocusedLine: this.state.focusedLine,
        focusedLine: this.state.focusedLine + 1,
      });
    }
  };

  handleLanguageSelect = (event) => {
    this.setState({
      selectedLanguage: event.currentTarget.innerHTML
    });
  }

  handleRunClick = () => {
    this.setState({
      loading: true,
    });

    const language = this.languages.find((value) => (value.language === this.state.selectedLanguage) ? value.scriptType : '' );
    const options = {
      body: JSON.stringify({ 
        code: this.state.textAreaInput,
        scriptTypr: language.scriptType,
       }) || {},
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST'
    };
    
    if (language.scriptType !== 'html'){
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
            textAreaOutput: data.output,
            loading: false,
            errorOccured: true,
          });
        }
      }).catch(err => console.log(err));
    } else {
      this.setState({
        textAreaOutput: this.state.textAreaInput,
        shouldOutputShow: true,
        loading: false,
        errorOccured: false,
      });
    }
  };
  
  handleSubmitClick = () => {
    
  };
  render () {
    return (
      <div className='bg-whitesmoke'>
        <div className='mt-1'>
          <Menu languages={this.languages} onLanguageSelect={this.handleLanguageSelect} handleRunClick={this.handleRunClick} handleSubmitClick={this.handleSubmitClick} />
        </div>
        <div className='row'>
          <div className='col-6'>
            <div className='row'>
              <LineNumbers lineNumbersRef={this.lineNumbersRef} highlightedLine={this.state.focusedLine} totalLines={this.state.currentLineNumber} classes='col-1 fs-6 mt-2 text-muted line-numbers-container'/>
              <div className='col-10'>
                <textarea onKeyPress={this.handleKeyPress} onKeyUp={this.handleKeyPress} onKeyDown={this.handleKeyPress} onChange={this.handleTextAreaOnChange} className={cx('border-bottom rounded-0 form-control fs-6 no-resize')} rows={20} id='code-editor-input'/>
              </div>
              <div className='col-1' />
            </div>
          </div>
          <div className='col-5 bg-white border'>
            { this.state.shouldOutputShow && this.state.selectedLanguage !== 'HTML' && <div className={cx(this.state.errorOccured ? 'text-danger' : 'text-success')}>{ this.state.textAreaOutput }</div>}
            { (!this.state.shouldOutputShow && this.state.loading) && <div className='spinner-border text-primary' />}
            { this.state.shouldOutputShow && this.state.selectedLanguage === 'HTML' && <iframe id='html-iframe-division' allowFullScreen={true}> { this.state.textAreaOutput }</iframe>}
          </div>
          <div className='col-1' />
        </div>
      </div>
    );
  }
}