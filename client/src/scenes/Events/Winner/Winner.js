import React, { Component, PropTypes } from 'react';
import { Text, Image, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Container, Content } from 'native-base'
import styles from './styles';

class Winner extends Component {
  static navigationOptions = {
    header: {
      visible: false,
    }
  };

  static propTypes = {
    restaurant: PropTypes.object.isRequired
  };

  // TODO: remove this after logic to select winner is done
  static defaultProps = {
    restaurant: { 
      yelp_id: 1,
      name: 'Miku', 
      image: require('../../../images/miku.jpg'),
      rating: 5,
    },
  };

  handleContinue = () => {
    // TODO: move onto restaurant details screen of winning restaurant?
    this.props.navigation.navigate('UserEvents');
  };

  render() {
    const screen = Dimensions.get('window');
    const screenSize = {
      width: screen.width,
      height: screen.height
    };
    const restaurant = this.props.restaurant;

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
              onPress={this.handleContinue}>
            <View style={[styles.overlay, screenSize]} />
          </TouchableWithoutFeedback>
        </Content>
      </Container>
    );
  }
}

export default Winner;