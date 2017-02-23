import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TouchableNativeFeedback
} from 'react-native';
import { List, ListItem, Button, CheckBox } from 'native-base';

import styles from './styles';

class SelectList extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    selectedOptions: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  isChecked = (value) => {
    return this.props.selectedOptions.includes(value);
  }

  renderRow = (rowData) => {
    const label = typeof rowData == "object" ? rowData.label : rowData;
    const value = rowData;
    const onSelect = () => this.props.onSelect(value);
    return (
      <ListItem>
        <TouchableNativeFeedback
            onPress={onSelect}>
          <View style={styles.selectItem}>
            <CheckBox 
                checked={this.isChecked(value)}
                onPress={onSelect} />
            <Text style={styles.label}>
              {label}
            </Text>
          </View>
        </TouchableNativeFeedback>
      </ListItem>
    );
  };

  render() {
    return (
      <List
          dataArray={this.props.options}
          renderRow={this.renderRow} />
    );
  }
}

export default SelectList;