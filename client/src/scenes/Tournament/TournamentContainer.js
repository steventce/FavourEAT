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
var eventId = 8;
var tournamentId;

class TournamentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      top: topCards,
      bottom: bottomCards
    }
  }

  async getTournamentRound() {
    const accessToken = await AsyncStorage.getItem('app_access_token');
    
    try {
      this.props.getRound(accessToken, eventId);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  async putTournamentRound() {
    const accessToken = await AsyncStorage.getItem('app_access_token');
    
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
        bot={this.state.bottom} />
    );
  }
}

const mapStateToPProps = function(state) {
  return state.rounds;
}

export default connect(mapStateToPProps)(TournamentContainer);