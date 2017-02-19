import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  TouchableNativeFeedback
} from 'react-native';

import styles from './styles';

class SettingsBtn extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  };

  render() {
    return (
      <TouchableNativeFeedback onPress={this.props.onPress}>
        <View style={styles.settingsBtn}>
          <Text style={styles.label}>
            {this.props.label}
          </Text>
          <Text>
            {this.props.value}
          </Text>
        </View>
      </TouchableNativeFeedback>
    );
  }

}


export default SettingsBtn;