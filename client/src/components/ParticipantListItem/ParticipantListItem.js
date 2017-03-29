import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  List,
  ListItem
} from 'native-base';

import { colors } from '../../styles/common';
import styles from './styles';

class ParticipantListItem extends Component {
  static propTypes = {
    participant: React.PropTypes.shape({
      first_name: React.PropTypes.string,
      last_name: React.PropTypes.string
    }).isRequired,
    styles: React.PropTypes.shape({
      backgroundColor: React.PropTypes.string,
      height: React.PropTypes.number,
      width: React.PropTypes.number
    })
  }

  static defaultProps = {
    styles: {
      backgroundColor: colors.APP_PRIMARY_LIGHT,
      height: 50,
      width: 50
    }
  }

  render() {
    const { participant, styles: propStyles } = this.props;
    const { first_name: firstName, last_name: lastName } = participant.user;
    return (
      <ListItem style={{ margin: 0 }}>
        <View style={{...StyleSheet.flatten(styles.initialsAvatar), ...propStyles}}>
        <Text style={{ fontSize: 20, color: 'white' }}>{firstName[0]}{lastName[0]}</Text>
        </View>
        <Text>{`${firstName} ${lastName}`}</Text>
      </ListItem>
    )
  }
}

export default ParticipantListItem;
