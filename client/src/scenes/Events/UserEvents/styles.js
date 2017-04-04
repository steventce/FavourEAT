import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/common';

export const PARALLAX_HEADER_HEIGHT = 270;
const ROW_CONTENT_MARGIN = 15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15
  },
  sectionContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 20
  },
  foreground: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: PARALLAX_HEADER_HEIGHT
  },
  thumbnail: {
    alignSelf: 'center',
    marginTop: 30
  },
  avatar: {
    marginBottom: ROW_CONTENT_MARGIN,
    marginTop: ROW_CONTENT_MARGIN
  },
  body: {
    margin: ROW_CONTENT_MARGIN
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
    backgroundColor: colors.APP_PRIMARY_DARK,
    margin: 0,
    marginTop: 0,
    padding: 0
  },
  bodyText: {
    color: 'black',
    fontSize: 18
  },
  sectionText: {
    color: 'white',
    fontSize: 18
  }
});

export default styles;
