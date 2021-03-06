import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { Spinner } from 'native-base';
import { connect } from 'react-redux';
import Tournament from './Tournament';
import { getRound, putRound } from '../../reducers/Tournament/actions';
import { saveSwipe } from '../../reducers/Swipe/actions';

class TournamentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: -1,
      cards: [],
      topCards: [],
      botCards: [],
      access_token: '',
    }
  }

  static navigationOptions = { header: { visible: false } }

  getTournamentRound() {
    try {
      this.props.dispatch(getRound(this.state.access_token, this.state.eventId));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  putTournamentRound(restaurants) {
    var idArr = [];
    restaurants.map((r) => idArr.push(r.id));
    this.props.dispatch(putRound(this.state.access_token, this.state.eventId, idArr, this.state.cards, 
      (isNext) => {this.setState({ topCards: [], botCards:[] }, () => this.callbackFunction(isNext))}));

    var swipeArr = [];
    restaurants.map((r) => swipeArr.push({
      yelp_id: r.restaurant.yelp_id,
      right_swipe_count: 1
    }));
    this.props.dispatch(saveSwipe(this.props.auth.token.user_id, this.state.access_token, swipeArr));
  }

  callbackFunction(isNext) {
    // can continue?
    if (isNext) {
      this.getTournamentRound();
    } else {
      Alert.alert('Votes casted!', 'Please wait for next round.',
        [{ text: 'OK', onPress: () => this.props.navigation.navigate('HomeDrawer') }],
        { cancelable: false });
    }
  }

  componentWillMount() {
    const { access_token } = this.props.auth.token;

    this.setState({ access_token, eventId: this.props.navigation.state.params.eventId },
      () => this.getTournamentRound());
  }

  componentWillReceiveProps(nextProps) {
    const { tournamentArr } = nextProps.rounds;
    if (tournamentArr) {
      /*  If there is only a single restaurant returned 
      *   and it isn't nested into an array,
      *   then it is the winning restaurant.
      */
      if (tournamentArr.length == 1 && !Array.isArray(tournamentArr[0])) {
        this.props.navigation.navigate('Winner', { restaurant: tournamentArr[0] });
      } else if (this.state.cards.length == 0 || this.state.cards.length >= tournamentArr.length) {
        /*  A tournament rounds is returned in an array of pairs
        *   of restaurants i.e. [ [a,b], [c,d] ... ].
        *   Since only one restaurant from the pairing can advance,
        *   the next round's array must be shorter length
        *   or equal if there are 3 remaining restaurants.
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
  const { auth, rounds } = state;
  return { auth, rounds };
}

export default connect(mapStateToProps)(TournamentContainer);
