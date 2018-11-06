import React from "react";

import styled from 'styled-components';
import pathStringFromEvents from './pathStringFromEvents';

const SvgBackground = styled.svg`
  background-color: rgb(255,255,255);
  border: 1px solid grey
`;

const MidiPath = ({events, color, ...props}) => {
  const pathStrings = pathStringFromEvents(events);

  return pathStrings.map(d => <path {...props} d={d} stroke={color} fill='none'/>);
};


const LoopGraph = ({loop}) => {
  return (
    <SvgBackground viewBox={`0 0 ${loop.duration} 127`} height={25}>
      <MidiPath events={loop.events} color='black' strokeWidth={2}/>
    </SvgBackground>
  )
}

export default LoopGraph;