import React, { Component } from 'react';
import { Text, Image, View, TouchableNativeFeedback, Dimensions, StyleSheet } from 'react-native';
import { Container, Content, Left, Button, Icon, ListItem } from 'native-base';

import styles from './styles';
import { logo } from '../../config/images';
import { colors } from '../../styles/common';

const navItem = [
  'Home',
  'CreateEvent',
  'JoinEvent',
  'Signout'
];

const navItemConfig = {
  Home: {
    name: 'Home',
    iconName: 'md-home',
    onPress: (navigate) => navigate('Home')
  },
  CreateEvent: {
    name: 'Create Event',
    iconName: 'md-add',
    onPress: (navigate) => navigate('CreateEvent')
  },
  JoinEvent: {
    name: 'Join Event',
    iconName: 'md-people',
    onPress: (navigate) => navigate('JoinEvent')
  },
  Signout: {
    name: 'Sign Out',
    iconName: 'md-log-out',
    onPress: function() { console.log(this); this.handleLogout(); }
  }
}

class Drawer extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    const { access_token, user_id } = this.props.auth.token;
    this.props.handleLogout(access_token, user_id);
  }

  render() {
    const { navigate, state: navState } = this.props.navigation;
    console.log(navState);

    return (
      <Container>
        <Content contentContainerStyle={styles.container}>
          <View style={{ height: Dimensions.get('window').height, backgroundColor: 'white' }}>
            <View style={{ backgroundColor: colors.APP_PRIMARY_DARK, height: 150 }}>
              <Image style={styles.logo} source={logo} />
            </View>
            <View style={{ backgroundColor: 'white', height: 250 }}>
              {navItem.map((route) => {
                const { iconName, color, name , margin, onPress } = navItemConfig[route];
                return (
                  <TouchableNativeFeedback onPress={onPress.bind(this, navigate)} key={route}>
                    <View style={styles.itemContainer}>
                      <Icon name={iconName} style={StyleSheet.flatten(styles.icon)} />
                      <Text style={styles.sectionTitle}>{name}</Text>
                    </View>
                  </TouchableNativeFeedback>
                );
              })}
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

export default Drawer;
