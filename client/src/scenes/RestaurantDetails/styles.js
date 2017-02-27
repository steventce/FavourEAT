import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        borderWidth: 5,
        borderColor: '#d6d7da',
        height: 120
    },
    card: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    hours: {
      lineHeight: 25,
      fontSize: 16,
      marginLeft: 15
    },
    overlapBtn: {
        width: 45,
        height: 45,
        borderWidth: 5,
        borderColor: '#e7e7e7',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        marginTop: -100,
        backgroundColor: '#f7f7f7',
        marginRight: 5
    },
    imgContainer: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        borderWidth: 5,
        borderColor: '#d6d7da',
        height: 250,
        alignItems: 'flex-end'
    },
    infoView: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      flex: 1,
      marginTop: 5
    },
    restaurantInfo: {
      fontSize: 18,
      color: '#bd081c',
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      marginTop: 5,
      marginLeft: 5
    },
    reviewTxt: {
      fontSize: 15,
      marginLeft: 15,
      marginBottom: 5
    },
    reviewTime: {
      fontSize: 11,
      fontStyle: 'italic',
      marginLeft: 5 
    },
    reviewRating: {
      fontSize: 17,
      fontWeight: 'bold',
      marginLeft: 5
    },
    reviewMargin: {
      marginTop: 10,
      marginBottom: 10 
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