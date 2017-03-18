import React, { Component } from 'react';
import JoinEvent from './JoinEvent';

var moment = require('moment');

class JoinEventContainer extends Component {
  static navigationOptions = {
    title: 'Join an Event'
  }

  joinEvent(code) {
    console.log(code);
    console.log(this.props);
  }

  render() {
    return (
      <JoinEvent joinEvent={ this.joinEvent.bind(this) }/>
    );
  }
}


export default JoinEventContainer;