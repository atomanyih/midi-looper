import ReactDOM from 'react-dom';
import React from 'react';
var ipcRenderer = require('electron').ipcRenderer;

class Listen extends React.Component {
  state = {};
  componentDidMount() {
    ipcRenderer.on('store-data', (event,store) => {
      this.setState({store});
    });
  }

  render() {
    return (
      <div>
        {JSON.stringify(this.state)}
      </div>
    )
  }
}

ReactDOM.render(
  <Listen>SUP</Listen>,
  document.querySelector('#root')
)