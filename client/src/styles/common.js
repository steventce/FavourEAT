import { StyleSheet } from 'react-native';

export const colors = {
  APP_PRIMARY_LIGHT: '#ffb318',
  APP_PRIMARY_DARK: '#5A5A5A',
  NOPE_COLOR: '#6C8CE6',
  YUP_COLOR: '#F36D6D',
  RATING_COLOR: '#bd081c'
};

export const colorsList = [
  '#03A9F4',
  '#009688',
  '#FFC107',
  '#FF5722',
  '#607D8B',
  '#9C27B0'
];

const common = StyleSheet.create({
  iconCol: {
    color: '#bd081c'
  },
  swipeBtn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginRight: 5
  },
});

export default common;
