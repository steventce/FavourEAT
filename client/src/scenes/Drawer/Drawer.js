import React, { Component } from 'react';
import { Text, Image, View } from 'react-native';
import { Container, Content, Left, Button, Icon } from 'native-base';

import styles from './styles';
import { logo } from '../../config/images';

const navItem = ['Home','CreateEvent','JoinEvent'];

const navItemConfig = {
  Home: {
    color: 'black',
    iconName: 'md-home'
  },
  CreateEvent: {
    color: 'black', 
    iconName: 'md-add'
  },
  JoinEvent: {
    color: 'black',
    iconName: 'md-people'
  }
}

class Drawer extends Component {
  render() {
    const { navigate } = this.props.navigation;

    return (
      <Container>
        <Content contentContainerStyle={styles.container}>
          <View style={{ marginTop: 25, height: 150 }}>
            <Image style={styles.logo} source={logo} />
          </View>
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            {navItem.map((route) => {
              const { iconName, color } = navItemConfig[route];
              return (
                <Button key={route} block transparent iconLeft
                  onPress={() => navigate(route)}>
                  <Icon name={iconName} style={{ color: color }} />
                  <Left>
                    <Text style={{ color: color, marginLeft: 15 }}>{route}</Text>
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
