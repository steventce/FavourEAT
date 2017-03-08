import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import Swipe from './Swipe';
import { saveSwipe } from '../../reducers/Swipe/actions';
import { getRound, putRound } from '../../reducers/Tournament/actions';

// TODO: remove and use url
var miku = require('../../images/miku.jpg')
var kishimoto = require('../../images/kishimoto.jpg')
var minami = require('../../images/minami.jpg')
var suika = require('../../images/suika.jpg')
var shizenya = require('../../images/shizenya.jpg')

// TODO: fetch this data;
var eventId = 7;
var tournamentId = 5;

// TODO: fetch this data;
const Cards = [
    { yelp_id: 1,name: 'Miku', image: miku, rating: 5, address: '200 Granville St #70, Vancouver, BC V6C 1S4', phone: "+14152520800",
hours: [
    {
      "hours_type": "REGULAR",
      "open": [
        {
          "is_overnight": false,
          "end": "2200",
          "day": 0,
          "start": "1730"
        },
        {
          "is_overnight": false,
          "end": "2200",
          "day": 1,
          "start": "1730"
        },
        {
          "is_overnight": false,
          "end": "2200",
          "day": 2,
          "start": "1730"
        },
        {
          "is_overnight": false,
          "end": "2200",
          "day": 3,
          "start": "1730"
        },
        {
          "is_overnight": false,
          "end": "2200",
          "day": 4,
          "start": "1730"
        },
        {
          "is_overnight": false,
          "end": "2200",
          "day": 5,
          "start": "1730"
        },
        {
          "is_overnight": false,
          "end": "2200",
          "day": 6,
          "start": "1730"
        }
      ],
      "is_open_now": false
    }],
"reviews": [
{
  "rating": 5,
  "user": {
    "image_url": "https://s3-media3.fl.yelpcdn.com/photo/iwoAD12zkONZxJ94ChAaMg/o.jpg",
    "name": "Ella A."
  },
  "text": "Went back again to this place since the last time i visited the bay area 5 months ago, and nothing has changed. Still the sketchy Mission, Still the cashier...",
  "time_created": "2016-08-29 00:41:13",
  "url": "https://www.yelp.com/biz/la-palma-mexicatessen-san-francisco?hrid=hp8hAJ-AnlpqxCCu7kyCWA&adjust_creative=0sidDfoTIHle5vvHEBvF0w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_reviews&utm_source=0sidDfoTIHle5vvHEBvF0w"
},
{
  "rating": 4,
  "user": {
    "image_url": null,
    "name": "Yanni L."
  },
  "text": "The \"restaurant\" is inside a small deli so there is no sit down area. Just grab and go.\n\nInside, they sell individually packaged ingredients so that you can...",
  "time_created": "2016-09-28 08:55:29",
  "url": "https://www.yelp.com/biz/la-palma-mexicatessen-san-francisco?hrid=fj87uymFDJbq0Cy5hXTHIA&adjust_creative=0sidDfoTIHle5vvHEBvF0w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_reviews&utm_source=0sidDfoTIHle5vvHEBvF0w"
},
{
  "rating": 4,
  "user": {
    "image_url": null,
    "name": "Suavecito M."
  },
  "text": "Dear Mission District,\n\nI miss you and your many delicious late night food establishments and vibrant atmosphere.  I miss the way you sound and smell on a...",
  "time_created": "2016-08-10 07:56:44",
  "url": "https://www.yelp.com/biz/la-palma-mexicatessen-san-francisco?hrid=m_tnQox9jqWeIrU87sN-IQ&adjust_creative=0sidDfoTIHle5vvHEBvF0w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_reviews&utm_source=0sidDfoTIHle5vvHEBvF0w"
}
],
"total": 3},
    { yelp_id: 2, name: 'Kishimoto', image: kishimoto, rating: 5 },
    { yelp_id: 3, name: 'Minami', image: minami, rating: 4 },
    { yelp_id: 4, name: 'Suika', image: suika, rating: 4 },
    { yelp_id: 5, name: 'Shizen Ya', image: shizenya, rating: 4 },
]

class SwipeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: Cards
        }
    }

    // NOT USED FOR DEMO
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

    async nextRound() {
      try{
        const accessToken = await AsyncStorage.getItem('app_access_token');
        this.props.dispatch(putRound(accessToken, eventId, tournamentId));
        this.props.navigation.navigate('Tournament');        
      } catch (error) {
        Alert.alert('Error', error.message);        
      }
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <Swipe postSwipe={this.postSwipe.bind(this)}
            nextRound={this.nextRound.bind(this)}
            navigate={navigate}
            Cards={this.state.cards} />
        );
    }
}

export default connect()(SwipeContainer);