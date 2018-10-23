import React, { Component, PureComponent } from 'react';
import axios from 'axios';
import './App.css';
const IPFS = require('ipfs');

export default class IPFSUpdateWidget extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      msg: '',
      url: null,
    }
		this.node = new IPFS({start: false});

		this.node.on('ready', async () => {
  		try {
    		await this.node.start()
				console.log('ipfs node started!')
			} catch (error) {
				console.log('ERROR: ipfs node failed to start: ' + error);
			}
		});
		this.handleUploadFile = this.handleUploadFile.bind(this);

  }

  readFile = async(file) => {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();

      reader.onload = event => resolve(event.target.result);
      reader.onerror = event => reject(event.target.error);
      reader.onloadstart = event => this.setState({ msg: 'Reading...' });

      reader.readAsText(file);
    });
  }

  handleUploadFile = async(ev) => {
		ev.preventDefault();
    const file = await ev.target.files[0];
		if (!file) {
      this.setState({ msg: "no file" });
			return true
		}
    
    this.setState({ msg: 'Reading file...' });
  	let data = await this.readFile(file);
    this.setState({ msg: 'Uploading to IPFS...' });
		let res = await this.node.files.add(new Buffer(data));
    this.setState({ msg: "file uploaded, url: https://ipfs.smartz.io/ipfs/" + res[0]['hash'] });
		
		console.log(res);
	}

  render() {

    return (
      <div>
        <p>
          <input
            type="file"
            onChange={this.handleUploadFile}
          />
        </p>
        {this.state.url ? (<p>{this.state.url}</p>) : null}
        <p>{this.state.msg}</p>
      </div>
    );
  }
};

