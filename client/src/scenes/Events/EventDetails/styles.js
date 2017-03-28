import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  foreground: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    flexDirection: 'row',
    height: 300
  },
  foregroundContent: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginLeft: 20
  },
  foregroundTitle: {
    color: 'white',
    fontSize: 32
  },
  foregroundSubTitle: {
    color: 'white',
    fontSize: 24
  },
  card: {
    margin: 10,
    padding: 10
  },
  dateInput: {
    borderWidth: 0
  },
  datePicker: {
    margin: 15
  },
  btn: {
    margin: 10
  }
});
