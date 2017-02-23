import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import Swipe from './Swipe';
import { saveSwipe } from '../../reducers/Swipe/actions';

class SwipeContainer extends Component {
    async postSwipe() {
        try {
            const user_id = await AsyncStorage.getItem('user_id');
            console.log(user_id);
            this.props.dispatch(saveSwipe(user_id));
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
        <Swipe postSwipe={this.postSwipe.bind(this)} />
        );
    }

}

export default connect()(SwipeContainer);