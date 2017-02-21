import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  TouchableNativeFeedback,
  ListView,
  Button
} from 'react-native';

import PopupModal from '../../../components/PopupModal';
import SettingsBtn from '../../../components/SettingsBtn';
import SelectList from '../../../components/SelectList';

const priceOptions = [5, 15, 25, 40, 60, 100];
const distanceOptions = [1, 2, 3, 5, 10, 20];

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
      modalVisible: false,
      modalOptions: {
        options: [],
        onSelect: () => {}
      },
      dataSource: ds.cloneWithRows([]),
      preferences: this.props.preferences
    };
  }

  openModal = (options) => {
    return () => {
      this.setState({
        modalVisible: true,
        modalOptions: {
          options: options.options,
          onSelect: options.onSelect
        }
      });
    }
  };

  closeModal = () => {
    this.setState({
      modalVisible: false
    });
  };

  changeDistance = (value) => {
    this.setState({
      modalVisible: false,
      preferences: {
        ...this.state.preferences,
        distance: value
      }
    });
  };

  changeMinPrice = (value) => {
    this.setState({
      modalVisible: false,
      preferences: {
        ...this.state.preferences,
        minPrice: value
      }
    });
  };

  changeMaxPrice = (value) => {
    this.setState({
      modalVisible: false,
      preferences: {
        ...this.state.preferences,
        maxPrice: value
      }
    });
  };

  render() {
    return (
      <View>
        <SettingsBtn 
            onPress={this.openModal({options: distanceOptions, onSelect: this.changeDistance})}
            label="Maximum Travel Distance"
            value={this.state.preferences.distance} />
        <SettingsBtn 
            onPress={this.openModal({options: priceOptions, onSelect: this.changeMinPrice})}
            label="Minimum Price"
            value={this.state.preferences.minPrice} />
        <SettingsBtn 
            onPress={this.openModal({options: priceOptions, onSelect: this.changeMaxPrice})}
            label="Maximum Price"
            value={this.state.preferences.maxPrice} />
        <SettingsBtn 
            onPress={this.changeDistance}
            label="Cuisine Type" />
        <ListView
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            renderRow={(rowData, sectionId) => {return (<Text>{rowData}</Text>);}} />

        <PopupModal 
            visible={this.state.modalVisible}
            onClose={this.closeModal}>
          <SelectList
              options={this.state.modalOptions.options}
              onSelect={this.state.modalOptions.onSelect} />

        </PopupModal>

        <Button
           onPress={() => this.props.savePreferences(1, {})}
           title="DONE!" />
      </View>
    );
  }
}

export default Preferences;