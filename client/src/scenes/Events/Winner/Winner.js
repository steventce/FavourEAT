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
    restaurantName: PropTypes.string.isRequired,
    restaurantImg: PropTypes.node
  };

  // TODO: remove this after logic to select winner is done
  static defaultProps = {
    restaurantName: 'Miku',
    restaurantImg: require('../../../images/miku.jpg'),
  };

  handleContinue = () => {
    // TODO: move onto restaurant details screen of winning restaurant?
    this.props.navigation.goBack();
  }

  render() {
    const screen = Dimensions.get('window');
    const screenSize = {
      width: screen.width,
      height: screen.height
    };

    return (
      <Container>
        <Content contentContainerStyle={styles.content}>
          <View style={styles.container}>
            <Image
                source={this.props.restaurantImg}
                resizeMode='cover'
                style={styles.image} />
            <Text style={styles.text}>
              {this.props.restaurantName}
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