import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  AsyncStorage
} from 'react-native';
import {
  Container,
  Content,
  ListItem,
  Thumbnail
} from 'native-base';
import moment from 'moment';
import { fetchEvents } from '../../../reducers/Events/UserEvents/actions';
import styles from './styles';

import Preferences from '../Preferences/index';

class UserEvents extends Component {
  static navigationOptions = {
    header: {
      visible: false
    }
  };

  async componentDidMount() {
    try {
      const appAccessToken = await AsyncStorage.getItem('app_access_token');
      if (appAccessToken) {
        this.props.dispatch(fetchEvents(appAccessToken, 8));
      }
    } catch (error) {
      Alert.alert('Error', 'Loading Error. Please try again.');
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { events } = this.props;
    return (
      <Container>
        <Content>
          <View style={styles.container}>
            <Text style={styles.event}>
              Events Screen
            </Text>
            <Button
                onPress={() => navigate('Preferences')}
                title='Start Session' />
            <Button
                onPress={() => navigate('Preferences')}
                title='Create Event' />
          </View>
          {events.map((event) => {
            const { id, name, datetime } = event.event_detail;
            return (
              <ListItem key={id}>
                <Text>{name}</Text>
                <Text>{moment(datetime).format('DD-MM-YYYY')}</Text>
              </ListItem>
            );
          })}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = function(state) {
  return { events: state.userEvent.events };
};

export default connect(mapStateToProps)(UserEvents);
