import { StyleSheet } from 'react-native';

export const colors = {
  APP_PRIMARY_LIGHT: '#ffb318'
};

const common = StyleSheet.create({
  iconCol: {
    color:'#bd081c'
  },
  swipeBtn: {
    width: 50,
    height: 50,
    borderWidth: 7,
    borderColor: '#e7e7e7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginRight: 5
  },
});

export default common;
