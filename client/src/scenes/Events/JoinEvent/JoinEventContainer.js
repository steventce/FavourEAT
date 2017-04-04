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
      access_token: '',
      user_id: '',
      userEvents: []
    }
  }

  static navigationOptions = {
    title: 'Join an Event'
  }

  eventJoin(inviteCode) {
    if (inviteCode) {
      console.log('Join event with: ' + inviteCode);
      this.props.dispatch(joinEvent(this.state.access_token, this.state.user_id, inviteCode));
    } else {
      Alert.alert('Error', 'Please enter an invite code');
    }
  }

  componentWillMount() {
    const { access_token, user_id } = this.props.auth.token;
    const { events } = this.props.event;
    // Save the user's events
    this.setState({ userEvents: events, access_token, user_id });
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    const { events }  = nextProps.event;
    console.log(events);
    if (events && events.length > 0) {
      /*  Instead of comparing the 2 arrays to find the joined event,
      *   have the joined event be added to the last index thus if
      *   there's a diff in length, then the last index is the joined event
      */
      if (this.state.userEvents.length < events.length) {
        console.log(events[events.length - 1]);
        this.props.navigation.navigate('EventDetails',  { userEvent: events[events.length - 1] });
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
  const { auth, event } = state;
  return { auth, event };
}

export default connect(mapStateToProps)(JoinEventContainer);