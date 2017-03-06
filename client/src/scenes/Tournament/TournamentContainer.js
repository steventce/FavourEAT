import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import Tournament from './Tournament';
import { getRound, postRound } from '../../reducers/Tournament/actions';

class TournamentContainer extends Component {
  async getTournamentRound() {
    try {

    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  async postTournamentRound(){
    try{

    } catch(error){
      Alert.alert('Error', error.message);      
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Tournament postTournamentRound={this.postTournamentRound.bind(this)}
      getTournamentRound={this.getTournamentRound.bind(this)}/>
    );
  }
}

export default connect(TournamentContainer);