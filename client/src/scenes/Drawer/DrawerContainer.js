import { connect } from 'react-redux';
import { LoginManager } from 'react-native-fbsdk';
import { logout } from '../../reducers/Login/actions';
import Drawer from './Drawer';
import FCM from '../../services/fcmService';

const mapStateToProps = function(state, props) {
  const { navigation } = props;
  return { navigation, auth: state.auth };
}

const mapDispatchToProps = function(dispatch, props) {
  return {
    handleLogout: (accessToken, userId) => {
      const { navigate } = props.navigation;

      FCM.cancelAllLocalNotifications();
      dispatch(logout(accessToken, userId));
      navigate('Login');
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
