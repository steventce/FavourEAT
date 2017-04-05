import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    card: {
        flex: 1,
    },
    hours: {

      flex: 1,
      flexDirection: 'row',
    },
    overlapBtn: {
        width: 55,
        height: 55,
        borderWidth: 5,
        borderColor: '#e7e7e7',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginBottom: 15,
        marginTop: -100,
        backgroundColor: '#f7f7f7',
        marginLeft: 15
    },
    imgContainer: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    infoView: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      flex: 1,
    },
    restaurantInfo: {
      fontSize: 18,
      color: '#bd081c',
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
    reviewTxt: {
      fontSize: 15,
      marginLeft: 0,
      marginBottom: 5,
    },
    reviewTime: {
      fontSize: 12,
      marginBottom: 5
    },
    reviewRating: {
      fontSize: 17,
      fontWeight: 'bold'
    },
    reviewMargin: {
      marginBottom: 75
    },
    swipeBtns: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 5
    },
    txtColor: {
      color: '#444'
    }
});
