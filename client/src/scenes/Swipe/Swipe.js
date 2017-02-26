import React, { Component } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Container, Icon } from 'native-base';
import SwipeCards from 'react-native-swipe-cards';

// TODO: remove and use url
var miku = require('../../images/miku.jpg')
var kishimoto = require('../../images/kishimoto.jpg')
var minami = require('../../images/minami.jpg')
var suika = require('../../images/suika.jpg')
var shizenya = require('../../images/shizenya.jpg')

// TODO: get list from props
const Cards = [
    { name: 'Miku', image: miku, rating: 5, address: '200 Granville St #70, Vancouver, BC V6C 1S4', phone: "+14152520800",
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
    { name: 'Kishimoto', image: kishimoto, rating: 5 },
    { name: 'Minami', image: minami, rating: 4 },
    { name: 'Suika', image: suika, rating: 4 },
    { name: 'Shizen Ya', image: shizenya, rating: 4 },
]

class Swipe extends Component {
    constructor(props) {
        super(props);

        this.state = {
            card: Cards
        };

        this.onClickYup = this.onClickYup.bind(this);
        this.onClickNope = this.onClickNope.bind(this);
        this.getRating = this.getRating.bind(this);
    }

    static navigationOptions = {
        title: 'Swipe'
    };

    Card(restaurant) {
        const { navigate } = this.props.navigation;
        return (
            <View
                style={[styles.card]}
                onStartShouldSetResponder={() => true}
                onResponderRelease={() => navigate('RestaurantDetails', {restaurant: restaurant, caller: this})} >
                <View
                    style={{ flexDirection: 'row'}} >
                    <Text style={{ fontSize: 40,  color: '#444' }}>{restaurant.name}</Text>
                </View>
                <Image source={restaurant.image} resizeMode="cover" style={{ width: 350, height: 350 }} />
                {this.getRating(restaurant)}
            </View>
        )
    }

    getRating(restaurant) {
        var icons = []
        for (var i = 0; i < restaurant.rating; i++) {
            icons.push(<Icon key={restaurant.name + i} name='star'></Icon>);
        }
        return (
            <View style={{ flexDirection: 'row' }}>
                {icons}
            </View>
        );
    }

    handleYup(card) {
        console.log('Yup for ${card.name}');
    }

    onClickYup() {
        this.swiper._goToNextCard();
    }

    handleNope(card) {
        console.log('Yup for ${card.restaurantName}');
    }

    onClickNope() {
        this.swiper._goToNextCard();        
    }

    noMore() {
        return (
            <Text>No more</Text>
        )
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <SwipeCards
                    ref={(card) => { this.swiper = card; }}
                    cards={this.state.card}

                    renderCard={(cardData) => this.Card(cardData)}
                    renderNoMoreCards={this.noMore}
                    handleYup={this.handleYup}
                    handleNope={this.handleNope}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                    <TouchableOpacity style={styles.button} onPress={() => this.onClickNope()}>
                        <Icon name='close' size={45} color="#888" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => this.onClickYup()}>
                        <Icon name='heart' size={36} color="#888" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        width: 80,
        height: 80,
        borderWidth: 10,
        borderColor: '#e7e7e7',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40
    },
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    card: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: '#d6d7da',
    }
})

export default Swipe;
