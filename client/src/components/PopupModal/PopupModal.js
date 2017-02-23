import React, { Component, PropTypes } from 'react';
import {
  View,
  Modal,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';

import styles from './styles';

// TODO: make this handle screen orientation properly
class PopupModal extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  render() {
    return (
      <Modal
          animationType='fade'
          visible={this.props.visible}
          transparent={true}
          onRequestClose={this.props.onClose}>
        <View style={styles.container}>
            <TouchableWithoutFeedback
                onPress={this.props.onClose}>
              <View style={styles.overlay} />
            </TouchableWithoutFeedback>
            <View style={styles.modal}>
              {this.props.children}
            </View>
        </View>
      </Modal>
    );
  }
}

export default PopupModal;