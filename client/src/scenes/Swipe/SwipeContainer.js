import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Spinner } from 'native-base';
import { connect } from 'react-redux';
import Swipe from './Swipe';
import { saveSwipe } from '../../reducers/Swipe/actions';
import { getRound, putRound } from '../../reducers/Tournament/actions';

class SwipeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: -1,
      cards: [],
      user_id: '',
      access_token: '',
    }
    this.gotoTournament = this.gotoTournament.bind(this);
  }

  static navigationOptions = { header: { visible: false } }

  // NOT USED FOR DEMO
  // needs to be updated to use data properly
  // i.e. leftSwipes.id
  postSwipe(leftSwipes, rightSwipes) {
    try {
      for (var i = 0; i < leftSwipes.length; i++) {
        this.props.dispatch(saveSwipe(this.state.user_id, this.state.access_token, leftSwipes[i].restaurant.yelp_id, 1, 0));
      }
      for (var i = 0; i < rightSwipes.length; i++) {
        this.props.dispatch(saveSwipe(this.state.user_id, this.state.access_token, rightSwipes[i].restaurant.yelp_id, 0, 1));
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  nextRound(restaurants) {
    try {
      for (var i = 0; i < restaurants.length - 1; i++) {
        this.props.dispatch(putRound(this.state.access_token, this.state.eventId, restaurants[i].id));
      }
      // last restaurant needs to include specific data
      this.props.dispatch(putRound(this.state.access_token, this.state.eventId,
        restaurants[restaurants.length - 1].id, true, this.state.cards,
        (isNext) => this.gotoTournament(isNext)));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  gotoTournament(isNext) {
    // can continue?
    if (isNext) {
      this.props.navigation.navigate('Tournament', { eventId: this.state.eventId });
    } else {
      Alert.alert('Votes casted!', 'Please wait for next round.',
        [{text:'OK', onPress: () => this.props.navigation.navigate('HomeDrawer')}],
        {cancelable: false});
    }
  }

  componentDidMount() {
    const { access_token, user_id } = this.props.auth.token;
    this.setState({ access_token, user_id })
  }

  componentWillReceiveProps(nextProps) {
    const { eventId, tournamentArr } = nextProps.rounds;
    if (tournamentArr && tournamentArr.length === 0) {
      Alert.alert('Error', 'Loading Error. Please try again.',
      [
        { text: 'OK', onPress: () => this.props.navigation.goBack() }
      ]);
    }
    this.setState({ eventId, cards: tournamentArr });
  }

  render() {
    const { navigate } = this.props.navigation;
    if (this.state.cards.length == 0) {
      return <Spinner color='red' style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />
    }

    return (
      <Swipe postSwipe={this.postSwipe.bind(this)}
        nextRound={this.nextRound.bind(this)}
        navigate={navigate}
        Cards={this.state.cards} />
    );
  }
}

const mapStateToProps = function (state) {
  const { auth, rounds } = state;
  return { auth, rounds };
}

export default connect(mapStateToProps)(SwipeContainer);
