import React, { Component } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'native-base';
import SwipeCards from 'react-native-swipe-cards';

// TODO: remove and use url
var miku = require('../../images/miku.jpg')
var kishimoto = require('../../images/kishimoto.jpg')
var minami = require('../../images/minami.jpg')
var suika = require('../../images/suika.jpg')
var shizenya = require('../../images/shizenya.jpg')

// TODO: get list from props
const Cards = [
    { restaurantName: 'Miku', image: miku, rating: '5' },
    { restaurantName: 'Kishimoto Japanese Restaurant', image: kishimoto, rating: '5' },
    { restaurantName: 'Minami', image: minami, rating: '4' },
    { restaurantName: 'Suika', image: suika, rating: '4' },
    { restaurantName: 'Shizen Ya', image: shizenya, rating: '4' },
]

class Swipe extends Component {
    constructor(props) {
        super(props);

        this.state = {
            card: Cards
        };
    }

    static navigationOptions = {
        title: 'Swipe'
    };

    Card(restaurant) {
        return (
            <View style={[styles.card]}>
                <Image source={restaurant.image} resizeMode="contain" style={{ width: 350, height: 350 }} />
                <Text>{restaurant.restaurantName}</Text>
            </View>
        )
    }

    handleYup(card) {
        console.log('Yup for ${card.restaurantName}');
    }

    handleNope(card) {
        console.log('Yup for ${card.restaurantName}');
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
                    cards={this.state.card}

                    renderCard={(cardData) => this.Card(cardData)}
                    renderNoMoreCards={this.noMore}

                    handleYup={this.handleYup}
                    handleNope={this.handleNope}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text>test</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
