import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import JoinEvent from './JoinEvent';
import { joinEvent } from '../../../reducers/Events/actions';

var moment = require('moment');

class JoinEventContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appAccessToken: '',
      userId: '',
    }
  }

  static navigationOptions = {
    title: 'Join an Event'
  }

  eventJoin(inviteCode) {
    if (inviteCode) {
      console.log('Join event with: ' + inviteCode);
      this.props.dispatch(joinEvent(this.state.appAccessToken, this.state.userId, inviteCode));
    } else {
      Alert.alert('Error', 'Please enter an invite code');
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(this.props);
    console.log(nextProps);
    if (this.props.events && nextProps.events) {
      if (this.props.events.length < nextProps.events.length) {
        console.log('transition to some page');
      }
    }
  }

  async compoentWillMount() {
    try {
      const appAccessToken = await AsyncStorage.getItem('app_access_token');
      if (appAccessToken) {
        this.setState({ appAccessToken });
      }
      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        this.setState({ userId });
      }
    } catch (error) {
      Alert.alert('Error', 'Loading Error. Please try agin.');
    }
  }

  render() {
    return (
      <JoinEvent eventJoin={ this.eventJoin.bind(this) }/>
    );
  }
}


export default JoinEventContainer;