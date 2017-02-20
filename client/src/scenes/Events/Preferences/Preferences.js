import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  ListView,
  Button
} from 'react-native'

class Preferences extends Component {
  static propTypes = {
    preferences: PropTypes.object.isRequired,
    changeRadius: PropTypes.func.isRequired,
    savePreferences: PropTypes.func.isRequired
  };

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
        <View>    
          <Button 
              onPress={this.changeDistance}
              title='Maximum Travel Distance' />
          <Text>
            {this.props.preferences.distance}
          </Text>
        </View>
        <Button
            onPress={() => { console.log('press button') }}
            title='Minimum Price' />
        <Button 
            onPress={() => { console.log('press button') }}
            title='Maximum Price' />
        <Button 
            onPress={() => { console.log('press button') }}
            title='Cuisine Type' />
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