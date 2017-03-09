import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { Spinner } from 'native-base';
import { connect } from 'react-redux';
import Tournament from './Tournament';
import { getRound, putRound } from '../../reducers/Tournament/actions';

class TournamentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: -1,
      cards: [],
      topCards: [],
      botCards: [],
      appAccessToken: '',
    }
  }

  getTournamentRound() {
    try {
      console.log('getTournamentRound');
      this.props.dispatch(getRound(this.state.appAccessToken, this.state.eventId));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  putTournamentRound(restaurants) {
    console.log(restaurants);
    try {
      for (var i = 0; i < restaurants.length - 1; i++) {
        this.props.dispatch(putRound(this.state.appAccessToken, this.state.eventId, restaurants[i].id));
        this.props.dispatch(putRound(this.state.appAccessToken, this.state.eventId, restaurants[i].id));
      }
      // TODO fix hack
      // last restaurant needs to include specific data
      this.props.dispatch(putRound(this.state.appAccessToken, this.state.eventId,
        restaurants[restaurants.length - 1].id, true, this.state.cards,
        () => {
          if (restaurants.length == 1) {
            this.props.navigation.navigate('Winner', { restaurant: restaurants[0].restaurant });
          } else {
            this.setState({ topCards: [], botCards: [] }, () => this.getTournamentRound());
          }
        }));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  async componentWillMount() {
    try {
      const appAccessToken = await AsyncStorage.getItem('app_access_token');
      if (appAccessToken) {
        this.setState({ appAccessToken });
      }
    } catch (error) {
      Alert.alert('Error', 'Loading Error. Please try again.');
    }

    this.setState({ eventId: this.props.navigation.state.params.eventId }, () => this.getTournamentRound());
  }

  componentWillReceiveProps(nextProps) {
    const { tournamentArr } = nextProps;
    // TODO: fix hack by setting tournamentArr to [] in store
    if (tournamentArr.length != this.props.navigation.state.params.hack) {
      if (tournamentArr.length == 1) {
        this.props.navigation.navigate('Winner', { restaurant: tournamentArr[0].restaurant });
      } else {
        this.setState({ cards: tournamentArr });
        var top = [];
        var bot = [];
        for (var i = 0; i < tournamentArr.length; i++) {
          top.push(tournamentArr[i][0])
          bot.push(tournamentArr[i][1]);
        }
        this.setState({ topCards: top, botCards: bot });
      }
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    console.log(this.state);

    if (this.state.topCards.length == 0 || this.state.botCards.length == 0) {
      return <Spinner color='red' style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />
    }

    return (
      <Tournament putTournamentRound={this.putTournamentRound.bind(this)}
        top={this.state.topCards}
        bot={this.state.botCards} />
    );
  }
}

const mapStateToProps = function (state) {
  return state.rounds;
}

export default connect(mapStateToProps)(TournamentContainer);