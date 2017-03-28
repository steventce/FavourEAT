import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/common';

export const PARALLAX_HEADER_HEIGHT = 270;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 15
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15
  },
  foreground: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    height: PARALLAX_HEADER_HEIGHT
  },
  thumbnail: {
    alignSelf: 'center',
    marginTop: 30
  },
  event: {
    color: 'white',
    fontSize: 30,
    marginTop: 10,
    textAlign: 'center',
  },
  upcomingCount: {
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  createEventBtn: {
    alignSelf: 'center',
    margin: 5,
    justifyContent: 'center',
    width: 140
  },
  sectionHeader: {
    backgroundColor: colors.APP_PRIMARY_LIGHT,
    margin: 0,
    marginTop: 20,
    padding: 0
  }
});

export default styles;
