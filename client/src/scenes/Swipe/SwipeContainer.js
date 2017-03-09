import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { Spinner } from 'native-base';
import { connect } from 'react-redux';
import Swipe from './Swipe';
import { saveSwipe } from '../../reducers/Swipe/actions';
import { getRound, putRound } from '../../reducers/Tournament/actions';

// TODO: fetch this data;
var eventId = 12;
var tournamentId = 5;

class SwipeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: []
    }
  }

  // NOT USED FOR DEMO
  // needs to be updated to use data properly
  // i.e. leftSwipes.id
  async postSwipe(leftSwipes, rightSwipes) {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const accessToken = await AsyncStorage.getItem('app_access_token');
      for (var i = 0; i < leftSwipes.length; i++) {
        this.props.dispatch(saveSwipe(userId, accessToken, leftSwipes[i], 1, 0));
      }
      for (var i = 0; i < rightSwipes.length; i++) {
        this.props.dispatch(saveSwipe(userId, accessToken, rightSwipes[i], 0, 1));
      }

    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  async getInitialSwipe() {
    try {
      const accessToken = await AsyncStorage.getItem('app_access_token');
      this.props.dispatch(getRound(accessToken, eventId));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  async nextRound(restaurants) {
    console.log(restaurants);
    try {
      const accessToken = await AsyncStorage.getItem('app_access_token');
      for (var i=0; i < restaurants.length - 1; i++) {
        this.props.dispatch(putRound(accessToken, eventId, restaurants[i].id));
      }
      // TODO fix hack
      // last restaurant needs to include specific data
      this.props.dispatch(putRound(accessToken, eventId, restaurants[restaurants.length - 1].id, true, this.state.cards));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    //this.props.navigation.navigate('Tournament');        
  }

  componentDidMount() {
    this.getInitialSwipe();
  }

  componentWillReceiveProps(nextProps) {
    const { restaurants } = nextProps;
    this.setState({ cards: restaurants });
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
  return state.rounds;
}

export default connect(mapStateToProps)(SwipeContainer);