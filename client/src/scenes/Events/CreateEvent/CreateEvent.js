import React, { Component } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import { Button, Container, Content, Item, Input, Label } from 'native-base';
import CreateEventContainer from './CreateEventContainer';
import DatePicker from 'react-native-datepicker';

var moment = require('moment');

class CreateEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventName: '',
      date: moment().format('YYYY-MM-DD'),
      time: moment().format('HH:mm'),
      duration: moment().startOf('day').format('HH:mm')
    };
  }

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
            <Text>Round duration</Text>
          </View>
          <View>
            <Button primary onPress={() => this.props.validate(this.state.eventName, this.state.date, this.state.time, this.state.duration)}>
              <Text>Create Event</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

export default CreateEvent;