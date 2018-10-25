import ReactDOM from 'react-dom';
import React from 'react';
import {ipcRenderer} from 'electron';

const colorFromChannel = channel => `hsl(${(channel * 20)%100}, 100%, 80%)`;

const MidiPath = ({messages, color}) => (
  <path d={
    messages
      .map(({value}) => value)
      .map((val, i) => `${i === 0 ? 'M' : 'L'} ${i} ${val}`).join(' ')
  } stroke={color} fill='none'/>
)

class Listen extends React.Component {
  state = {
  };

  componentDidMount() {
    ipcRenderer.on('midi-msg', (event, msg) => {
      const {channel} = msg;
      const oldArray = this.state[channel] || [];
      const newArray = [...oldArray, msg];
      this.setState({
        [channel]: newArray
      });
    });
  }

  render() {
    return (
      <div>
        <svg viewBox='0 0 200 127'>
          {
            Object.entries(this.state).map(([channel, messages]) => <MidiPath messages={messages} color={colorFromChannel(channel)}/>)
          }
        </svg>
        <div>
          {JSON.stringify(this.state)}
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Listen/>,
  document.querySelector('#root')
)