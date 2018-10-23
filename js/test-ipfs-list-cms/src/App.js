import React, { Component } from 'react';
// import axios from 'axios';
import IPFSUploadWidget from './IPFSUploadWidget.jsx';
import IPFSUpdateWidget from './IPFSUpdateWidget.jsx';
//import './App.css';
const IPFS = require('ipfs')


class App extends Component {


  render() {
	
    return (
		// GET-PUT-directory widget <IPFSUploadWidget />
		<IPFSUpdateWidget />
      );                                                                                                                                                                   
  }
}

export default App;
