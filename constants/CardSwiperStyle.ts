import { StyleSheet } from 'react-native';

const CardStyles = StyleSheet.create({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: '#fff',
    },
    header: {
      color: '#fff',
      fontSize: 30,
      marginBottom: 30,
    },
    cardContainer: {
      width: '100%',
      maxWidth: 260,
      height: 350,
    },
    card: {
      position: 'absolute',
      backgroundColor: '#fff',
      width: '100%',
      maxWidth: 260,
      height: 450,
      shadowColor: '#4B0082',
      shadowOpacity: 0.2,
      shadowRadius: 20,
      borderRadius: 20,
      resizeMode: 'cover',
    },
    cardImage: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      borderRadius: 20,
      justifyContent: 'flex-end', // To make the text appear at the bottom
    },
    cardTitle: {
      position: 'relative',
      bottom: 0,
      margin: 10,
      color: '#000',
      fontWeight: 'bold',
      fontSize: 18,
    },
    cardDescription: {
      position: 'absolute',
      bottom: 30,
      margin: 10,
      color: '#000',
      fontSize: 12,
    },
    infoText: {
      height: 28,
      justifyContent: 'center',
      display: 'flex',
      zIndex: -100,
    }
  })
  export default CardStyles ;