import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  AsyncStorage,
  TouchableNativeFeedback,
  ListView,
  RefreshControl
} from 'react-native';
import {
  Container,
  Content,
  ListItem,
  Thumbnail,
  Button,
  Left,
  Right,
  Body
} from 'native-base';
import moment from 'moment';
import { colors } from '../../../styles/common';
import styles from './styles';

import Preferences from '../Preferences/index';

class UserEvents extends Component {
  static navigationOptions = {
    header: {
      visible: false
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    }

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.handleViewEventDetails = this.handleViewEventDetails.bind(this);
    this.renderEventRow = this.renderEventRow.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
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
    if (nextProps.status === 'success') {
      this.setState({
        refreshing: false
      });
    }
  }

  renderEventRow(event) {
    const { id, name, datetime } = event.event_detail;
    return (
      <ListItem style={{ margin: 0, padding: 0 }}>
        <TouchableNativeFeedback onPress={this.handleViewEventDetails.bind(null, event)}>
          <View style={styles.container}>
            <Left>
              <Text>{name}</Text>
            </Left>
            <Right>
              <Text>{moment(datetime).format('MMM Do YY, h:mm a')}</Text>
            </Right>
          </View>
        </TouchableNativeFeedback>
      </ListItem>
    );
  }

  render() {
    const { navigate, state } = this.props.navigation;
    const { events, auth } = this.props;
    const dataSource = this.ds.cloneWithRows(events);

    return (
      <Container>
        <Content>
          <View style={{ backgroundColor: colors.APP_PRIMARY_LIGHT }}>
            <Thumbnail large source={{uri: auth.imageUrl}} style={{ alignSelf: 'center', marginTop: 40 }} />
            <Text style={styles.event}>
              Your Events
            </Text>
            <View style={styles.btnContainer}>
              <Button success style={{ margin: 10 }}
                onPress={() => navigate('CreateEvent')}>
                <Text>Start Session</Text>
              </Button>
            </View>
          </View>
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
            renderRow={this.renderEventRow} />
        </Content>
      </Container>
    );
  }
}

export default UserEvents;
