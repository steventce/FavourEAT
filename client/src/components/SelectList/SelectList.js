import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  ListView,
  TouchableNativeFeedback
} from 'react-native';

import styles from './styles';

class SelectList extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      ds: ds,
      dataSource: ds.cloneWithRows(this.props.options),
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.options !== this.props.options) {
      this.setState({
        dataSource: this.state.ds.cloneWithRows(nextProps.options)
      });
    }
  };

  renderRow = (rowData) => {
    const label = typeof rowData == "object" ? rowData.label : rowData;
    const value = typeof rowData == "object" ? rowData.value : rowData;

    return (
      <TouchableNativeFeedback
          onPress={() => this.props.onSelect(value)}>
        <View style={styles.selectItem}>
          <Text>
            {label}
          </Text>
        </View>
      </TouchableNativeFeedback>
    );
  };

  render() {
    return (
      <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow} />
    );
  }
}

export default SelectList;