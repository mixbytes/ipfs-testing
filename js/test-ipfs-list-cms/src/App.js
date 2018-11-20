import React, { Component } from 'react';

import IPFSUploadBrowserNodeWidget from './IPFSUploadBrowserNode.jsx';
import IPFSUploadWebGatewayWidget from './IPFSUploadWebGateway.jsx';
//import './App.css';
import ImageLoader from 'react-load-image';

import axios from 'axios';

class App extends Component {
	componentWillMount() {
    this.setState({
		
    })
  }
	componentDidMount() {
        const self = this;
		let img_url = "https://ipfs.smartz.io/ipfs/QmdyWoRdDHKK9MRF91HEsEw5HMbJJZBmCCAkbbCngiiQDh";
		axios({
			method: 'get',
			url: img_url,
			responseType: 'blob'
   		 }).then(function(response){
         	let reader = new FileReader();
         	reader.readAsArrayBuffer(response.data); 
         	reader.onloadend = function() {
				let urlCreator = window.URL || window.webkitURL;
				
				let  blob = new Blob([reader.result], {type: 'image/jpg'});
				let url = urlCreator.createObjectURL(blob);
				console.log('Inserting an img...');
				let img = new Image();
				img.src = url;
				img.alt = "wfwfw";
				document.body.appendChild(img);
				self.setState({img_base64_datauri: reader.result});
         	}
    	});
   	} 

  render() {
    return (
		
		<div>
			<hr />
			{ this.state && this.state.img_base64_datauri &&
                <img src={this.state.img_base64_datauri} />
            }
			<hr />

			<h3>File upload via in-browser IPFS node using standard api(right way)</h3>
			<IPFSUploadBrowserNodeWidget />
			<br/>
			<br/>
			<br/>
		</div>

      );                                                                                                                                                                   
	/*		<h3>File upload to drectory using simple HTTP PUT request to web gateway on our IPFS node</h3>
			<IPFSUploadWebGatewayWidget /> */
  }
}

export default App;
