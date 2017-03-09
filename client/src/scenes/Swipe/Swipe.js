import React, { Component } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { Container, Icon, Card, Spinner } from 'native-base';
import SwipeContainer from './SwipeContainer';
import SwipeCards from 'react-native-swipe-cards';

import { colors as commonColors } from '../../styles/common';

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
        const screen = Dimensions.get('window');
        const imageSize = {
          width: Math.round(screen.width * 0.95),
          height: Math.round(screen.height * 0.55),
        };
        const cardStyle = {
          height: Math.round(screen.height * 0.8),
          width: Math.round(screen.width * 0.95),
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: 'white',
        };
      
        return (
            <Card style={cardStyle}>
              <View>
                <Image source={{uri: restaurant.image_url}} resizeMode="cover" style={[imageSize, styles.image]} />
              </View>
              <View style={[styles.cardMeta]}>
                <Text 
                    numberOfLines={3}
                    style={styles.restaurantName}>
                  {restaurant.name}
                </Text>
                {this.getRating(restaurant)}
              </View>
            </Card>
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
        var arr = this.state.rightSwipes.slice();
        arr.push(restaurant);
        this.setState({ rightSwipes: arr });
    }

    onClickYup(restaurant) {
        this.swiper._goToNextCard();
        this.handleYup(restaurant);
    }

    handleNope(restaurant) {
        var arr = this.state.leftSwipes.slice();
        arr.push(restaurant);
        this.setState({ leftSwipes: arr });
    }

    onClickNope(restaurant) {
        this.swiper._goToNextCard();
        this.handleNope(restaurant);
    }

    noMore() {
        // NOT USED FOR DEMO
        //this.props.postSwipe(this.state.leftSwipes, this.state.rightSwipes);
        this.props.nextRound(this.state.rightSwipes);
        return (
            <Spinner color='red'/>
        );
    }

    handleGoToDetails = () => {
      this.props.navigate('RestaurantDetails', {
        restaurant: this.swiper.state.card.restaurant, 
        caller: this,
        swipeable: true,
      });
    };

    render() {
        return (
            <View style={styles.container}>
                <SwipeCards
                    ref={(card) => { this.swiper = card; }}
                    cards={this.state.card}

                    onClickHandler={this.handleGoToDetails}
                    renderCard={(cardData) => this.Card(cardData.restaurant)}
                    renderNoMoreCards={this.noMore}
                    handleYup={(restaurant) => this.handleYup(restaurant)}
                    handleNope={(restaurant) => this.handleNope(restaurant)}
                />
                <View style={styles.actionBtns}>
                    <TouchableOpacity 
                        style={[styles.button, styles.noBtn]} 
                        onPress={() => this.onClickNope(this.swiper.state.card)}>
                      <Icon name='close' size={45} style={StyleSheet.flatten(styles.btnIcon)} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.button, styles.detailsBtn]} 
                        onPress={this.handleGoToDetails}>
                        <Icon name='information' style={{color: 'white', fontSize: 40}} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.button, styles.yesBtn]} 
                        onPress={() => this.onClickYup(this.swiper.state.card)}>
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
    detailsBtn: {
      backgroundColor: '#76B376'
    },
    btnIcon: {
      color: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    card: {
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'white',
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
