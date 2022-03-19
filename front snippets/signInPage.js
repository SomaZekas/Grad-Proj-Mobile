import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function App() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = (emailLower) => {
      fetch('http://192.168.1.27:5000/owners', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          from: 'Mobile',
          email: emailLower,
          password: password
      })
      }).then((response) => response.json()).then((json) => {
        if (json.confirmation == 'success') {
            Alert.alert('Welcome', 'Welcome Mr. ' + json.name);
        } else if (json.confirmation == 'failure') {
            Alert.alert('Try Again', json.message);
        } else {
            Alert.alert('Something\'s Wrong', 'Please try again in other time.');
        }
      }).catch((error) => {
        console.error(error);
        Alert.alert('Something\'s Wrong', 'Please check your internet connection.');
      });
  }


  return (
    <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss();}}>
      <View style={styles.container}>
          <Image 
          style={styles.signInLogo}
          source={require('./assets/site-assets/secureGate-logo.png')} 
          />
          <Text style={styles.label}>Email:</Text>
          <TextInput 
          style={styles.input}
          placeholder='e.g name@example.com'
          keyboardType='email-address'
          onChangeText={(val) => setEmail(val)}
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput 
          style={styles.input}
          secureTextEntry={true}
          onChangeText={(val => setPassword(val))}
          />
          <Button 
          title = 'LOGIN'
          color = '#777'
          onPress={() => login(email.toLowerCase())}
          />
          <Text 
            style={styles.forgotPass} 
            onPress={() => Alert.alert('Contact Administration',
            'Please contant the administration on 1234 to resend your password.')}
          >Forgot Password?</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
  },
  signInLogo: {
    width: '75%',
    height: 140
  },
  label: {
    fontSize: 18
  },
  forgotPass: {
    margin: 20,
    color: '#444',
    fontSize: 15
  }
});
