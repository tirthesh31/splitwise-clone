import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView 
} from 'react-native';
import { auth,database } from '../../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Colors from '../../utils/Colors';
import { ref, set } from 'firebase/database'; // For Realtime Database

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      Alert.alert('Error', 'Please enter all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const userId = email.replace(/\./g, '_'); // Replace '.' in email for valid Firebase keys
      await set(ref(database, `users/${userId}`), {
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
      });
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home',{userId});
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Image 
          source={require('../../assets/icon.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor={Colors.textPrimary}
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor={Colors.textPrimary}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={Colors.textPrimary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.textPrimary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={Colors.textPrimary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: Colors.primary,
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  loginText: {
    color: Colors.textPrimary,
  },
  loginLinkText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default SignUp;