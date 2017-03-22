import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  AsyncStorage,
  TouchableNativeFeedback
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
import { fetchEvents } from '../../../reducers/Events/actions';
import { colors } from '../../../styles/common';
import styles from './styles';
import { logo, thumbnail } from '../../../config/images';

import Preferences from '../Preferences/index';

class UserEvents extends Component {
  static navigationOptions = {
    header: {
      visible: false
    }
  };

  constructor(props) {
    super(props);
    this.handleViewEventDetails = this.handleViewEventDetails.bind(this);
  }

  handleViewEventDetails(userEvent, event) {
    const { navigate } = this.props.navigation;
    navigate('EventDetails', { userEvent });
  }

  async componentDidMount() {
    try {
      const appAccessToken = await AsyncStorage.getItem('app_access_token');
      const userId = await AsyncStorage.getItem('user_id');
      if (appAccessToken) {
        this.props.dispatch(fetchEvents(appAccessToken, userId));
      }
    } catch (error) {
      Alert.alert('Error', 'Loading Error. Please try again.');
    }
  }

  render() {
    const { navigate, state } = this.props.navigation;
    const { events } = this.props;
    return (
      <Container>
        <Content>
          <View style={{ backgroundColor: colors.APP_PRIMARY_LIGHT }}>
            <Thumbnail size={100} source={thumbnail} style={{ alignSelf: 'center', marginTop: 40 }} />
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
          {events.map((event) => {
            const { id, name, datetime } = event.event_detail;
            return (
              <ListItem key={id} style={{ margin: 0, padding: 0 }}>
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
          })}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = function(state) {
  return { events: state.event.events };
};

export default connect(mapStateToProps)(UserEvents);
