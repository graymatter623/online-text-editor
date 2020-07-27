import React from 'react';
import cx from 'classnames';

export default function LineNumbers (props) {
  return (
    <div ref={props.lineNumbersRef} className={cx('d-flex flex-column', props.classes)}>
      {
        [...new Array(props.totalLines)].map((val, index) => (<div className={cx(props.highlightedLine === (index + 1) ? '' : '')} key={index}>{index + 1}</div>))
      }
    </div>
  );
}