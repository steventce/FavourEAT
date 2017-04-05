import { connect } from 'react-redux';
import { LoginManager } from 'react-native-fbsdk';
import { logout, resetToLogout } from '../../reducers/Login/actions';
import Drawer from './Drawer';
import FCM from '../../services/fcmService';

import {NavigationActions} from 'react-navigation';

const mapStateToProps = function(state, props) {
  const { navigation } = props;
  return { navigation, auth: state.auth };
}

const mapDispatchToProps = function(dispatch, props) {
  return {
    handleLogout: (accessToken, userId) => {
      const { navigate, dispatch: navDispatch } = props.navigation;

      FCM.cancelAllLocalNotifications();

      dispatch(logout(accessToken, userId)).then(() => {
        navDispatch(resetToLogout());
      }, () => {
        navDispatch(resetToLogout());
      });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
