import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import Tournament from './Tournament';
import { getRound, putRound } from '../../reducers/Tournament/actions';

var miku = require('../../images/miku.jpg')
var kishimoto = require('../../images/kishimoto.jpg')
var minami = require('../../images/minami.jpg')
var suika = require('../../images/suika.jpg')

// TODO fetch data
const topCards = [
  { yelp_id: 1, name: 'Miku', image: miku, rating: 5 },
  { yelp_id: 3, name: 'Minami', image: minami, rating: 4 },
];
const bottomCards = [
  { yelp_id: 2, name: 'Kishimoto', image: kishimoto, rating: 5 },
  { yelp_id: 4, name: 'Suika', image: suika, rating: 4 },
];

// TODO fetch data
var eventId = 12;
var tournamentId;

class TournamentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      top: topCards,
      bottom: bottomCards,
      user_id: '',
      appAccessToken: '',
    }
  }

  async getTournamentRound() {
    try {
      this.props.getRound(accessToken, eventId);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  async putTournamentRound() {
    try {
      this.props.putRound(accessToken, eventId, tournamentId);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  async componentDidMount() {
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
      Alert.alert('Error', 'Loading Error. Please try again.');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { eventId, tournamentArr } = nextProps;
    this.setState({ eventId, cards: tournamentArr });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Tournament postTournamentRound={this.putTournamentRound.bind(this)}
        getTournamentRound={this.getTournamentRound.bind(this)}
        top={this.state.top}
        bot={this.state.bottom} />
    );
  }
}

const mapStateToProps = function(state) {
  return state.rounds;
}

export default connect(mapStateToProps)(TournamentContainer);