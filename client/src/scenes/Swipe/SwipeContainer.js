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
      appAccessToken: '',
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
        this.props.dispatch(saveSwipe(this.state.userId, this.state.appAccessToken, leftSwipes[i].restaurant.yelp_id, 1, 0));
      }
      for (var i = 0; i < rightSwipes.length; i++) {
        this.props.dispatch(saveSwipe(this.state.userId, this.state.appAccessToken, rightSwipes[i].restaurant.yelp_id, 0, 1));
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  nextRound(restaurants) {
    try {
      for (var i = 0; i < restaurants.length - 1; i++) {
        this.props.dispatch(putRound(this.state.appAccessToken, this.state.eventId, restaurants[i].id));
      }
      // last restaurant needs to include specific data
      this.props.dispatch(putRound(this.state.appAccessToken, this.state.eventId,
        restaurants[restaurants.length - 1].id, true, this.state.cards,
        () => this.gotoTournament()));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  gotoTournament() {
    // TODO: handle back button
    this.props.navigation.navigate('Tournament', { eventId: this.state.eventId });
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
    if (tournamentArr.length === 0) {
      Alert.alert('Error', 'Loading Error. Please try again.',
      [
        { text: 'OK', onPress: () => this.props.navigation.goBack() }
      ]);
    }
    this.setState({ eventId, cards: tournamentArr });
  }

  render() {
    const { navigate, state } = this.props.navigation;
    if (this.state.cards.length == 0) {
      return <Spinner color='red' style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />
    }

    return (
      <Swipe postSwipe={this.postSwipe.bind(this)}
        nextRound={this.nextRound.bind(this)}
        navigate={navigate}
        currentLocation={state.params.currentLocation}
        Cards={this.state.cards} />
    );
  }
}

const mapStateToProps = function (state) {
  return state.rounds;
}

export default connect(mapStateToProps)(SwipeContainer);
