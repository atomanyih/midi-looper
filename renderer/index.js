import ReactDOM from 'react-dom';
import React from 'react';
import {ipcRenderer} from 'electron';
import groupBy from 'lodash/groupBy'
import LoopGraph from "./LoopGraph";

// const groupBy = (xs, key) => {
//   return xs.reduce((rv, x) => {
//     (rv[x.msg[key]] = rv[x.msg[key]] || []).push(x);
//     return rv;
//   }, {});
// };


const colorFromChannel = channel => `hsl(${(channel * 20) % 100}, 100%, 80%)`;

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


class Listen extends React.Component {
  state = {
    mainState: {
      loops: []
    }
  };

  componentDidMount() {
    // ipcRenderer.on('midi-msg', (event, msg) => {
    //   const {channel} = msg;
    //   const oldArray = this.state[channel] || [];
    //   const newArray = [...oldArray, msg];
    //   this.setState({
    //     [channel]: newArray
    //   });
    // });

    ipcRenderer.on('state-update', (_, state) => {
      this.setState({
        mainState: state
      })
    })
  }

  render() {
    const {mainState} = this.state
    // this.state.mainState.loops.reduce()
    // const loops = groupBy(this.state.mainState.loops || [], 'msg.channel');
    // console.log(loops)
    return (
      <div>
        {mainState.playing ? 'yup' : 'nope'}
        {/*<svg viewBox='0 0 200 127'>*/}
        {/*{*/}
        {/*Object.entries(this.state).map(([channel, messages]) => <MidiPath messages={messages} color={colorFromChannel(channel)}/>)*/}
        {/*}*/}
        {/*</svg>*/}
        {/*<MidiGraph {...{*/}
        {/*messages: this.state*/}
        {/*}}/>*/}

        {/*{*/}
          {/*loops.map(loop => (*/}
            {/*<svg viewBox={`0 0 ${loop[loop.length-1].t} 127`}>*/}
              {/*<MidiPath {...{*/}
                {/*events: loop*/}
              {/*}}/>*/}
            {/*</svg>*/}
          {/*))*/}
        {/*}*/}
        {
          mainState.loops.map( loop => <div><LoopGraph loop={loop}/></div>)
        }
        <div>
          <pre>
          {
            JSON.stringify({
              ...mainState,
              loops: '[this is to long to be worth printing]'
            }, null, 2)
          }
          </pre>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Listen/>,
  document.querySelector('#root')
)