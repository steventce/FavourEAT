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

  static navigationOptions = { header: { visible: false } }

  getTournamentRound() {
    try {
      this.props.dispatch(getRound(this.state.appAccessToken, this.state.eventId));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  putTournamentRound(restaurants) {
    try {
      for (var i = 0; i < restaurants.length - 1; i++) {
        this.props.dispatch(putRound(this.state.appAccessToken, this.state.eventId, restaurants[i].id));
      }
      // last restaurant needs to include specific data
      this.props.dispatch(putRound(this.state.appAccessToken, this.state.eventId,
        restaurants[restaurants.length - 1].id, true, this.state.cards,
        () => {
          this.setState({ topCards: [], botCards: [] }, () => this.getTournamentRound());
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
    if (tournamentArr) {
      /*  If there is only a single restaurant returned 
      *   and it isn't nested into an array,
      *   then it is the winning restaurant.
      */
      if (tournamentArr.length == 1 && !Array.isArray(tournamentArr[0])) {
        this.props.navigation.navigate('Winner', { restaurant: tournamentArr[0] });
      } else if (this.state.cards.length == 0 || this.state.cards.length > this.props.tournamentArr.length) {
        /*  A tournament rounds is returned in an array of pairs
        *   of restaurants i.e. [ [a,b], [c,d] ... ].
        *   Since only once restaurant from the pairing can advance,
        *   the next round's array must be shorter length.
        */
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
