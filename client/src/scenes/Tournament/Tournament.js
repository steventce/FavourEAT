import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Container, Content, Icon, Text } from 'native-base';
import SwipeCards from 'react-native-swipe-cards';

var miku = require('../../images/miku.jpg')
var kishimoto = require('../../images/kishimoto.jpg')

const top = [
  { name: 'Miku', image: miku, rating: 5 },
];
const bottom = [
  { name: 'Kishimoto', image: kishimoto, rating: 5 },
];

class Tournament extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topCard: top,
      bottomCard: bottom,
    };
  }

  static navigationOptions = {
    title: 'Showdown'
  };

  Card(restaurant) {
    return (
      <View style={[styles.card]}>
        <View style={{ flexDirection: 'row' }} >
          <Text style={{ fontSize: 20, color: '#444' }}>{restaurant.name}</Text>
        </View>
        <Image source={restaurant.image} resizeMode="cover" style={{ width: 200, height: 200 }} />
      </View>
    )
  }

  handleYup(card) {
    console.log('Yup for ' + card.name);
  }

  handleNope(card) {
    console.log('Nope for ' + card.name);
  }

  noMore() {
    console.log("test");
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content>
          <View style={styles.container}>
            <SwipeCards
              cards={this.state.topCard}

              renderCard={(cardData) => this.Card(cardData)}
              renderNoMoreCards={this.noMore}
              handleYup={this.handleYup}
              handleNope={this.handleNope}
            />
          </View>
          <View style={styles.container}>
            <SwipeCards
              cards={this.state.bottomCard}

              renderCard={(cardData) => this.Card(cardData)}
              renderNoMoreCards={this.noMore}
              handleYup={this.handleYup}
              handleNope={this.handleNope}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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

export default Tournament;