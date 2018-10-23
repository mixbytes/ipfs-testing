import React, { Component, PureComponent } from 'react';
import axios from 'axios';
import './App.css';

export default class IPFSUploadWebGatewayWidget extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      msg: '',
      url: null,
	  uploadEndpoint: 'https://ipfs.dapplist-hackathon.curation.network',
	  emptyDirHash: 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn',
    }
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();

      reader.onload = event => resolve(event.target.result);
      reader.onerror = event => reject(event.target.error);
      reader.onloadstart = event => this.setState({ msg: 'Reading...' });

      reader.readAsText(file);
    });
  }

  uploadIpfs(data) {
    return axios.put(this.state.uploadEndpoint + '/ipfs/' + this.state.emptyDirHash + '/file', data);
  }

  onChange = event => {
    const { onChange } = this.props;
    const file = event.target.files[0];

    if (!file) {
      this.setState({ msg: null }, onChange(null));
    } else {
      this.readFile(file)
        .then(data => {
          this.data = data;
          this.setState({ msg: 'Uploading to IPFS...' });
          return this.uploadIpfs(data)
        })
        .then(resp => {
          let url = this.state.uploadEndpoint + resp.headers.location;
          this.setState({ msg: url });
        });
    }
  };

  render() {
    const { id, readonly, disabled, autofocus = false } = this.props;

    return (
      <div>
        <p>
          <input
            ref={ref => (this.inputRef = ref)}
            id={id}
            type="file"
            disabled={readonly || disabled}
            defaultValue=""
            autoFocus={autofocus}
            multiple={false}
            className={"form-control"}
            placeholder={"url to file consist airdrop list"}
            onChange={this.onChange}
          />
        </p>
        {this.state.url ? (<p>{this.state.url}</p>) : null}
        <p>{this.state.msg}</p>
      </div>
    );
  }
};

