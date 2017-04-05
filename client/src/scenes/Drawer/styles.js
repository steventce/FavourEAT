import { StyleSheet } from 'react-native';
import { colors } from '../../styles/common';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.FADED_TEXT_DARK,
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20
  },
  logo: {
    height: 100,
    marginTop: 20,
    resizeMode: 'contain',
    width: null
  },
  icon: {
    color: colors.APP_PRIMARY_DARK,
    fontSize: 25,
    width: 30,
    textAlign: 'center'
  },
  sectionTitle: {
    color: 'black',
    fontWeight: '500',
    marginLeft: 20
  }
});
