import React, { Component } from 'react';
import { Text, Image, View } from 'react-native';
import { Button, Container, Content, Form, H1, Item, Input, Label } from 'native-base';
import DatePicker from 'react-native-datepicker';

class CreateEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date(),
      time: new Date()
    };
  }

  render() {
    return (
      <Container>
        <Content>
          <View>
            <H1>CreateEvent</H1>
          </View>
          <Form>
            <Item fixedLabel>
              <Label>Event Name: </Label>
              <Input />
            </Item>
            <Item fixedLabel>
              <DatePicker
                date={this.state.date}
                mode="date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                minDate={new Date()}
                showIcon={false}
                onDateChange={(date) => {this.setState({ date: date })}} />
                <DatePicker
                date={this.state.time}
                mode="time"
                format="HH:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                onDateChange={(time) => {this.setState({ time: time })}} />
            </Item>
            <Item fixedLabel>
              <Label>Cuisine: </Label>
              <Input disabled />
            </Item>
            <Item fixedLabel>
              <Label>Price Range: </Label>
              <Input disabled />
            </Item>
            <Item fixedLabel last>
              <Label>Max Distance: </Label>
              <Input disabled />
            </Item>
          </Form>
          <View>
          <Button primary>
            <Text>Set Preferences</Text>
          </Button>
          <Button primary>
            <Text>Create Event</Text>
          </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

export default CreateEvent;