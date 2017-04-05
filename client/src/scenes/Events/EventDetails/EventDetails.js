import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  AsyncStorage,
  Image,
  TextInput,
  Modal,
  Slider,
  Linking,
  Dimensions
} from 'react-native';
import {
  Button,
  Left,
  Right,
  Body,
  Fab,
  Icon,
  Card,
  List,
  ListItem
} from 'native-base';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ParticipantListItem from '../../../components/ParticipantListItem';
import { isUpcoming } from '../../../utils/common';
import PopupModal from '../../../components/PopupModal';

import styles from './styles';
import { colors, colorsList } from '../../../styles/common';
import { inProgress } from '../../../config/images';

const PARALLAX_HEADER_HEIGHT = 225;
const ICON_TEXT_MARGIN = 15;

class EventDetails extends Component {
  static navigationOptions = {
    header: { visible: false }
  }

  constructor(props) {
    super(props);

    const { datetime, name } = this.props.userEvent.event_detail;
    this.state = {
      date: moment(datetime).format('YYYY-MM-DD'),
      time: moment(datetime).format('HH:mm'),
      active: false,
      eventName: name,
      ratingModal: false,
      userRating: 0
    };
    this.hasEventDetailsChanged = this.hasEventDetailsChanged.bind(this);
    this.handleContinueVoting = this.handleContinueVoting.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.verifyCancelEvent = this.verifyCancelEvent.bind(this);
    this.handleCancelEvent = this.handleCancelEvent.bind(this);
    this.submitRating = this.submitRating.bind(this);
  }

  hasEventDetailsChanged() {
    const { date, time, eventName: tempName } = this.state;
    const { datetime, name } = this.props.userEvent.event_detail;

    const newMoment = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
    const initialMoment = moment(this.props.userEvent.event_detail.datetime);
    const hasDateTimeChanged = !newMoment.isSame(initialMoment, 'minute')
    const hasNameChanged = tempName !== name;

    return hasNameChanged || hasDateTimeChanged;
  }

  handleContinueVoting() {
    const { id: eventId } = this.props.userEvent;
    if (this.props.userEvent.round_num == 0) {
      this.props.getRound(this.props.auth.token.access_token, eventId);
      this.props.navigation.navigate('Swipe', { eventId });
    } else {
      this.props.navigation.navigate('Tournament', { eventId });
    }
  }

  verifyCancelEvent() {
    const isPast = !isUpcoming(this.props.userEvent);
    const cancelOrDelete = isPast ? 'delete' : 'cancel';
    Alert.alert(
      `Are you sure you want to ${cancelOrDelete} this event?`,
      'Participants will be notified.',
      [
        { text: 'Cancel' },
        { text: 'Ok', onPress: this.handleCancelEvent }
      ]);
  }

  handleCancelEvent() {
    const { access_token: accessToken, user_id: userId } = this.props.auth.token;
    const { date, time } = this.state;
    const { id: eventId } = this.props.userEvent;
    this.props.cancelEvent(accessToken, userId, eventId);
  }

  handleSaveChanges() {
    const { access_token: accessToken, user_id: userId } = this.props.auth.token;
    const { date, time, eventName } = this.state;
    const { id: eventId } = this.props.userEvent;
    const eventDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
    this.props.editEventDetails(
      accessToken,
      userId,
      eventId,
      { name: eventName, datetime: eventDateTime.format('YYYY-MM-DD HH:mmZ') },
    );
  }

  submitRating() {
    const { access_token: accessToken, user_id: userId } = this.props.auth.token;
    const { id: eventId } = this.props.userEvent;
    this.setState({ ratingModal: !this.state.ratingModal});
    this.props.eventRating(accessToken, userId, eventId, this.state.userRating);
  }

  renderCardTitle(title) {
    return (
      <Text style={{ fontSize: 24, color: 'black' }}>
        {title}
      </Text>
    )
  }

  renderRestaurantPanel(restaurant) {
    const { name, display_phone, location, url } = restaurant;
    return (
      <Card style={StyleSheet.flatten(styles.card)}>
        {this.renderCardTitle(name)}
        <View style={styles.detail}>
          <Icon name="call" style={StyleSheet.flatten(styles.detailIcon)} />
          <Text style={{ marginLeft: ICON_TEXT_MARGIN }}>{display_phone}</Text>
        </View>
        <View style={styles.detail}>
          <Icon name="navigate" style={StyleSheet.flatten(styles.detailIcon)} />
          <Text style={{ marginLeft: ICON_TEXT_MARGIN }}>
            {`${location.address1}, ${location.city}, ${location.state}`}
          </Text>
        </View>
        <View style={styles.detail}>
          <Icon name="globe" style={{...StyleSheet.flatten(styles.detailIcon), marginLeft: -2}} />
          <Text style={{ marginLeft: ICON_TEXT_MARGIN, color: colors.LINK }} onPress={() => Linking.openURL(url)}>
            Website
          </Text>
        </View>
      </Card>
    );
  }

