import React, { Component, PropTypes } from 'react';
import { Text } from 'react-native';
import { Container, Content, List, Body, Right, ListItem, Icon, Button } from 'native-base';

import PopupModal from '../../../components/PopupModal';
import SettingsBtn from '../../../components/SettingsBtn';
import SelectList from '../../../components/SelectList';
import RemovableItemsList from '../../../components/RemovableItemsList';

const priceOptions = [5, 15, 25, 40, 60, 100];
const distanceOptions = [1, 2, 3, 5, 10, 20];

class Preferences extends Component {
  static propTypes = {
    preferences: PropTypes.object.isRequired,
    changeRadius: PropTypes.func.isRequired,
    allCuisineTypes: PropTypes.array.isRequired,
    savePreferences: PropTypes.func.isRequired
  };

  static navigationOptions = {
    title: 'Restaurant Preferences',
    prev: ({ state }) => $(state.params.prev)
  }

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalOptions: {
        options: [],
        selectedOptions: [],
        onSelect: () => {},
        renderLabel: () => {}
      },
      preferences: this.props.preferences
    };
  }

  openModal = (options) => {
    return () => {
      this.setState({
        modalVisible: true,
        modalOptions: {
          options: options.options,
          selectedOptions: options.selectedOptions,
          onSelect: options.onSelect,
          renderLabel: options.renderLabel
        }
      });
    }
  };

  handleCloseModal = () => {
    this.setState({
      modalVisible: false
    });
  };

  handleChangeDistance = (value) => {
    this.setState({
      modalVisible: false,
      preferences: {
        ...this.state.preferences,
        distance: value
      }
    });
  };

  handleChangeMinPrice = (value) => {
    this.setState({
      modalVisible: false,
      preferences: {
        ...this.state.preferences,
        minPrice: value
      }
    });
  };

  handleChangeMaxPrice = (value) => {
    this.setState({
      modalVisible: false,
      preferences: {
        ...this.state.preferences,
        maxPrice: value
      }
    });
  };

  handleAddCuisineType = (value) => {
    const newCuisineTypes = new Set(this.state.preferences.cuisineTypes);
    newCuisineTypes.add(value);
    this.setState({
      modalVisible: false,
      preferences: {
        ...this.state.preferences,
        cuisineTypes: Array.from(newCuisineTypes)
      }
    });
  };

  handleRemoveCuisineType = (value) => {
    const newCuisineTypes = new Set(this.state.preferences.cuisineTypes)
    newCuisineTypes.delete(value);
    this.setState({
      preferences: {
        ...this.state.preferences,
        cuisineTypes: Array.from(newCuisineTypes)
      }
    });
  };

handleDone = () => {
  // TODO: kinda hacky
  this.props.savePreferences(this.state.preferences)
  const { params } = this.props.navigation.state;
  if (params && params.prev)  {
     const { navigate } = this.props.navigation;
     navigate(params.prev);
  }
}

  render() {
    const { params } = this.props.navigation.state;
    const readOnly = (params && params.readOnly) || false;

    return (
      <Container>
        <Content>
          <List>
            <SettingsBtn 
                onPress={this.openModal({
                  options: distanceOptions, 
                  selectedOptions: [this.state.preferences.distance],
                  onSelect: this.handleChangeDistance,
                  renderLabel: (option) => <Text>{`${option} km`}</Text>
                })}
                label="Maximum Travel Distance"
                disabled={readOnly}
                value={`${this.state.preferences.distance} km`} />
            <SettingsBtn 
                onPress={this.openModal({
                  options: priceOptions.filter((value) => value < this.state.preferences.maxPrice), 
                  selectedOptions: [this.state.preferences.minPrice],
                  onSelect: this.handleChangeMinPrice,
                  renderLabel: (option) => <Text>{`$${option}`}</Text>
                })}
                label="Minimum Price"
                disabled={readOnly}
                value={`$${this.state.preferences.minPrice}`} />
            <SettingsBtn 
                onPress={this.openModal({
                  options: priceOptions.filter((value) => value > this.state.preferences.minPrice), 
                  selectedOptions: [this.state.preferences.maxPrice],
                  onSelect: this.handleChangeMaxPrice,
                  renderLabel: (option) => <Text>{`$${option}`}</Text>
                })}
                label="Maximum Price"
                disabled={readOnly}
                value={`$${this.state.preferences.maxPrice}`} />
            <SettingsBtn 
                onPress={this.openModal({
                  options: this.props.allCuisineTypes, 
                  selectedOptions: this.state.preferences.cuisineTypes,
                  onSelect: this.handleAddCuisineType,
                  renderLabel: (option) => <Text>{option.label}</Text>
                })}
                disabled={readOnly}
                label="Cuisine Type" />
            <RemovableItemsList
              list={this.state.preferences.cuisineTypes}
              onRemove={this.handleRemoveCuisineType}
              readOnly={readOnly}
              renderRow={(rowData) => 
                <Text>
                  {rowData.label}
                </Text>
            } />
            <PopupModal 
                visible={this.state.modalVisible}
                onClose={this.handleCloseModal}>
              <SelectList
                  options={this.state.modalOptions.options}
                  selectedOptions={this.state.modalOptions.selectedOptions}
                  onSelect={this.state.modalOptions.onSelect}
                  renderLabel={this.state.modalOptions.renderLabel} />
            </PopupModal>

            {!readOnly && 
              <Button
                  full success
                  onPress={() => this.handleDone()}>
                <Text>
                  DONE
                </Text>
              </Button>
            }
          </List>
        </Content>
      </Container>
    );
  }
}

export default Preferences;