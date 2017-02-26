import { StyleSheet, Dimensions } from 'react-native';

const screen = Dimensions.get('window');
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0.5,
    width: screen.width,
    height: screen.height
  },
  container: {
    position: 'absolute',
    width: screen.width,
    height: screen.height,
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  modal: {
    backgroundColor: 'white',
    width: screen.width - 50
  }

});

export default styles;
