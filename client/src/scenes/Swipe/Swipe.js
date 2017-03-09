import React, { Component } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { Container, Icon } from 'native-base';
import SwipeContainer from './SwipeContainer';
import SwipeCards from 'react-native-swipe-cards';

import { colors as commonColors } from '../../styles/common';

// TODO: remove and use url
var miku = require('../../images/miku.jpg')
var kishimoto = require('../../images/kishimoto.jpg')
var minami = require('../../images/minami.jpg')
var suika = require('../../images/suika.jpg')
var shizenya = require('../../images/shizenya.jpg')

// TODO: get list from props
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

class Swipe extends Component {
    constructor(props) {
        super(props);

        this.state = {
            card: Cards,
            rightSwipes: [],
            leftSwipes: []
        };

        this.handleYup = this.handleYup.bind(this);
        this.onClickYup = this.onClickYup.bind(this);
        this.handleNope = this.handleNope.bind(this);
        this.onClickNope = this.onClickNope.bind(this);
        this.getRating = this.getRating.bind(this);
        this.noMore = this.noMore.bind(this);
    }

    static navigationOptions = {
        title: 'Swipe'
    };

    Card(restaurant) {
        const screen = Dimensions.get('window');
        const imageSize = {
          width: Math.round(screen.width * 0.95),
          height: Math.round(screen.height * 0.55),
        };
        const cardSize = {
          height: Math.round(screen.height * 0.8),
          width: Math.round(screen.width * 0.95)
        };
      
        return (
            <View style={[styles.card, cardSize]}>
                <View>
                  <Image source={restaurant.image} resizeMode="cover" style={[imageSize, styles.image]} />
                </View>
                <View style={[styles.cardMeta]}>
                  <Text 
                      numberOfLines={3}
                      style={styles.restaurantName}>
                    {restaurant.name}
                  </Text>
      
                  {this.getRating(restaurant)}
                </View>
            </View>
        )
    }

    getRating(restaurant) {
        var icons = []
        for (var i = 0; i < restaurant.rating; i++) {
            icons.push(<Icon key={restaurant.name + i} name='md-star' style={{color: commonColors.RATING_COLOR}}></Icon>);
        }
        return (
            <View style={{ flexDirection: 'row' }}>
                {icons}
            </View>
        );
    }

    handleYup(restaurant) {
        console.log(restaurant);
        var arr = this.state.rightSwipes.slice();
        arr.push(restaurant.yelp_id);
        this.setState({ rightSwipes: arr });
    }

    onClickYup(restaurant) {
        this.swiper._goToNextCard();
        this.handleYup(restaurant);
    }

    handleNope(restaurant) {
        console.log(restaurant);
        var arr = this.state.leftSwipes.slice();
        arr.push(restaurant.yelp_id);
        this.setState({ leftSwipes: arr });
    }

    onClickNope(restaurant) {
        this.swiper._goToNextCard();
        this.handleNope(restaurant);
    }

    noMore() {
        console.log(this.state.leftSwipes);
        console.log(this.state.rightSwipes);
        console.log("sending post");
        this.props.postSwipe(this.state.leftSwipes, this.state.rightSwipes);
        return (
            <Text>No more</Text>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <SwipeCards
                    ref={(card) => { this.swiper = card; }}
                    cards={this.state.card}

                    onClickHandler={() => this.props.navigate('RestaurantDetails', {
                      restaurant: this.swiper.state.card, 
                      caller: this,
                      swipeable: true,
                    })}
                    renderCard={(cardData) => this.Card(cardData)}
                    renderNoMoreCards={this.noMore}
                    handleYup={(restaurant) => this.handleYup(restaurant)}
                    handleNope={(restaurant) => this.handleNope(restaurant)}
                />
                <View style={styles.actionBtns}>
                    <TouchableOpacity style={[styles.button, styles.noBtn]} onPress={() => this.onClickNope(this.swiper.state.card)}>
                        <Icon name='close' size={45} style={StyleSheet.flatten(styles.btnIcon)} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.yesBtn]} onPress={() => this.onClickYup(this.swiper.state.card)}>
                        <Icon name='heart' size={36} style={StyleSheet.flatten(styles.btnIcon)} />
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
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40
    },
    noBtn: {
      backgroundColor: commonColors.NOPE_COLOR
    },
    yesBtn: {
      backgroundColor: commonColors.YUP_COLOR
    },
    btnIcon: {
      color: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: '#B8B8B8'
    },
    card: {
        backgroundColor: '#f7f7f7',
        borderRadius: 10,
    },
    image: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      overflow: 'hidden',
    },
    actionBtns: {
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center', 
      marginTop: 5, 
    },
    cardMeta: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20
    },
    restaurantName: {
      fontSize: 30,  
      color: '#444', 
    }
})

export default Swipe;
