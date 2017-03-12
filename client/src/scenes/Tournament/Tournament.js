import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Container, Content, Icon, Spinner, Text, Card } from 'native-base';
import { Col, Grid, Row } from 'react-native-easy-grid';
import SwipeCards from 'react-native-swipe-cards';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var borderWidth = 5;

class Tournament extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topCards: this.props.top,
      bottomCards: this.props.bot,
      swiped: []
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
    const cardStyles = {
      width: width * 0.95,
      height: height * 0.42
    };
    return (
      <Card style={cardStyles} >
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: restaurant.image_url }} resizeMode="cover" style={styles.cardImage} />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={{ fontSize: 20, color: '#444' }}>{restaurant.name}</Text>
        </View>
      </Card>
    )
  }

  CardReversed(restaurant) {
    return (
      <View style={{ flexDirection: 'row' }} >
        <View style={styles.cardTextContainer}>
          <Text style={{ fontSize: 20, color: '#444' }}>{restaurant.name}</Text>
        </View>
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: restaurant.image_url }} resizeMode="cover" style={styles.cardImage} />
        </View>
      </View>
    )
  }

  swipeCard(restaurant) {
    var arr = this.state.swiped.slice();
    arr.push(restaurant);
    this.setState({ swiped: arr });
  }

  topHandleYup(restaurant) {
    this.swipeCard(restaurant)
    this.botSwiper._goToNextCard();
  }

  topHandleNope(restaurant) {
    this.swipeCard(this.botSwiper.state.card);
    this.botSwiper._goToNextCard();
  }

  botHandleYup(restaurant) {
    this.swipeCard(restaurant)
    this.topSwiper._goToNextCard();
  }

  botHandleNope(restaurant) {
    this.swipeCard(this.topSwiper.state.card);
    this.topSwiper._goToNextCard();
  }

  noMore() {
    console.log("Round over");
    this.props.putTournamentRound(this.state.swiped);
    return (
      <Spinner color='red' />
    );
  }

  render() {
    return (
      <Container>
        <Content style={{ backgroundColor: '#f7f7f7' }}>
          <View style={styles.container}>
            <SwipeCards
              ref={(card) => { this.topSwiper = card; }}
              cards={this.state.topCards}

              renderCard={(cardData) => this.Card(cardData.restaurant)}
              renderNoMoreCards={this.noMore}
              handleYup={this.topHandleYup}
              handleNope={this.topHandleNope}
            />
          </View>

          <View style={styles.container}>
            <SwipeCards
              ref={(card) => { this.botSwiper = card; }}
              cards={this.state.bottomCards}

              renderCard={(cardData) => this.Card(cardData.restaurant)}
              //renderNoMoreCards={this.noMore}
              handleYup={this.botHandleYup}
              handleNope={this.botHandleNope}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

// TODO: don't use hardcoded height
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    flex: 1,
  },
  cardImageContainer: {
    width: width * 0.95,
    height: 250,
  },
  cardTextContainer: {
    width: width * 0.95,
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20
  },
  cardImage: {
    width: width * 0.95,
    height: height * 0.34,
  },
})

export default Tournament;