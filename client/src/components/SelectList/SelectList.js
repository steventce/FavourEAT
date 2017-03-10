import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TouchableNativeFeedback
} from 'react-native';
import { List, ListItem, Button, CheckBox } from 'native-base';

class SelectList extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    selectedOptions: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    renderLabel: PropTypes.func.isRequired
  };

  isChecked = (value) => {
    return this.props.selectedOptions.includes(value);
  }

  renderRow = (rowData) => {
    const label = typeof rowData == "object" ? rowData.label : rowData;
    const value = rowData;
    const onSelect = () => this.props.onSelect(value);
    return (
      <ListItem style={{padding: 0, margin: 0}}>
        <TouchableNativeFeedback
            onPress={onSelect}>
          <View style={{flex: 1, flexDirection: 'row', padding: 20}}>
            <CheckBox 
                checked={this.isChecked(value)}
                onPress={onSelect}
                style={{marginRight: 20}} />
            {this.props.renderLabel(rowData)}
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