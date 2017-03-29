import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableNativeFeedback,
  ListView,
  RefreshControl,
  Image
} from 'react-native';
import {
  Container,
  Content,
  ListItem,
  Thumbnail,
  Button,
  Left,
  Right,
  Body,
  Card
} from 'native-base';
import moment from 'moment';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { isUpcoming } from '../../../utils/common';

import backgroundImg from '../../../images/suika.jpg';
import { colors } from '../../../styles/common';
import styles, { PARALLAX_HEADER_HEIGHT } from './styles';

class UserEvents extends Component {
  static navigationOptions = {
    header: {
      visible: false
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      numUpcomingEvents: 0
    }

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });
    this.handleViewEventDetails = this.handleViewEventDetails.bind(this);
    this.renderEventRow = this.renderEventRow.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  // Adapted from Spencer Carli:
  // https://medium.com/differential/react-native-basics-how-to-use-the-listview-component-a0ec44cf1fe8#.p4466zws2
  getEventListData(events) {
    const dataBlob = {};
    const sections = [{
      id: 'upcoming',
      title: 'Upcoming Events',
      belongs: (event) => {
        return isUpcoming(event);
      }
    }, {
      id: 'past',
      title: 'Past Events',
      belongs: (event) => {
        return moment(event.event_detail.datetime).isBefore(moment(new Date()));
      }
    }];
    const rowIds = [];

    for (var i = 0; i < sections.length; i++) {
      const { id, title, belongs } = sections[i];
      dataBlob[id] = { title };

      filteredEvents = events.filter(belongs);
      // Add the eventId: eventData into the blob
      for (var j = 0; j < filteredEvents.length; j++) {
        const event = filteredEvents[j];
        dataBlob[id][event.id] = event;
      }

      // Add the row ids for this section
      filteredIds = filteredEvents.map(event => event.id);
      rowIds.push(filteredIds);
    }

    return {
      dataBlob,
      sectionIds: sections.map(section => section.id),
      rowIds
    };
  }

  handleViewEventDetails(userEvent, event) {
    const { navigate } = this.props.navigation;
    navigate('EventDetails', { userEvent });
  }

  handleRefresh() {
    const { access_token, user_id } = this.props.auth.token;
    this.setState({ refreshing: true });
    this.props.fetchEvents(access_token, user_id);
  }

  componentDidMount() {
    const { access_token, user_id } = this.props.auth.token;
    this.props.fetchEvents(access_token, user_id);
  }

  componentWillReceiveProps(nextProps) {
    const { status, events } = nextProps;
    if (status === 'success') {
      this.setState({
        refreshing: false
      });
    }

    const numUpcomingEvents = events.filter(isUpcoming).length;
    if (numUpcomingEvents.length !== this.state.numUpcomingEvents) {
      this.setState({ numUpcomingEvents });
    }
  }

  renderSectionHeader(section) {
    return (
      <Card style={StyleSheet.flatten(styles.sectionHeader)}>
        <View style={styles.container}>
          <Text>{section.title}</Text>
        </View>
      </Card>
    );
  }

  renderEventRow(event) {
    const { id, name, datetime, restaurant } = event.event_detail;

    return (
      <Card style={{ margin: 0, padding: 0 }}>
        <TouchableNativeFeedback onPress={this.handleViewEventDetails.bind(null, event)}>
          <View style={styles.container}>
            <Left>
              <Text>{name}</Text>
              <Text>{restaurant ? restaurant.name : 'Voting in Progress'}</Text>
            </Left>
            <Right>
              <Text>{moment(datetime).format('ddd, MMM Do @ h:mm A')}</Text>
            </Right>
          </View>
        </TouchableNativeFeedback>
      </Card>
    );
  }

  render() {
    const { navigate, state } = this.props.navigation;
    const { events, auth } = this.props;

    const { dataBlob, sectionIds, rowIds } = this.getEventListData(events);
    const dataSource = this.ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds);

    return (
      <ListView
        dataSource={dataSource}
        enableEmptySections={true}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            colors={[colors.APP_PRIMARY_LIGHT, colors.APP_PRIMARY_DARK]}
          />
        }
        renderSectionHeader={this.renderSectionHeader}
        renderRow={this.renderEventRow}
        renderScrollComponent={(props) => {
          return (
            <ParallaxScrollView
              {...props}
              parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
              renderBackground={() => {
                return (
                  <Image
                    source={backgroundImg}
                    resizeMode="cover" style={{ height: PARALLAX_HEADER_HEIGHT }} />
                );
              }}
              renderForeground={() => {
                return (
                  <View style={styles.foreground}>
                    <Thumbnail
                      large
                      source={{uri: auth.imageUrl}}
                      style={StyleSheet.flatten(styles.thumbnail)} />
                    <Text style={styles.event}>
                      Your Events
                    </Text>
                    <Text style={styles.upcomingCount}>
                      {this.state.numUpcomingEvents} Upcoming Events
                    </Text>
                    <View style={styles.btnContainer}>
                      <Button bordered light style={StyleSheet.flatten(styles.createEventBtn)}
                        onPress={() => navigate('Preferences')}>
                        <Text style={{ color: 'white' }}>Single Session</Text>
                      </Button>
                      <Button bordered light style={StyleSheet.flatten(styles.createEventBtn)}
                        onPress={() => navigate('CreateEvent')}>
                        <Text style={{ color: 'white' }}>Create an Event</Text>
                      </Button>
                    </View>
                  </View>
                );
              }}
            >
            </ParallaxScrollView>
          );
        }}
      />
    );
  }
}

export default UserEvents;
