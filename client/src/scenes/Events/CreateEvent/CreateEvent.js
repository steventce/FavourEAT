import React, { Component } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { Badge, Button, Container, Content, Form, H1, Item, Input, Label } from 'native-base';
import CreateEventContainer from './CreateEventContainer';
import DatePicker from 'react-native-datepicker';

var moment = require('moment');

class CreateEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventName: '',
      date: moment().format('YYYY-MM-DD'),
      time: moment().format('HH:mm')
    };
  }

  render() {
    return (
      <Container style={{ paddingLeft: 10 }}>
        <Content>
          <View>
            <Item fixedLabel>
              <Label>Event Name: </Label>
              <Input onChange={(name) => this.setState({ eventName: name })} />
            </Item>
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
            <Label>Cuisine:</Label>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              {this.props.preferences.cuisineTypes.map((cuisine) =>
                <Badge info key={cuisine.label}><Text>{cuisine.label}</Text></Badge>)}
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text>Price Range: </Text>
            <Text>${this.props.preferences.minPrice} - ${this.props.preferences.maxPrice}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text>Max Distance: </Text>
            <Text>{this.props.preferences.distance} km</Text>
          </View>
          <View>
            <Button primary onPress={() => this.props.setPreferences()}>
              <Text>Set Preferences</Text>
            </Button>
            <Button primary onPress={() => this.props.validate(this.state.eventName, this.state.date, this.state.time)}>
              <Text>Create Event</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

export default CreateEvent;