import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/common';

export default StyleSheet.create({
  contentContainer: {
    padding: 20
  },
  datetimeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15
  },
  settingsBtn: {
    borderBottomWidth: 0,
    marginBottom: 10,
    marginTop: 10,
    padding: 0
  }
});
