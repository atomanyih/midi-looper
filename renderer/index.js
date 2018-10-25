import ReactDOM from 'react-dom';
import React from 'react';
import {ipcRenderer} from 'electron';


class Listen extends React.Component {
  state = {
    midiMessages: []
  };
  componentDidMount() {
    ipcRenderer.on('midi-msg', (event,msg) => {
      let newArray = [...this.state.midiMessages, msg];
      if(newArray.length > 200) {
        newArray = newArray.slice(newArray.length - 200)
      }
      this.setState({
        midiMessages: newArray
      });
    });
  }

  render() {
    const path = this.state.midiMessages
      .map(({value}) => value)
      .map((val, i) => `${i === 0 ? 'M' : 'L'} ${i} ${val}`).join(' ');

    return (
      <div>
        <svg viewBox='0 0 200 127' stroke='white' fill='none'>
          <path d={path}/>
        </svg>
        {/*<div>*/}
          {/*{JSON.stringify(this.state)}*/}
        {/*</div>*/}
      </div>
    )
  }
}

ReactDOM.render(
  <Listen/>,
  document.querySelector('#root')
)