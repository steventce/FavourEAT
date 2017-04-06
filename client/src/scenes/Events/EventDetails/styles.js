import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/common';

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
    padding: 20
  },
  dateInput: {
    borderWidth: 0
  },
  datePicker: {
    margin: 15
  },
  btn: {
    marginTop: 25
  },
  detail: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginTop: 10
  },
  detailIcon: {
    color: colors.APP_PRIMARY_DARK
  },
  star: {
    color: colors.APP_PRIMARY_LIGHT,
    fontSize: 50
  },
  starContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15
  },
  okRatingBtn: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 45
  },
  ratingTitle: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 24
  }
});
