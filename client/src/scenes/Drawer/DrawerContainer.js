import { connect } from 'react-redux';
import { LoginManager } from 'react-native-fbsdk';
import { logout } from '../../reducers/Login/actions';
import Drawer from './Drawer';

const mapStateToProps = function(state, props) {
  const { navigation } = props;
  return { navigation };
}

const mapDispatchToProps = function(dispatch, props) {
  return {
    handleLogout: () => {
      const { navigate } = props.navigation;
      dispatch(logout());
      navigate('Login');
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
