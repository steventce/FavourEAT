import React, { Component } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions } from 'react-native';
import { Container, Icon } from 'native-base';
import SwipeCards from 'react-native-swipe-cards';
import common from '../../styles/common'
import Communications from 'react-native-communications';

// TODO: remove and use url
var miku = require('../../images/miku.jpg')
var kishimoto = require('../../images/kishimoto.jpg')
var minami = require('../../images/minami.jpg')
var suika = require('../../images/suika.jpg')
var shizenya = require('../../images/shizenya.jpg')

var width = Dimensions.get('window').width;

var hoursMap = {0: "Monday",
                1: "Tuesday",
                2: "Wednesday",
                3: "Thursday",
                4: "Friday",
                5: "Saturday",
                6: "Sunday"};

const iconCol = StyleSheet.flatten(common.iconCol);

// TODO: get list from props
const Cards = [
    { name: 'Miku', image: miku, rating: 5, address: '200 Granville St #70, Vancouver, BC V6C 1S4' },
    { name: 'Kishimoto', image: kishimoto, rating: 5, address: '2054 Commercial Dr, Vancouver, BC V5N 4A9'},
    { name: 'Minami', image: minami, rating: 4, address: '1118 Mainland St, Vancouver, BC V6B 2T9' },
    { name: 'Suika', image: suika, rating: 4, address: '1626 W Broadway, Vancouver, BC V6J 1X8' },
    { name: 'Shizen Ya', image: shizenya, rating: 4, address: '985 Hornby St, Vancouver, BC V6Z 1V3' },
]

var restaurant = { name: 'Miku', image: miku, rating: 5, address: '200 Granville St #70, Vancouver, BC V6C 1S4', phone: "+14152520800",
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
"total": 3};

class RestaurantDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            card: Cards
        };

        this.onClickYup = this.onClickYup.bind(this);
        this.onClickNope = this.onClickNope.bind(this);
        this.getRating = this.getRating.bind(this);
        this.getHours = this.getHours.bind(this);
        this.convertTimeStr = this.convertTimeStr.bind(this);
        this.getReviews = this.getReviews.bind(this);
    }

    static navigationOptions = {
        title: 'Restaurant Details'
    };

    getRating(rating) {
        var icons = [];
        for (var i = 0; i < rating; i++) {
            icons.push(<Icon key={restaurant.name + i} name='md-star' style={iconCol} />);
        }
        return (
            <View style={{ flexDirection: 'row' }}>
                {icons}
            </View>
        );
    }

    getReviewRating(review) {
        var icons = [];
        for (var i = 0; i < review['rating']; i++) {
          icons.push(<Icon key={review['user']['name'] + i} name='md-star' style={{ fontSize: 17, color:'#bd081c', marginTop: 3 }} />);
        }
        return icons;
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

    convertTimeStr(time) {
        var meridian = '';
        var timeInt = parseInt(time, 10);
        var minutes = (timeInt % 100 == 0) ? '00' : (timeInt % 100).toString();
        var hours = function() {
            var h = Math.floor(timeInt / 100);
            meridian = (h >= 12) ? 'PM' : 'AM';
            return (h > 12) ? (h - 12) : h;
        }
        return hours().toString() + ':' + minutes + meridian;
    }

    getHours() {
        var result = '';
        for (i = 0; i < restaurant.hours[0]["open"].length; i++) {
            var start = restaurant.hours[0]["open"][i].start;
            var end = restaurant.hours[0]["open"][i].end;
            var day = restaurant.hours[0]["open"][i].day;
            var currResult = hoursMap[day] + ': ' + this.convertTimeStr(start) + ' - ' + this.convertTimeStr(end);
            result = result + currResult + '\n';
        }
        return (
            <Text style={{lineHeight: 25, fontSize: 16, color: '#444', marginLeft: 10 }}>{result}</Text>
        )
    }

    getReviews() {
        var reviews = restaurant['reviews'];
        var result = [];
        for (i = 0; i < reviews.length; i++) {
          var rev = reviews[i];
          result.push(
            <View key={'review' + i}style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#444' }}>{rev['user']['name']} </Text>
                  {this.getReviewRating(rev)}
              </View>
              <Text style={{ fontSize: 10, fontStyle: 'italic' }}>{rev['time_created']}</Text>
              <Text style={{ fontSize: 15, color: '#444', marginLeft: 10 }}>{rev['text']}</Text>
            </View>)
        }
        return result;
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <ScrollView style={styles.container}>
                <View style={styles.imgContainer}>
                    <Image source={restaurant.image} resizeMode="cover" style={{ height: 250, width: width }} />
                    <TouchableOpacity style={styles.overlapBtn} onPress={() => Communications.phonecall(restaurant.phone, true)}>
                        <Icon name='call' size={25} style={iconCol} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.overlapBtn} onPress={() => this.onClickNope()}>
                        <Icon name='restaurant' size={25} style={iconCol} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.overlapBtn} onPress={() => this.onClickNope()}>
                        <Icon name='locate' size={25} style={iconCol} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.card]}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#444' }}>{restaurant.name}</Text>{this.getRating(restaurant.rating)}
                    <Text style={{ fontSize: 16,  color: '#444' }}>{restaurant.address}</Text>
                   <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                        <TouchableOpacity style={common.swipeBtn} onPress={() => this.onClickNope()}>
                            <Icon name='close' size={30} style={iconCol} />
                        </TouchableOpacity>
                        <TouchableOpacity style={common.swipeBtn} onPress={() => this.onClickYup()}>
                            <Icon name='heart' size={28} style={iconCol} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18, color:'#bd081c', fontWeight: 'bold', textDecorationLine: 'underline' }}>Hours</Text>
                    {this.getHours()}
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: 10 }}>
                    <Text style={{ fontSize: 18, color:'#bd081c', fontWeight: 'bold', textDecorationLine: 'underline' }}>Reviews</Text>
                    {this.getReviews()}
                </View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        borderWidth: 5,
        borderColor: '#d6d7da',
        height: 120
    },
    card: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlapBtn: {
        width: 45,
        height: 45,
        borderWidth: 5,
        borderColor: '#e7e7e7',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        marginTop: -100,
        backgroundColor: '#f7f7f7',
        marginRight: 5
    },
    imgContainer: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        borderWidth: 5,
        borderColor: '#d6d7da',
        height: 250,
        alignItems: 'flex-end'
    }
})

export default RestaurantDetails;
