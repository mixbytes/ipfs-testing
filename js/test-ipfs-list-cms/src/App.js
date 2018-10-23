import React, { Component } from 'react';

import IPFSUploadBrowserNodeWidget from './IPFSUploadBrowserNode.jsx';
import IPFSUploadWebGatewayWidget from './IPFSUploadWebGateway.jsx';
//import './App.css';

class App extends Component {

  render() {
	
    return (
		<div>
			<h3>File upload via in-browser IPFS node using standard api(right way)</h3>
			<IPFSUploadBrowserNodeWidget />
			<br/>
			<br/>
			<br/>
			<h3>File upload to drectory using simple HTTP PUT request to web gateway on our IPFS node</h3>
			<IPFSUploadWebGatewayWidget />
		</div>
      );                                                                                                                                                                   
  }
}

export default App;
