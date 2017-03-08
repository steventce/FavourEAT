import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import Tournament from './Tournament';
import { getRound, putRound } from '../../reducers/Tournament/actions';

const accessToken = await AsyncStorage.getItem('app_access_token');

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
var eventId;
var tournamentId;

class TournamentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      top: topCards,
      botom: bottomCards
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

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Tournament postTournamentRound={this.putTournamentRound.bind(this)}
        getTournamentRound={this.getTournamentRound.bind(this)}
        top={this.state.top}
        bot={this.state.bot} />
    );
  }
}

export default connect(TournamentContainer);