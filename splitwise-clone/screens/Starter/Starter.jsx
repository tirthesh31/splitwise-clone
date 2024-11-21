import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Colors from '../../utils/Colors';

const Starter = ({ navigation }) => {

  const handleGetStarted = () => {
    navigation.navigate('Login'); // Navigate to the Login screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
      </View>
      <Text style={styles.description}>
        Welcome to GroupSplit – the smart way to manage shared expenses. Easily create groups, track expenses, and settle up with friends. Simplify your finances, stay organized, and enjoy more time for what really matters. Let's get started!
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGetStarted}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Updated background color
    padding: 20,
  },
  imageContainer: {
    width: 250,
    height: 250,
    borderRadius: 75, // Circular shape
    overflow: 'hidden',
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  description: {
    textAlign: 'center',
    marginTop:100,
    fontWeight:'bold',
    marginBottom: 30,
    fontSize: 16,
    color: '#333333', // Adjust color as needed
  },
  button: {
    backgroundColor: Colors.primary, // Button background color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width:300,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff', // Button text color
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Starter;
