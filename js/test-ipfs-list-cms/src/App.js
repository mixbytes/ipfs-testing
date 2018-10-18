import React, { Component } from 'react';
// import axios from 'axios';
import IPFSUploadWidget from './IPFSUploadWidget.jsx';
//import './App.css';
const IPFS = require('ipfs')



class App extends Component {


  render() {
	
    return (
		<IPFSUploadWidget />
      );                                                                                                                                                                   
  }
}

export default App;
