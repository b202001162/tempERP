import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CreateAccountProps = NativeStackScreenProps<
  RootStackParamList,
  'CreateAccount'
>;

const CreateAccount = ({route}: CreateAccountProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [firstName, setFirstName] = React.useState('');
  const [firstNameError, setFirstNameError] = React.useState(false);
  const [lastName, setLastName] = React.useState('');
  const [lastNameError, setLastNameError] = React.useState(false);
  const [mobile, setMobile] = React.useState('');
  const [mobileError, setMobileError] = React.useState(false);

  const removeWhiteSpace = (text: string) => {
    return text.replace(/\s/g, '');
  };

  const handlesubmit = async () => {
    if (firstName === '') {
      setFirstNameError(true);
      return;
    } else {
      setFirstNameError(false);
    }
    if (lastName === '') {
      setLastNameError(true);
      return;
    } else {
      setLastNameError(false);
    }
    if (mobile === '') {
      setMobileError(true);
      return;
    } else {
      setMobileError(false);
    }
    if (email === '') {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }
    if (password === '') {
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }
    setLoading(true);
    setEmail(removeWhiteSpace(email));
    setPassword(removeWhiteSpace(password));
    setFirstName(removeWhiteSpace(firstName));
    setLastName(removeWhiteSpace(lastName));
    setMobile(removeWhiteSpace(mobile));
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Mobile:', mobile);
    try {
      const response = await axios.post('http://10.200.6.190:8080/addStudent', {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        mobile: mobile,
      });
      console.log('Response:', response.data);
      await AsyncStorage.setItem('email', JSON.stringify(email));
      await AsyncStorage.setItem('role', JSON.stringify('2'));
      navigation.replace('FacultyTADashboard');
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
    // setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>
      <TextInput
        style={[
          styles.input,
          {borderColor: firstNameError ? 'red' : '#5d5d5d'},
        ]}
        placeholderTextColor="#4d4d4d"
        placeholder="First Name"
        editable={!loading}
        onChangeText={text => setFirstName(text)}
      />
      {firstNameError ? (
        <Text style={{color: 'red'}}>First Name is required</Text>
      ) : null}
      <TextInput
        style={[styles.input, {borderColor: lastNameError ? 'red' : '#5d5d5d'}]}
        placeholderTextColor="#4d4d4d"
        placeholder="Last Name"
        editable={!loading}
        onChangeText={text => setLastName(text)}
      />
      {lastNameError ? (
        <Text style={{color: 'red'}}>Last Name is required</Text>
      ) : null}
      <TextInput
        style={[styles.input, {borderColor: mobileError ? 'red' : '#5d5d5d'}]}
        placeholderTextColor="#4d4d4d"
        placeholder="Enter Mobile no."
        editable={!loading}
        onChangeText={text => setMobile(text)}
      />
      {mobileError ? (
        <Text style={{color: 'red'}}>Mobile is required</Text>
      ) : null}
      <TextInput
        style={[styles.input, {borderColor: emailError ? 'red' : '#5d5d5d'}]}
        placeholderTextColor="#4d4d4d"
        placeholder="Enter Email Address"
        editable={!loading}
        onChangeText={text => setEmail(text)}
      />
      {emailError ? (
        <Text style={{color: 'red'}}>Email is required</Text>
      ) : null}
      <TextInput
        style={[styles.input, {borderColor: passwordError ? 'red' : '#5d5d5d'}]}
        placeholderTextColor="#4d4d4d"
        placeholder="Enter Password"
        secureTextEntry={true}
        editable={!loading}
        onChangeText={text => setPassword(text)}
      />
      {passwordError ? (
        <Text style={{color: 'red'}}>Password is required</Text>
      ) : null}
      <TouchableOpacity
        style={styles.submitButton}
        title="Login"
        onPress={() => {
          handlesubmit();
        }}>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text style={{color: '#eaeaea', fontSize: 16}}>Create Account</Text>
        )}
      </TouchableOpacity>
      <Text style={{color: '#3d3d3d', fontSize: 20}}>
        {' '}
        Already have an account?{' '}
        <TouchableOpacity
          onPress={() => {
            navigation.replace('FacultyTALogin');
          }}>
          <Text style={{color: '#1E63BB', fontSize: 18}}>Login</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    color: '#2d2d2d',
  },
  title: {
    fontSize: 24,
    marginBottom: 4,
    color: '#2d2d2d',
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    padding: 8,
    paddingHorizontal: 16,
    marginTop: 20,
    borderWidth: 1,
    color: '#2d2d2d',
    borderColor: '#5d5d5d',
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#2d2d2d',
    color: '#eaeaea',
    padding: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginBottom: 20,
    marginTop: 20,
  },
});

export default CreateAccount;
