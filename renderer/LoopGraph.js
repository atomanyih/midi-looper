import React from "react";

import styled from 'styled-components';

const SvgBackground = styled.svg`
  background-color: rgb(255,255,255);
  border: 1px solid grey
`;

const MidiPath = ({events, color, ...props}) => {
  const d = events
    .map(({t, msg: {value}}) => [t, 127 - value])
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')

  return (
    <path {...props} d={d} stroke={color} fill='none'/>
  )
};


const LoopGraph = ({loop}) => {
  return (
    <SvgBackground viewBox={`0 0 ${loop.duration} 127`} height={25}>
      <MidiPath events={loop.events} color='black' strokeWidth={2}/>
    </SvgBackground>
  )
}

export default LoopGraph;