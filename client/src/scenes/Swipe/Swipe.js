import React, { Component } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Container, Icon } from 'native-base';
import SwipeContainer from './SwipeContainer';
import SwipeCards from 'react-native-swipe-cards';

class Swipe extends Component {
    constructor(props) {
        super(props);

        this.state = {
            card: this.props.Cards,
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
        return (
            <View
                style={[styles.card]}>
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
            icons.push(<Icon key={restaurant.name + i} name='md-star'></Icon>);
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
        // TODO: causes warning
        this.props.navigate('Tournament');        
        return (
            <Text>No more</Text>
        );
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
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                    <TouchableOpacity style={styles.button} onPress={() => this.onClickNope(this.swiper.state.card)}>
                        <Icon name='close' size={45} color="#888" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => this.onClickYup(this.swiper.state.card)}>
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
