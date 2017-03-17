import React, { Component } from 'react';
import { Text, Image, View } from 'react-native';
import { Container, Content, Left, Button, Icon } from 'native-base';

import styles from './styles';
import { logo } from '../../config/images';

const navItemConfig = {
  Home: {
    color: 'black',
    iconName: 'md-home'
  },
  CreateEvent: {
    color: 'black',
    iconName: 'md-add'
  },
  Preferences: {
    color: 'black',
    iconName: 'md-heart-outline'
  },
  Swipe: {
    color: 'black',
    iconName: 'md-swap'
  },
  RestaurantDetails: {
    color: 'black',
    iconName: 'md-swap'
  }
}

class Drawer extends Component {
  render() {
    const { navigate, state } = this.props.navigation;
    const { routes } = state;

    return (
      <Container>
        <Content contentContainerStyle={styles.container}>
          <View style={{ marginTop: 25, height: 150 }}>
            <Image style={styles.logo} source={logo} />
          </View>
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            {routes.map((route) => {
              const { key, routeName } = route;
              const { iconName, color } = navItemConfig[key];
              return (
                <Button
                  key={key}
                  block
                  transparent
                  iconLeft
                  onPress={() => navigate(key)}>
                  <Icon name={iconName} style={{ color: color }} />
                  <Left>
                    <Text style={{ color: color, marginLeft: 15 }} >{routeName}</Text>
                  </Left>
                </Button>
              );
            })}
            <Button block transparent onPress={this.props.handleLogout} iconLeft>
              <Icon name="md-log-out" style={{ color: 'black' }} />
              <Left>
                <Text style={{ color: 'black', marginLeft: 15 }}>Sign Out</Text>
              </Left>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

export default Drawer;
