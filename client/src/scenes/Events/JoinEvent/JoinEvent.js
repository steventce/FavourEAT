import React, { Component } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button, Container, Content } from 'native-base';
import JoinEventContainer from './JoinEventContainer';

const MAX_CODE_LENGTH = 8;

class JoinEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: ''
    }
  }

  render() {
    return (
      <Container>
        <Content style={{ padding: 10 }}>
          <View>
            <Text>Input invite code: </Text>
            <TextInput onChangeText={(text) => this.setState({ code: text })} value={this.state.code} 
              maxLength={MAX_CODE_LENGTH}/>
          </View>
          <View>
            <Button primary onPress={() => this.props.eventJoin(this.state.code)} >
              <Text>Join</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

export default JoinEvent;