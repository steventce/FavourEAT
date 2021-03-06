import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  ListView,
  RefreshControl,
  Image,
  Dimensions
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

import { homeBackground } from '../../../config/images';
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
      isEmpty: true,
      belongs: (event) => {
        return isUpcoming(event);
      }
    }, {
      id: 'past',
      title: 'Past Events',
      isEmpty: true,
      belongs: (event) => {
        return moment(event.event_detail.datetime).isBefore(moment(new Date()));
      }
    }];
    const rowIds = [];

    for (var i = 0; i < sections.length; i++) {
      const { id, title, belongs, isEmpty } = sections[i];
      dataBlob[id] = { title, isEmpty };

      filteredEvents = events.filter(belongs);
      if (filteredEvents.length > 0) {
        dataBlob[id]['isEmpty'] = false;
      }
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
      <View style={StyleSheet.flatten(styles.sectionHeader)}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionText}>
            {section.isEmpty ? `No ${section.title}` : section.title}
          </Text>
        </View>
      </View>
    );
  }

  renderEventRow(event) {
    const { id, name, datetime, restaurant } = event.event_detail;

    return (
      <View style={{ margin: 0, padding: 0 }}>
        <ListItem onPress={this.handleViewEventDetails.bind(null, event)}>
          <Thumbnail
            source={restaurant ? {uri: restaurant.image_url} : homeBackground}
            style={StyleSheet.flatten(styles.avatar)}
          />
          <Body style={StyleSheet.flatten(styles.body)}>
            <Text style={styles.bodyText}>
              {name}
            </Text>
            <Text style={{ color: colors.FADED_TEXT_DARK }}>
              {restaurant ? `${restaurant.name}` : 'Voting in Progress'}
            </Text>
            <Text style={{ color: colors.FADED_TEXT_DARK }}>
              Starts {moment(datetime).format('h:mm A on ddd, MMM Do')}
            </Text>
          </Body>
        </ListItem>
      </View>
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
                    source={homeBackground}
                    resizeMode="cover" style={{
                      height: PARALLAX_HEADER_HEIGHT,
                      width: Dimensions.get('window').width
                    }} />
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
