import React, { Component } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions } from 'react-native';
import { Container, Icon } from 'native-base';
import SwipeCards from 'react-native-swipe-cards';
import common from '../../styles/common'

// TODO: remove and use url
var miku = require('../../images/miku.jpg')
var kishimoto = require('../../images/kishimoto.jpg')
var minami = require('../../images/minami.jpg')
var suika = require('../../images/suika.jpg')
var shizenya = require('../../images/shizenya.jpg')

var width = Dimensions.get('window').width;
const iconCol = StyleSheet.flatten(common.iconCol);

// TODO: get list from props
const Cards = [
    { name: 'Miku', image: miku, rating: 5, address: '200 Granville St #70, Vancouver, BC V6C 1S4' },
    { name: 'Kishimoto', image: kishimoto, rating: 5, address: '2054 Commercial Dr, Vancouver, BC V5N 4A9'},
    { name: 'Minami', image: minami, rating: 4, address: '1118 Mainland St, Vancouver, BC V6B 2T9' },
    { name: 'Suika', image: suika, rating: 4, address: '1626 W Broadway, Vancouver, BC V6J 1X8' },
    { name: 'Shizen Ya', image: shizenya, rating: 4, address: '985 Hornby St, Vancouver, BC V6Z 1V3' },
]

var restaurant = { name: 'Miku', image: miku, rating: 5, address: '200 Granville St #70, Vancouver, BC V6C 1S4',
hours: 'Monday-Tuesday: 9:00AM - 10PM\nWednesday-Friday: 9:00AM - 12AM\nSaturday-Sunday:Closed\nsdf\nsdfg\nsdfg\nsd\nzdf\n'};


class RestaurantDetails extends Component {
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
        title: 'Restaurant Details'
    };

    getRating(restaurant) {
        var icons = []
        for (var i = 0; i < restaurant.rating; i++) {
            icons.push(<Icon key={restaurant.name + i} name='md-star' style={iconCol} />);
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
            <ScrollView style={styles.container}>
                <View style={styles.imgContainer}>
                    <Image source={restaurant.image} resizeMode="cover" style={{ height: 250, width: width }} />
                    <TouchableOpacity style={styles.overlapBtn} onPress={() => this.onClickNope()}>
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
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#444' }}>{restaurant.name}</Text>{this.getRating(restaurant)}
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
                    <Text style={{ fontSize: 17, color: '#444', fontWeight: 'bold', textDecorationLine: 'underline' }}>Hours</Text>
                    <Text style={{ fontSize: 15, color: '#444' }}>{restaurant.hours}</Text>
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
