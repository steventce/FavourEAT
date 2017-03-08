import React, { Component, PropTypes } from 'react';
import { Text, Image, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Container, Content } from 'native-base'
import styles from './styles';

//TODO: Remove later when tournament is done and connected
const testRestaurant = { 
  yelp_id: 1,
  name: 'Miku', 
  image: require('../../../images/miku.jpg'),
  rating: 5,
};


class Winner extends Component {
  static navigationOptions = {
    header: {
      visible: false,
    }
  };

  handleContinue = (restaurant) => {
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'HomeDrawer'}),
        NavigationActions.navigate({ routeName: 'RestaurantDetails', params: { restaurant: restaurant }})
      ]
    })
    this.props.navigation.dispatch(resetAction);
  };

  render() {
    const screen = Dimensions.get('window');
    const screenSize = {
      width: screen.width,
      height: screen.height
    };

    // const restaurant = this.props.navigation.state.params.restaurant;
    const restaurant = testRestaurant;

    return (
      <Container>
        <Content contentContainerStyle={styles.content}>
          <View style={styles.container}>
            <Image
                source={restaurant.image}
                resizeMode='cover'
                style={styles.image} />
            <Text style={styles.text}>
              {restaurant.name}
            </Text>
          </View>
          <TouchableWithoutFeedback
              onPress={() => this.handleContinue(restaurant)}>
            <View style={[styles.overlay, screenSize]} />
          </TouchableWithoutFeedback>
        </Content>
      </Container>
    );
  }
}

export default Winner;