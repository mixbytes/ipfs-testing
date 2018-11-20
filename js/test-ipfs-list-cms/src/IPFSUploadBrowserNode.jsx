import React, { Component, PureComponent } from 'react';
import axios from 'axios';
import './App.css';
//const IPFS = require('ipfs');
//const Buffer = window.IpfsApi().Buffer;

const ipfsAPI = require('ipfs-api')
// create a stream from a file, which enables uploads of big files without allocating memory twice
const fileReaderPullStream = require('pull-file-reader')

export default class IPFSUploadBrowserNodeWidget extends PureComponent {
  constructor () {
    super()
    this.state = {
      added_file_hash: null
    }
    this.ipfsApi = ipfsAPI({host: 'ipfs.twitch666.mixbytes.io', port: '5001', protocol: 'https'});

    // bind methods
    this.captureFile = this.captureFile.bind(this)
    this.saveToIpfs = this.saveToIpfs.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  captureFile (event) {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    if (document.getElementById("keepFilename").checked) {
      this.saveToIpfsWithFilename(file)
    } else {
      this.saveToIpfs(file)
    }
  }

  // Example #1
  // Add file to IPFS and return a CID
  saveToIpfs (file) {
    let ipfsId
    const fileStream = fileReaderPullStream(file)
    this.ipfsApi.add(fileStream, { progress: (prog) => console.log(`received: ${prog}`) })
      .then((response) => {
        console.log(response)
        ipfsId = response[0].hash
        console.log(ipfsId)
        this.setState({added_file_hash: ipfsId})
      }).catch((err) => {
        console.error(err)
      })
  }

  // Example #2
  // Add file to IPFS and wrap it in a directory to keep the original filename
  saveToIpfsWithFilename (file) {
    let ipfsId
    const fileStream = fileReaderPullStream(file)
    const fileDetails = {
      path: file.name,
      content: fileStream
    }
    const options = {
      wrapWithDirectory: true,
      progress: (prog) => console.log(`received: ${prog}`)
    }
    this.ipfsApi.add(fileDetails, options)
      .then((response) => {
        console.log(response)
        // CID of wrapping directory is returned last
        ipfsId = response[response.length-1].hash
        console.log(ipfsId)
        this.setState({added_file_hash: ipfsId})
      }).catch((err) => {
        console.error(err)
      })
  }

  handleSubmit (event) {
    event.preventDefault()
  }



  render() {

    return (

	<div>
        <form id='ipfsUploadForm' onSubmit={this.handleSubmit}>
          <input type='file' onChange={this.captureFile} /><br/>
          <label htmlFor='keepFilename'><input type='checkbox' id='keepFilename' name='keepFilename' /> keep filename</label>
        </form>
        <div>
          <a target='_blank'
            href={'https://ipfs.smartz.io/ipfs/' + this.state.added_file_hash}>
            {this.state.added_file_hash}
          </a>
		  <br/>
		  <img src={'https://ipfs.smartz.io/ipfs/' + this.state.added_file_hash} />
        </div>
      </div>
    );
  }
};

