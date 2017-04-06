import React, { Component, PropTypes } from 'react';
import { Text, Alert, AsyncStorage, View } from 'react-native';
import { Container, Content, List, Body, Right, ListItem, Icon, Button, Spinner, Card, Fab } from 'native-base';

import PopupModal from '../../../components/PopupModal';
import SettingsBtn from '../../../components/SettingsBtn';
import SelectList from '../../../components/SelectList';
import RemovableItemsList from '../../../components/RemovableItemsList';

import { colors } from '../../../styles/common';

const priceOptions = [5, 15, 25, 40, 60, 100];
const distanceOptions = [0.25, 0.5, 1, 2, 3, 5, 10, 20];

class Preferences extends Component {
  static propTypes = {
    allCuisineTypes: PropTypes.array.isRequired,
    createEvent: PropTypes.func.isRequired
  };

  static navigationOptions = {
    title: 'Edit Restaurant Preferences'
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
      preferences: this.props.preferences,
      appAccessToken: ''
    };
  }

  async componentDidMount() {
    try {
      const appAccessToken = await AsyncStorage.getItem('app_access_token');
      if (appAccessToken) {
        this.setState({
          appAccessToken
        });
      }
      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        this.setState({
          userId
        });
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.handleChangeLocation({latitude, longitude});
        },
        (error) => Alert.alert(
          'Error',
          'Error getting current location. Please try again.',
          [
            {text: 'Go Back', onPress: () => this.props.navigation.goBack()}
          ],
          { cancelable: false }
        ),
        {enableHighAccuracy: false, timeout: 10000, maximumAge: 1000}
      );
    } catch (error) {
      Alert.alert('Error', 'Loading Error. Please try again.');
    }
  }

  openModal = (options) => {
    return () => {
      this.setState({
        modalVisible: true,
        modalOptions: {
          options: options.options,
          selectedOptions: options.selectedOptions,
          onSelect: options.onSelect,
          renderLabel: options.renderLabel,
          type: options.type || "radio"
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
        radius: value
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

  handleClickCuisine = (value, selected) => {
    if (!selected) {
      this.handleAddCuisineType(value);
    } else {
      this.handleRemoveCuisineType(value);
    }
  }

  handleAddCuisineType = (value) => {
    const newCuisineTypes = new Set(this.state.preferences.cuisineTypes);
    newCuisineTypes.add(value);
    this.setState({
      modalOptions: {
        ...this.state.modalOptions,
        selectedOptions: Array.from(newCuisineTypes),
      },
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
      modalOptions: {
        ...this.state.modalOptions,
        selectedOptions: Array.from(newCuisineTypes),
      },
      preferences: {
        ...this.state.preferences,
        cuisineTypes: Array.from(newCuisineTypes)
      }
    });
  };

  handleChangeLocation = (value) => {
    this.setState({
      preferences: {
        ...this.state.preferences,
        latitude: value.latitude,
        longitude: value.longitude,
      }
    });
  }

  handleDoneClick()  {
    this.props.createEvent(this.state.appAccessToken, this.state.userId, this.state.preferences);
    const currentLocation = {
      latitude: this.state.preferences.latitude,
      longitude: this.state.preferences.longitude,
    }
    this.props.startTournament(currentLocation);
  }

  render() {
    const { params } = this.props.navigation.state;
    const readOnly = (params && params.readOnly) || false;

    if (this.state.preferences.latitude === null) {
      return (
        <Spinner />
      );
    }

    return (
      <Container>
        <Content contentContainerStyle={{backgroundColor: 'white'}}>
          <Card>
            <View style={{ padding: 20 }}>
                <View>
                  <Text style={{ fontSize: 24, color: 'black' }}>General Preferences</Text>
                </View>
                <View style={{ marginTop: 20 }}>
                  <SettingsBtn
                      onPress={this.openModal({
                        options: distanceOptions,
                        selectedOptions: [this.state.preferences.radius],
                        onSelect: this.handleChangeDistance,
                        renderLabel: (option) => <Text>{`${option} km`}</Text>
                      })}
                      label="Maximum Travel Distance:"
                      disabled={readOnly}
                      value={`${this.state.preferences.radius} km`} />
                </View>
                <View>
                  <SettingsBtn
                      onPress={this.openModal({
                        options: priceOptions.filter((value) => value < this.state.preferences.maxPrice),
                        selectedOptions: [this.state.preferences.minPrice],
                        onSelect: this.handleChangeMinPrice,
                        renderLabel: (option) => <Text>{`$${option}`}</Text>
                      })}
                      label="Minimum Price:"
                      disabled={readOnly}
                      value={`$${this.state.preferences.minPrice}`} />
                </View>
                <View>
                  <SettingsBtn
                      onPress={this.openModal({
                        options: priceOptions.filter((value) => value > this.state.preferences.minPrice),
                        selectedOptions: [this.state.preferences.maxPrice],
                        onSelect: this.handleChangeMaxPrice,
                        renderLabel: (option) => <Text>{`$${option}`}</Text>
                      })}
                      label="Maximum Price:"
                      disabled={readOnly}
                      value={`$${this.state.preferences.maxPrice}`} />
                </View>
              </View>
              {!readOnly &&
                <Fab 
                    active={false}
                    position='topRight'
                    style={{ backgroundColor: colors.APP_PRIMARY_LIGHT }}
                    onPress={() => this.handleDoneClick()}>
                  <Icon name='md-send' />
                </Fab>
              }
            </Card>
            <Card>
              <View style={{ padding: 20 }}>
                <View>
                  <Text style={{ fontSize: 24, color: 'black' }}>
                    Preferred Cuisines
                  </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Button
                      block
                      info 
                      iconLeft
                      disabled={readOnly}
                      onPress={this.openModal({
                          options: this.props.allCuisineTypes,
                          selectedOptions: this.state.preferences.cuisineTypes,
                          type: "checkbox",
                          onSelect: this.handleClickCuisine,
                          renderLabel: (option) => <Text>{option.label}</Text>,
                        })}>
                      <Icon name='md-add' />
                      <Text style={{ color: 'white' }}>Add Cuisine</Text>
                    </Button>
                  
                  <RemovableItemsList
                    list={this.state.preferences.cuisineTypes}
                    onRemove={this.handleRemoveCuisineType}
                    readOnly={readOnly}
                    renderRow={(rowData) =>
                      <Text>
                        {rowData.label}
                      </Text>
                  } />
                </View>
              </View>
            </Card>              
            <PopupModal
                visible={this.state.modalVisible}
                onClose={this.handleCloseModal}>
              <SelectList
                  options={this.state.modalOptions.options}
                  selectedOptions={this.state.modalOptions.selectedOptions}
                  onSelect={this.state.modalOptions.onSelect}
                  renderLabel={this.state.modalOptions.renderLabel}
                  type={this.state.modalOptions.type}
                  onClose={this.handleCloseModal} />
            </PopupModal>
        </Content>
      </Container>
    );
  }
}

export default Preferences;
