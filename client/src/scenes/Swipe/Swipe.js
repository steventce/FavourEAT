import React, { Component } from 'react';
import {
    Button,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';
import SwipeCards from 'react-native-swipe-cards';

let Card = React.createClass({
    render() {
        return (
            <View style={[styles.card, { backgroundColor: this.props.backgroundColor }]}>
                <Text>{this.props.text}</Text>
            </View>
        )
    }
})

const Cards = [
    { text: 'Tomato', backgroundColor: 'red' },
    { text: 'Aubergine', backgroundColor: 'purple' },
    { text: 'Courgette', backgroundColor: 'green' },
    { text: 'Blueberry', backgroundColor: 'blue' },
    { text: 'Umm...', backgroundColor: 'cyan' },
    { text: 'orange', backgroundColor: 'orange' },
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
    
    handleYup (card) {
        console.log('Yup for ${card.text}');
    }

    handleNope (card) {
        console.log('Yup for ${card.text}');        
    }

    noMore(){
        return (
            <Text>No more</Text>
        )
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
                <SwipeCards
                    cards={this.state.card}

                    renderCard={(cardData) => <Card {...cardData} />}
                    renderNoMoreCards={this.noMore}

                    handleYup={this.handleYup}
                    handleNope={this.handleNope}
                />
        );
    }
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 300,
    }
})

export default Swipe;
