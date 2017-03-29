import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import JoinEvent from './JoinEvent';
import { joinEvent } from '../../../reducers/Events/actions';

var moment = require('moment');

class JoinEventContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appAccessToken: '',
      userId: '',
      userEvents: []
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

  async componentWillMount() {
    // Save the user's events
    this.setState({ userEvents: this.props.events });
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

  componentWillReceiveProps(nextProps) {
    const { events }  = nextProps;
    if (events) {
      /*  Instead of comparing the 2 arrays to find the joined event,
      *   have the joined event be added to the last index thus if
      *   there's a diff in length, then the last index is the joined event
      */
      if (this.state.userEvents.length < events.length) {
        console.log(events[events.length - 1]);
        //this.props.navigation.navigate('EventDetails',  params: { event: events[events.length - 1] });
      } else {
        // already participating in this event
        Alert.alert('Error', 'Already registered in this event.');
      }
    }
  }

  render() {
    return (
      <JoinEvent eventJoin={ this.eventJoin.bind(this) }/>
    );
  }
}

const mapStateToProps = function (state) {
  return state.event;
}

export default connect(mapStateToProps)(JoinEventContainer);