import ReactDOM from 'react-dom';
import React from 'react';
import {ipcRenderer} from 'electron';

const colorFromChannel = channel => `hsl(${(channel * 20)%100}, 100%, 80%)`;

class MidiGraph extends React.Component {
  componentDidMount() {
    this.ctx = this.canvas.getContext('2d')
    // this.ctx.begin
  }

  componentDidUpdate() {
    // ctx.clearRect(0, 100)
    Object.entries(this.props.messages).forEach(([channel, messages]) => {
      const path = new Path2D(
        messages
          .map(({value}) => value)
          .map((val, i) => `${i === 0 ? 'M' : 'L'} ${i} ${val}`).join(' ')
      );

      this.ctx.strokeStyle = colorFromChannel(channel);
      this.ctx.stroke(path);
    })
  }

  render() {
    return (
      <canvas {...{
        ref: canvas => this.canvas = canvas,

      }}/>
    )
  }
}


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
        {/*<svg viewBox='0 0 200 127'>*/}
          {/*{*/}
            {/*Object.entries(this.state).map(([channel, messages]) => <MidiPath messages={messages} color={colorFromChannel(channel)}/>)*/}
          {/*}*/}
        {/*</svg>*/}
        <MidiGraph {...{
          messages: this.state
        }}/>
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