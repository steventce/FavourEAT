import React, { Component } from 'react';
import { Button, Image, Navigator, StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions } from 'react-native';
import { Content, Container, Icon, Fab, Button as NBButton } from 'native-base';
import SwipeCards from 'react-native-swipe-cards';
import Communications from 'react-native-communications';
import Hr from 'react-native-hr';

import common from '../../styles/common'
import styles from './styles';


var moment = require('moment');
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

class RestaurantDetails extends Component {
    constructor(props) {
        super(props);

        this.onClickYup = this.onClickYup.bind(this);
        this.onClickNope = this.onClickNope.bind(this);
        this.getRating = this.getRating.bind(this);
        this.getHours = this.getHours.bind(this);
        this.getReviews = this.getReviews.bind(this);
        this.state = {
            fabActive: false
        }
    }

    static navigationOptions = {
        title: 'Restaurant Details'
    };

    getRating(rating, restaurant) {
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

    onClickYup(restaurant) {
        this.props.navigation.state.params.caller.onClickYup(restaurant);
        this.props.navigation.goBack();
    }

    onClickNope(restaurant) {
        this.props.navigation.state.params.caller.onClickNope(restaurant);
        this.props.navigation.goBack();
    }

    getHours(restaurant) {
        if (!("hours" in restaurant)) {
            return (<Text style={[styles.hours, styles.txtColor]}>No hours available</Text>);
        }
        var result = '';
        for (i = 0; i < restaurant.hours[0]["open"].length; i++) {
            var start = restaurant.hours[0]["open"][i].start;
            var end = restaurant.hours[0]["open"][i].end;
            var day = restaurant.hours[0]["open"][i].day;
            var currResult = hoursMap[day] + ': ' + moment(start, "HHmm").format("h:mm A") + ' - ' + moment(end, "HHmm").format("h:mm A");
            result = result + currResult + '\n';
        }
        return (
            <Text style={[styles.hours, styles.txtColor]}>{result}</Text>
        )
    }

    getReviews(restaurant) {
        var result = [];
        if (!("reviews" in restaurant)) {
            result.push(<Text key={'review-none'} style={[styles.reviewTxt, styles.txtColor]}>No reviews available yet</Text>);
            return result;
        }
        var reviews = restaurant['reviews'];
        for (i = 0; i < reviews.length; i++) {
          var rev = reviews[i];
          result.push(
            <View key={'review' + i} style={styles.infoView}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.reviewRating, styles.txtColor]}>{rev['user']['name']} </Text>
                  {this.getReviewRating(rev)}
              </View>
              <Text style={styles.reviewTime}>{rev['time_created']}</Text>
              <Text style={[styles.reviewTxt, styles.txtColor]}>{rev['text']}</Text>
            </View>)
        }
        return result;
    }

    toggleFab = () => {
      this.setState({ fabActive: !this.state.fabActive });
    }

    render() {
        const { navigate } = this.props.navigation;
        const restaurant = this.props.navigation.state.params.restaurant;
        const swipeable = this.props.navigation.state.params.swipeable;

        return (
          <Container>
            <Content style={StyleSheet.flatten(styles.container)}>
              <View style={styles.imgContainer}>
                  <Image source={restaurant.image} resizeMode="cover" style={{ height: 250, width: width }} />
              </View>
              <View style={[styles.card]}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#444' }}>{restaurant.name}</Text>{this.getRating(restaurant.rating, restaurant)}
                  <Text style={{ fontSize: 16,  color: '#444' }}>{restaurant.address}</Text>
                 {swipeable &&
                     <View style={styles.swipeBtns}>
                          <TouchableOpacity style={common.swipeBtn} onPress={() => this.onClickNope(restaurant)}>
                              <Icon name='close' size={30} style={iconCol} />
                          </TouchableOpacity>
                          <TouchableOpacity style={common.swipeBtn} onPress={() => this.onClickYup(restaurant)}>
                              <Icon name='heart' size={28} style={iconCol} />
                          </TouchableOpacity>
                      </View>
                 }
              </View>
              <View style={styles.infoView}>
                  <Hr lineColor='#b3b3b3' />
                  <Text style={styles.restaurantInfo}>Hours</Text>
                  {this.getHours(restaurant)}
              </View>
              <View style={[styles.infoView, styles.reviewMargin]}>
                  <Hr lineColor='#b3b3b3' />
                  <Text style={styles.restaurantInfo}>Reviews</Text>
                  {this.getReviews(restaurant)}
              </View>

            </Content>
            <Fab
                active={this.state.fabActive}
                onPress={this.toggleFab}
                direction='up'
                style={{ backgroundColor: '#EDA743' }}
                position='bottomRight'>
              <Icon name='nutrition' />
              <NBButton 
                  style={{ backgroundColor: '#EFBE79' }}
                   onPress={() => Communications.phonecall(restaurant.phone, true)}>
                <Icon name='call' />
              </NBButton>
              {/*
                <NBButton style={{ backgroundColor: '#EFBE79' }}>
                  <Icon name='restaurant' />
                </NBButton>
                <NBButton style={{ backgroundColor: '#EFBE79' }}>
                  <Icon name='locate' />
                </NBButton>
              */}
            </Fab>
          </Container>
        );
    }
}

export default RestaurantDetails;
