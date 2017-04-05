import React, { Component } from 'react';
import { Alert, Text, TextInput, View, Image, Dimensions, StyleSheet } from 'react-native';
import { Button, Container, Content, Item, Input, Label, Card, Fab, Icon } from 'native-base';
import CreateEventContainer from './CreateEventContainer';
import DatePicker from 'react-native-datepicker';

import PopupModal from '../../../components/PopupModal';
import SettingsBtn from '../../../components/SettingsBtn';
import SelectList from '../../../components/SelectList';

import { createEvent } from '../../../config/images';
import moment from 'moment';
import styles from './styles';
import { colors } from '../../../styles/common';

// TODO: need to handle when round duration > end date time
const roundDurationOptions = [1, 2, 5, 12, 24];

class CreateEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventName: '',
      date: moment().format('YYYY-MM-DD'),
      time: moment().format('h:mm A'),
      duration: roundDurationOptions[0],
      modalVisible: false,
      modalOptions: {
        options: [],
        selectedOptions: [],
        onSelect: () => {},
        renderLabel: () => {}
      }
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

  handleDurationChange = (value) => {
    this.setState({ duration: value, modalVisible: false });
  };

  render() {
    return (
      <Container>
        <Content>
          <Card>
            <View>
              <Image source={createEvent} resizeMode="cover"
                style={{ height: 200, width: Dimensions.get('window').width }} />
            </View>
            <View style={styles.contentContainer}>
              <View>
                <Text style={{ fontSize: 24, color: 'black' }}>Event Details</Text>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>Event Name: </Text>
                <TextInput onChangeText={(name) => this.setState({ eventName: name })} value={this.state.eventName} />
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Date & Time:</Text>
                <View style={styles.datetimeContainer}>
                  <DatePicker
                    date={this.state.date}
                    mode="date"
                    format="YYYY-MM-DD"
                    customStyles={{ dateInput: { borderWidth: 0 } }}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    minDate={new Date()}
                    showIcon={false}
                    onDateChange={(date) => { this.setState({ date: date }) }} />
                  <DatePicker
                    date={this.state.time}
                    mode="time"
                    format="h:mm A"
                    customStyles={{ dateInput: { borderWidth: 0 } }}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    onDateChange={(time) => { this.setState({ time: time }) }} />
                </View>
              </View>
              <View>
                <SettingsBtn
                  onPress={this.openModal({
                    options: roundDurationOptions,
                    selectedOptions: [this.state.duration],
                    onSelect: this.handleDurationChange,
                    renderLabel: (option) => <Text>{`${option} hr(s)`}</Text>
                  })}
                  label="Round Duration:"
                  style={StyleSheet.flatten(styles.settingsBtn)}
                  disabled={false}
                  value={`${this.state.duration} hr(s)`} />
              </View>
              <Fab
                active={false}
                position="topRight"
                style={{ backgroundColor: colors.APP_PRIMARY_LIGHT }}
                onPress={() => {
                  const { eventName, date, time, duration } = this.state;
                  this.props.validate(eventName, date, time, duration);
                }}>
                <Icon name="md-send" />
              </Fab>

              <PopupModal
                visible={this.state.modalVisible}
                onClose={this.handleCloseModal}>
                <SelectList
                  options={this.state.modalOptions.options}
                  selectedOptions={this.state.modalOptions.selectedOptions}
                  onSelect={this.state.modalOptions.onSelect}
                  renderLabel={this.state.modalOptions.renderLabel} />
              </PopupModal>
            </View>
          </Card>
        </Content>
      </Container>
    );
  }
}

export default CreateEvent;
