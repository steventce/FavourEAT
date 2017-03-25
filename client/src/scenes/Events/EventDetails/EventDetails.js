import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  AsyncStorage,
  Image
} from 'react-native';
import {
  Button,
  Left,
  Right,
  Body,
  Fab,
  Icon,
  Card
} from 'native-base';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import styles from './styles';
import { colors } from '../../../styles/common';
import { logo } from '../../../config/images';

const PARALLAX_HEADER_HEIGHT = 225;

class EventDetails extends Component {
  constructor(props) {
    super(props);

    const datetime = this.props.userEvent.event_detail.datetime;
    this.state = {
      date: moment(datetime).format('YYYY-MM-DD'),
      time: moment(datetime).format('HH:mm'),
      active: false,
      // TODO: Fetch values from the store
      userId: null,
      accessToken: null
    }
    this.hasDatetimeChanged = this.hasDatetimeChanged.bind(this);
    this.handleContinueVoting = this.handleContinueVoting.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleCancelEvent = this.handleCancelEvent.bind(this);
  }

  async componentDidMount() {
    try {
      const accessToken = await AsyncStorage.getItem('app_access_token');
      const userId = await AsyncStorage.getItem('user_id');
      if (userId && accessToken) {
        this.setState({
          userId,
          accessToken
        });
        this.props.dispatch(fetchEvents(accessToken, userId));
      }
    } catch (error) {
      Alert.alert('Error', 'Loading Error. Please try again.');
    }
  }

  hasDatetimeChanged() {
    const { date, time } = this.state;
    const newMoment = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
    const initialMoment = moment(this.props.userEvent.event_detail.datetime);

    return !newMoment.isSame(initialMoment, 'minute');
  }

  handleContinueVoting() {
    const { id: eventId } = this.props.userEvent;
    // TODO: Navigate
    // this.props.navigation.navigate('Tournament', eventId);
  }

  handleCancelEvent() {
    const { accessToken, userId, date, time } = this.state;
    const { id: eventId } = this.props.userEvent;
    this.props.cancelEvent(accessToken, userId, eventId);
  }

  handleSaveChanges() {
    const { accessToken, userId, date, time } = this.state;
    const { id: eventId } = this.props.userEvent;
    const eventDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
    this.props.editEventDetails(accessToken, userId, eventId, eventDateTime.format('YYYY-MM-DD HH:mmZ'));
  }

  renderCardTitle(title) {
    return (
      <Text style={{ fontSize: 24 }}>
        {title}
      </Text>
    )
  }

  render() {
    const { round_num: roundNumber, event_detail, creator } = this.props.userEvent;

    const {
      name,
      description,
      invite_code: inviteCode,
      voting_deadline: deadline,
      restaurant,
      datetime
    } = event_detail;

    return (
      <ParallaxScrollView
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        renderBackground={() => {
          return (
            <Image
              source={restaurant ? {uri: restaurant.image_url} : logo}
              resizeMode="cover" style={{ height: PARALLAX_HEADER_HEIGHT }} />
          );
        }}
        renderForeground={() => {
          return (
            <View style={styles.foreground}>
              <View style={styles.foregroundContent}>
                <Text style={styles.foregroundTitle}>
                  {name}
                </Text>
                {restaurant && (
                  <Text style={styles.foregroundSubTitle}>
                    {restaurant.name}
                  </Text>
                )}
              </View>
            </View>
          );
        }}
        >

        <Card style={StyleSheet.flatten(styles.card)}>
          {this.renderCardTitle('Details')}
          <Text>
            {description}
          </Text>
          <Text>
            Status: In Progress (Round {roundNumber})
          </Text>
          <Button success block style={StyleSheet.flatten(styles.btn)}
            onPress={this.handleContinueVoting}>
            <Text>Start Round</Text>
          </Button>
        </Card>

        { /* Show an 'admin' panel if the user is the event creator */ }
        {String(creator.id) === String(this.state.userId) &&
        (<Card style={StyleSheet.flatten(styles.card)}>
          {this.renderCardTitle('Admin')}
          <Text>
            You are the creator of this event.
          </Text>
          <Text>
            Event Date: {moment(datetime).format('ddd, MMM Do @ h:mm A')}
          </Text>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <DatePicker
              date={this.state.date}
              mode="date"
              style={StyleSheet.flatten(styles.datePicker)}
              customStyles={{ dateInput: StyleSheet.flatten(styles.dateInput) }}
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              minDate={new Date()}
              showIcon={false}
              onDateChange={(date) => { this.setState({ date }) }} />
            <DatePicker
              date={this.state.time}
              mode="time"
              style={StyleSheet.flatten(styles.datePicker)}
              customStyles={{ dateInput: StyleSheet.flatten(styles.dateInput) }}
              format="HH:mm"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              minDate={new Date()}
              showIcon={false}
              onDateChange={(time) => { this.setState({ time }) }} />
          </View>
          <View style={styles.btnContainer}>
            <Button
              success
              block
              disabled={!this.hasDatetimeChanged()}
              style={StyleSheet.flatten(styles.btn)}
              onPress={this.handleSaveChanges}>
              <Text>Save Changes</Text>
            </Button>
            <Button success block style={StyleSheet.flatten(styles.btn)}
              onPress={this.handleCancelEvent}>
              <Text>Cancel Event</Text>
            </Button>
          </View>
        </Card>)}

        { /* TODO: Show a list of participants */ }
        <Card style={StyleSheet.flatten(styles.card)}>
          {this.renderCardTitle('Participants')}
        </Card>
        <Fab
          active={this.state.active}
          direction="up"
          position="bottomRight"
          style={{ backgroundColor: colors.APP_PRIMARY_LIGHT }}
          onPress={() => this.setState({ active: !this.state.active })}>
          <Icon name="md-star" />
        </Fab>
      </ParallaxScrollView>
    );
  }
}

export default EventDetails;
