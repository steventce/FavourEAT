import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  TouchableNativeFeedback,
  StyleSheet
} from 'react-native';

import styles from './styles';

class SettingsBtn extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  };

  render() {
    return (
      <TouchableNativeFeedback
          disabled={this.props.disabled}
          onPress={this.props.onPress}>
        <View style={!this.props.style ? styles.settingsBtn :
          {...StyleSheet.flatten(styles.settingsBtn), ...this.props.style}}>
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
