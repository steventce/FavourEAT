import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import Swipe from './Swipe';
import { saveSwipe } from '../../reducers/Swipe/actions';

class SwipeContainer extends Component {
    async postSwipe() {
        try {
            const userId = await AsyncStorage.getItem('user_id');
            const accessToken = await AsyncStorage.getItem('app_access_token');
            this.props.dispatch(saveSwipe(userId, accessToken));
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