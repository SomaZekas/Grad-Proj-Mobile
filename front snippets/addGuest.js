/**
 * 
 *  https://www.npmjs.com/package/react-native-simple-crypto
 * 
 */


import React, { useState } from 'react';
import type { Node } from 'react';
import RNSimpleCrypto from 'react-native-simple-crypto';
import { sha256 } from 'react-native-sha256';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Button,
  Alert,
  Keyboard
} from 'react-native';

const App: () => Node = () => {

  const currentDate = new Date();
  // const [currentDay, currentMonth, currentYear] = [
  //   currentDate.getDate(),
  //   currentDate.getMonth() + 1,
  //   currentDate.getFullYear()
  // ];
  const [guestName, setGuestName] = useState('');
  const [enteranceDate, setEntranceDate] = useState('');
  const [carId, setCarId] = useState('');
  const [hashedData, setHashedData] = useState('');

  const RSAPublicKey = '-----BEGIN PUBLIC KEY-----\n' +
  'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgE89AqXX43vjSjBUGPHp2r3uMd2U\n' +
  '8dzowfWXxMy7E6m/YwicGGYKls9KyGBom4wInuBEQutP5Edgfh3dhZTVRxICt94c\n' +
  'cP3H+2Ou4E77shHsiIz820s2l151tipEcMLF1+kR4GdESpclTDSHWBSFN04hd52H\n' +
  'PGL1sBVOPskVfjZJAgMBAAE=\n' +
  '-----END PUBLIC KEY-----';

  const sendGuestData = () => {
    fetch('http://192.168.1.27:5000/owners/newguest', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          from: 'Mobile',
          name: guestName,
          date: enteranceDate,
          car_id: carId,
          hashed: hashedData
      })
      }).then((response) => response.json()).then((json) => {
      if (json.confirmation == 'success') {
          Alert.alert('Success');
      } else if (json.confirmation == 'failure'){
          Alert.alert('Failure', 'Please check your inputs.');
      } else {
          Alert.alert('Something\'s Wrong', 'Please try again in other time.');
      }
      }).catch((error) => {
      console.error(error);
      Alert.alert('Something\'s Wrong', 'Please check your internet connection.');
      });
  }

  const hashStrings = async () => {
    const fullString = guestName + ',' + enteranceDate + ',' + carId;
    const sha256Hash = await RNSimpleCrypto.SHA.sha256(fullString);
    setHashedData(sha256Hash);
    //console.log('\n-------\n' + fullString + '\n' + sha256Hash + '\n-------');

    sendGuestData();

    //Encrypt using RSA
    const RSAEncryptedMessage = await RNSimpleCrypto.RSA.encrypt(
      sha256Hash,
      RSAPublicKey
    );
    //console.log("rsa Encrypt:", RSAEncryptedMessage);


    //Share QR Code
    /**
     * RSA
     * ----
     * no. of bits
     * generates everytime it starts? -> if owner signs in, send once.
     * generated online, saved as a string in server? -> if server reboots (e.g. tech issus), how to automatically?
     * 
     * Guest
     * -----
     * How to associate owner with guest? session id? 
     * 
     */
  }

  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
      <View style={styles.container}>
        <Image
          style={styles.signInLogo}
          source={require('./assets/site-assets/secureGate-logo.png')}
        />
        <Text style={styles.label}>Guest Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g Joe Smith"
          keyboardType="default"
          onChangeText={val => setGuestName(val)}
        />
        <Text style={styles.label}>Entrance Date:</Text>
        <TextInput
          style={styles.input}
          placeholder="30-01-2022"
          keyboardType="default"
          onChangeText={val => setEntranceDate(val)}
        />
        <Text style={styles.label}>Car Plate Numbers:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g ABC-123"
          keyboardType="default"
          onChangeText={val => setCarId(val)}
        />
        <Button
          title="Generate QR Code"
          color="#777"
          onPress={() => hashStrings(guestName, enteranceDate, carId)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

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
    height: 140,
  },
  label: {
    fontSize: 18,
  },
  forgotPass: {
    margin: 20,
    color: '#444',
    fontSize: 15,
  },
});

export default App;
