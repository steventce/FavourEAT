import React, { Component } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import { Button, Container, Content, Item, Input, Label } from 'native-base';
import CreateEventContainer from './CreateEventContainer';
import DatePicker from 'react-native-datepicker';

import PopupModal from '../../../components/PopupModal';
import SettingsBtn from '../../../components/SettingsBtn';
import SelectList from '../../../components/SelectList';

var moment = require('moment');

// TODO: need to handle when round duration > end date time
const roundDurationOptions = [1, 2, 5, 12, 24];

class CreateEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventName: '',
      date: moment().format('YYYY-MM-DD'),
      time: moment().format('HH:mm'),
      duration: '',
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
      <Container style={{ paddingLeft: 10, paddingTop: 10 }}>
        <Content>
          <View>
            <Text>Event Name: </Text>
            <TextInput onChangeText={(name) => this.setState({ eventName: name })} value={this.state.eventName} />
          </View>
          <View>
            <Text>Date & Time:</Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
              <DatePicker
                date={this.state.date}
                mode="date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                minDate={new Date()}
                showIcon={false}
                onDateChange={(date) => { this.setState({ date: date }) }} />
              <DatePicker
                date={this.state.time}
                mode="time"
                format="HH:mm"
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
              label="Round Duration"
              disabled={false}
              value={`${this.state.duration}`} />
          </View>
          <View>
            <Button primary onPress={() => this.props.validate(this.state.eventName, this.state.date, this.state.time, this.state.duration)}>
              <Text>Create Event</Text>
            </Button>
          </View>

          <PopupModal
                visible={this.state.modalVisible}
                onClose={this.handleCloseModal}>
              <SelectList
                  options={this.state.modalOptions.options}
                  selectedOptions={this.state.modalOptions.selectedOptions}
                  onSelect={this.state.modalOptions.onSelect}
                  renderLabel={this.state.modalOptions.renderLabel} />
            </PopupModal>
        </Content>
      </Container>
    );
  }
}

export default CreateEvent;