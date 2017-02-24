import React, { Component } from 'react';
import { Text, Image, View } from 'react-native';
import { Container, Content, Form, H1, Item, Input } from 'native-base';

class CreateEvent extends Component {

  render() {
    return (
      <Container>
        <Content>
          <View>
            <H1>CreateEvent</H1>
          </View>
          <Form>
            <Item>
              <Text>Event Name</Text>
              <Input />
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default CreateEvent;