  render() {
    const { user_id: userId } = this.props.auth.token;
    const {
      round_num: roundNumber,
      event_detail, creator,
      participants,
      round_start,
      round_duration
    } = this.props.userEvent;

    const {
      name,
      invite_code: inviteCode,
      voting_deadline: deadline,
      restaurant,
      datetime
    } = event_detail;

    const isPast = !isUpcoming(this.props.userEvent);
    const votingComplete = !!restaurant;

    return (
      <ParallaxScrollView
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        renderBackground={() => {
          return (
            <View style={{flex: 1, width: null, height: null}}>
            <Image
              source={votingComplete ? {uri: restaurant.image_url} : inProgress}
              resizeMode="cover" style={{height: PARALLAX_HEADER_HEIGHT, width: Dimensions.get('window').width }}/>
            </View>
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

        { /* Show a restaurant panel if there is a winning restaurant */ }
        { votingComplete && this.renderRestaurantPanel(restaurant) }

        <Card style={StyleSheet.flatten(styles.card)}>
          {this.renderCardTitle('Details')}
          <View style={styles.detail}>
            <Icon name="calendar" style={StyleSheet.flatten(styles.detailIcon)} />
            <Text style={{ marginLeft: ICON_TEXT_MARGIN }}>
              Starts {moment(datetime).format('h:mm A on ddd, MMM Do')}
            </Text>
          </View>
          <View style={styles.detail}>
            <Icon name="paper-plane" style={StyleSheet.flatten(styles.detailIcon)} />
            <Text style={{ marginLeft: ICON_TEXT_MARGIN }}>
              Invite Code: {inviteCode}
            </Text>
          </View>
          <View style={styles.detail}>
            <Icon name="stats" style={StyleSheet.flatten(styles.detailIcon)} />
            <Text style={{ marginLeft: ICON_TEXT_MARGIN }}>
              Status: {votingComplete || isPast ? 'Complete' : `In Progress (Round ${roundNumber})`}
            </Text>
          </View>
          {(!votingComplete && !isPast) &&
          <View style={styles.detail}>
            <Icon name="stopwatch" style={StyleSheet.flatten(styles.detailIcon)} />
            <Text style={{ marginLeft: ICON_TEXT_MARGIN }}>
              Round Ends: {moment(round_start).add(round_duration, 'h').format('h:mm A on ddd, MMM Do')}
            </Text>
          </View>
          }
          {(!votingComplete && !isPast) &&
            <Button success block style={StyleSheet.flatten(styles.btn)}
              onPress={this.handleContinueVoting}>
              <Text style={{ color: 'white' }}>Start Round</Text>
            </Button>
          }
        </Card>

        { /* Show an 'admin' panel if the user is the event creator */ }
        {String(creator.id) === String(userId) &&
        (<Card style={StyleSheet.flatten(styles.card)}>
          {this.renderCardTitle('Admin')}
          <Text style={{ marginTop: 15 }}>
            Event Name:
          </Text>
          <TextInput
            onChangeText={(name) => this.setState({ eventName: name })}
            editable={!isPast}
            value={this.state.eventName} />
          <Text style={{ marginTop: 20 }}>
            Event Date: {moment(datetime).format('h:mm A on ddd, MMM Do')}
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
              disabled={isPast}
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
              disabled={isPast}
              showIcon={false}
              onDateChange={(time) => { this.setState({ time }) }} />
          </View>
          <View style={styles.btnContainer}>
            <Button
              success
              block
              disabled={!this.hasEventDetailsChanged()}
              style={StyleSheet.flatten(styles.btn)}
              onPress={this.handleSaveChanges}>
              <Text style={{ color: 'white' }}>Save Changes</Text>
            </Button>
            <Button danger block style={StyleSheet.flatten(styles.btn)}
              onPress={this.verifyCancelEvent}>
              <Text style={{ color: 'white' }}>{isPast ? 'Delete Event' : 'Cancel Event'}</Text>
            </Button>
          </View>
        </Card>)}

        <Card style={StyleSheet.flatten(styles.card)}>
          {this.renderCardTitle('Participants')}
          {participants.map((participant, i) => {
            return (
              <ParticipantListItem
                key={participant.id}
                participant={participant}
                styles={{
                  backgroundColor: colorsList[i % colorsList.length],
                  height: 50,
                  width: 50
                }}
              />
            );
          })}
        </Card>

        { /* Display FAB only when there's a winning restaurant */ }
        {votingComplete && (<Fab
          active={this.state.active}
          direction="up"
          position="bottomRight"
          style={{ backgroundColor: colors.APP_PRIMARY_LIGHT }}
          onPress={() => this.setState({ active: !this.state.active })}>
          <Icon name="menu" />
          <Button
            style={{ backgroundColor: '#EFBE79' }}
            onPress={() => Communications.phonecall(restaurant.phone, true)}>
              <Icon name='call' />
          </Button>
          <Button
            style={{ backgroundColor: '#EFBE79' }}
            onPress={() => this.setState({ ratingModal: !this.state.ratingModal })}>
              <Icon name='md-star' />
          </Button>
          <Button
              style={{ backgroundColor: '#EFBE79' }}
              onPress={() => navigate('Map', { restaurant: restaurant })}>
            <Icon name='locate' />
          </Button>
        </Fab>)}

        <PopupModal
          visible={this.state.ratingModal}
          onClose={() => this.setState({ ratingModal: false })}>
          <View>
            <View style={{alignItems: 'center'}}>
              <Text>{this.state.userRating}</Text>
            </View>
            <Slider
              value={0}
              minimumValue={0}
              maximumValue={5}
              step={0.5}
              onSlidingComplete={(value) => this.setState({ userRating: value })} />
              <Button onPress={() => this.submitRating()}><Text>OK</Text></Button>
          </View>
        </PopupModal>

      </ParallaxScrollView>
    );
  }
}

export default EventDetails;
