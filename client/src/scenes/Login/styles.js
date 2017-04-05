import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  background: {
    height: Dimensions.get('window').height,
    position: 'absolute',
    width: Dimensions.get('window').width,
  },
  container: {
    backgroundColor: '#3d3d3d',
    flex: 1
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 100
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 40
  },
  logo: {
    height: 150,
    resizeMode: 'contain',
    width: null,
  }
});

