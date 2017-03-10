import React, { Component } from 'react';
import { Button, Image, Navigator, StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions } from 'react-native';
import { Content, Container, Icon, Fab, Button as NBButton, Card, CardItem, Body, Left, Right } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Communications from 'react-native-communications';
import Hr from 'react-native-hr';

import common, { colors as commonColors } from '../../styles/common';
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
            icons.push(<Icon key={restaurant.name + i} name='md-star' style={{color: commonColors.RATING_COLOR}} />);
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
          icons.push(<Icon key={review['user']['name'] + i} name='md-star' style={{ fontSize: 17, color: commonColors.RATING_COLOR, marginTop: 3 }} />);
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

        return restaurant.hours[0]["open"].map((datetime, index) => {
          var start = datetime.start;
          var end = datetime.end;
          var day = datetime.day;
          var displayedDay = hoursMap[day] + ': '; 
          var displayedTime = moment(start, "HHmm").format("h:mm A") + ' - ' + moment(end, "HHmm").format("h:mm A");

          return (
            <View key={index} style={[styles.hours]}>
              <Left>
                <Text style={[styles.txtColor, {fontSize: 16}]}>{displayedDay}</Text>
              </Left>
              <Right>
                <Text style={[styles.txtColor, {fontSize: 16}]}>{displayedTime}</Text>
              </Right>
            </View>
          );

        });
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
            <View key={'review' + i} style={{marginBottom: 25}}>
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
        const tournamentObj = this.props.navigation.state.params.restaurant;
        const restaurant = tournamentObj.restaurant;
        const swipeable = this.props.navigation.state.params.swipeable;

        return (
          <Container>
            <Content style={StyleSheet.flatten(styles.container)}>
              <View style={styles.imgContainer}>
                  <Image source={{uri: restaurant.image_url}} resizeMode="cover" style={{ height: 250, width: width }} />                  
              </View>

              <Card style={StyleSheet.flatten([styles.card])}>
                <View style={{ padding: 17 }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#444' }}>
                    {restaurant.name}
                  </Text>
                  {this.getRating(restaurant.rating, restaurant)}
                  <Text style={{ fontSize: 16,  color: '#444' }}>{restaurant.address}</Text>
                </View>
              </Card>
              {swipeable &&
                <View style={styles.swipeBtns}>
                  <TouchableOpacity 
                      style={[common.swipeBtn, {backgroundColor: commonColors.NOPE_COLOR}]} 
                      onPress={() => this.onClickNope(tournamentObj)}>
                      <Icon name='close' size={30} style={{color: 'white'}} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                      style={[common.swipeBtn, {backgroundColor: commonColors.YUP_COLOR}]} 
                      onPress={() => this.onClickYup(tournamentObj)}>
                      <Icon name='heart' size={25} style={{color: 'white'}} />
                  </TouchableOpacity>
                </View>
              }
              <Card style={StyleSheet.flatten(styles.infoView)}>
                  <CardItem header style={{paddingBottom: 0}}>
                    <Text style={styles.restaurantInfo}>Hours</Text>
                  </CardItem>
                  <CardItem style={{flex: 1, flexDirection: 'column', paddingBottom: 17}}>
                      {this.getHours(restaurant)}
                  </CardItem>
              </Card>
              <Card style={StyleSheet.flatten([styles.infoView, styles.reviewMargin])}>
                <CardItem header style={{paddingBottom: 0}}>
                  <Text style={styles.restaurantInfo}>Reviews</Text>
                </CardItem>
                <CardItem>
                  <Body>
                    {this.getReviews(restaurant)}
                  </Body>
                </CardItem>
              </Card>

            </Content>
            <Fab
                active={this.state.fabActive}
                onPress={this.toggleFab}
                direction='up'
                style={{ backgroundColor: '#EDA743' }}
                position='bottomRight'>
              <Icon name='menu' />
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
