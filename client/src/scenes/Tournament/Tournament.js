import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Container, Content, Icon, Text } from 'native-base';
import { Col, Grid, Row } from 'react-native-easy-grid';
import SwipeCards from 'react-native-swipe-cards';

var miku = require('../../images/miku.jpg')
var kishimoto = require('../../images/kishimoto.jpg')
var minami = require('../../images/minami.jpg')
var suika = require('../../images/suika.jpg')

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var borderWidth = 5;

class Tournament extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topCards: this.props.top,
      bottomCards: this.props.bot,
      roundOver: false
    };

    this.topHandleYup = this.topHandleYup.bind(this);
    this.topHandleNope = this.topHandleNope.bind(this);
    this.botHandleYup = this.botHandleYup.bind(this);
    this.botHandleNope = this.botHandleNope.bind(this);
    this.noMore = this.noMore.bind(this);
  }

  static navigationOptions = {
    title: 'Showdown'
  };

  Card(restaurant) {
    return (
      <View style={{ flexDirection: 'row' }} >
        <View style={styles.cardImageContainer}>
          <Image source={restaurant.image} resizeMode="cover" style={styles.cardImage}/>
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={{ fontSize: 20, color: '#444' }}>{restaurant.name}</Text>
        </View>
      </View>
    )
  }

  CardReversed(restaurant) {
    return (
      <View style={{ flexDirection: 'row' }} >
        <View style={styles.cardTextContainer}>
          <Text style={{ fontSize: 20, color: '#444' }}>{restaurant.name}</Text>
        </View>
        <View style={styles.cardImageContainer}>
          <Image source={restaurant.image} resizeMode="cover" style={styles.cardImage}/>
        </View>
      </View>
    )
  }

  topHandleYup(restaurant) {
    console.log('Yup for ' + restaurant.name);
    this.botSwiper._goToNextCard();
  }

  topHandleNope(restaurant) {
    console.log('Nope for ' + restaurant.name);
    this.botSwiper._goToNextCard();
  }

  botHandleYup(restaurant) {
    console.log('Yup for ' + restaurant.name);
    this.topSwiper._goToNextCard();
  }

  botHandleNope(restaurant) {
    console.log('Nope for ' + restaurant.name);
    this.topSwiper._goToNextCard();
  }

  noMore() {
    console.log("Round over");
    //this.setState({ roundOver: true });
    return (
      <Spinner color='red'/>
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    //if (!this.state.roundOver) {
      return (
        <Container>
          <Content>
            <Grid>
              <Row>
                <View style={styles.container}>
                  <SwipeCards
                    ref={(card) => { this.topSwiper = card; }}
                    cards={this.state.topCards}

                    renderCard={(cardData) => this.Card(cardData)}
                    renderNoMoreCards={this.noMore}
                    handleYup={this.topHandleYup}
                    handleNope={this.topHandleNope}
                  />
                </View>
              </Row>
              <Row>
                <View style={styles.container}>
                  <SwipeCards
                    ref={(card) => { this.botSwiper = card; }}
                    cards={this.state.bottomCards}

                    renderCard={(cardData) => this.CardReversed(cardData)}
                    renderNoMoreCards={this.noMore}
                    handleYup={this.botHandleYup}
                    handleNope={this.botHandleNope}
                  />
                </View>
              </Row>
            </Grid>
          </Content>
        </Container>
      );
    /*} else {
      return (
        <Container>
          <Content>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Round over</Text>
            </View>
          </Content>
        </Container>
      );
    }*/
  }
}

// TODO: don't use hardcoded height
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    alignSelf: 'stretch'
  },
  cardImageContainer: {
    width: width / 2,
    height: 250,
  },
  cardTextContainer: {
    width: width / 2,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: (width) /2,
    height: 250,
    borderWidth: 5,
    borderColor: '#d6d7da',
  },
})

export default Tournament;