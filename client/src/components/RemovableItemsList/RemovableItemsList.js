import React, { Component, PropTypes } from 'react';
import { List, ListItem, Body, Right, Button, Icon } from 'native-base';

class RemovableItemsList extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    renderRow: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired
  };

  render() {
    return (
      <List
          dataArray={this.props.list}
          renderRow={(rowData) => 
        <ListItem>
          <Body>
            {this.props.renderRow(rowData)}
          </Body>
          {!this.props.readOnly && 
            <Right>
              <Button 
                  transparent
                  onPress={() => this.props.onRemove(rowData)}>
                <Icon name='md-close' />
              </Button>
            </Right>
          }
        </ListItem>
      } />
    );
  }

}

export default RemovableItemsList;