import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TouchableNativeFeedback,
  ListView
} from 'react-native';
import { List, ListItem, Button, CheckBox, Radio } from 'native-base';

class SelectList extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    selectedOptions: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    renderLabel: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    type: "radio",
  };
  
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => { return true }});
    this.state = {
      ds: ds,
      dataSource: ds.cloneWithRows(this.props.options),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedOptions.length !== nextProps.selectedOptions.length) {
      this.setState({
        dataSource: this.state.ds.cloneWithRows(this.props.options)
      })
    }
  }

  isChecked = (value) => {
    return this.props.selectedOptions.includes(value);
  }

  renderRow = (rowData) => {
    const label = typeof rowData == "object" ? rowData.label : rowData;
    const value = rowData;
    const onSelect = () => this.props.onSelect(value, this.isChecked(value));
    return (
      <ListItem style={{padding: 0, margin: 0}}>
        <TouchableNativeFeedback
            onPress={onSelect}>
          <View style={{flex: 1, flexDirection: 'row', padding: 20}}>
            {this.props.type === "radio" &&
              <Radio
                selected={this.isChecked(value)} 
                onPress={onSelect}
                style={{marginRight: 20}} /> ||
              <CheckBox 
                  checked={this.isChecked(value)}
                  onPress={onSelect}
                  style={{marginRight: 20}} />
            }
            {this.props.renderLabel(rowData)}
          </View>
        </TouchableNativeFeedback>
      </ListItem>
    );
  };

  render() {
    return (
      <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow} />
    );
  }
}

export default SelectList;