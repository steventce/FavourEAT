import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  TouchableNativeFeedback,
  ListView,
  Button
} from 'react-native';

import SettingsBtn from '../../../components/SettingsBtn';

class Preferences extends Component {
  static propTypes = {
    preferences: PropTypes.object.isRequired,
    changeRadius: PropTypes.func.isRequired,
    savePreferences: PropTypes.func.isRequired
  };

  static navigationOptions = {
    title: 'Restaurant Preferences'
  }

   constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(this.props.preferences.cuisineTypes),

    };
  }

  changeDistance = () => {
    this.props.changeRadius(this.props.preferences.distance + 1);
  };

  render() {
    return (
      <View>
        <SettingsBtn 
            onPress={this.changeDistance}
            label="Maximum Travel Distance"
            value={this.props.preferences.distance} />
        <SettingsBtn 
            onPress={this.changeDistance}
            label="Minimum Price"
            value={this.props.preferences.minPrice} />
        <SettingsBtn 
            onPress={this.changeDistance}
            label="Maximum Price"
            value={this.props.preferences.maxPrice} />
        <SettingsBtn 
            onPress={this.changeDistance}
            label="Cuisine Type" />

        <Button
           onPress={() => this.props.savePreferences(1, {})}
           title="DONE!" />
        <ListView
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            renderRow={(rowData, sectionId) => {console.log(sectionId); return (<Text>{rowData}</Text>);}} />
      </View>
    );
  }
}

export default Preferences;