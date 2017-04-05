import React, { Component } from 'react';
import { Text, TextInput, View, Image, Dimensions } from 'react-native';
import { Button, Container, Content, Card, Fab, Icon } from 'native-base';
import JoinEventContainer from './JoinEventContainer';
import { joinEvent } from '../../../config/images';
import { colors } from '../../../styles/common';

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
        <Content>
          <Card>
            <View>
              <Image source={joinEvent} resizeMode="cover"
                style={{height: 200, width: Dimensions.get('window').width }} />
            </View>
            <View style={{ padding: 20 }}>
              <View>
                <Text style={{ fontSize: 24, color: 'black' }}>Join an Event</Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: '500' }}>Enter invite code: </Text>
                <TextInput onChangeText={(text) => this.setState({ code: text })} value={this.state.code}
                  maxLength={MAX_CODE_LENGTH}/>
              </View>
              <Fab
                active={false}
                position="topRight"
                style={{ backgroundColor: colors.APP_PRIMARY_LIGHT }}
                onPress={() => this.props.eventJoin(this.state.code)}>
                <Icon name="md-send" />
              </Fab>
            </View>
          </Card>
        </Content>
      </Container>
    );
  }
}

export default JoinEvent;
