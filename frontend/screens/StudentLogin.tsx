import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type StudentLoginProps = NativeStackScreenProps<
  RootStackParamList,
  'StudentLogin'
>;

const StudentLogin = ({route}: StudentLoginProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
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
    console.log('Email:', email);
    console.log('Password:', password);
    try {
      const response = await axios.post('http://10.200.6.190:8080/login', {
        email: email,
        password: password,
      });
      await AsyncStorage.setItem('email', await JSON.stringify(email));
      await AsyncStorage.setItem('role', await JSON.stringify('2'));
      // await AsyncStorage.setItem('password', await JSON.stringify(password));
      console.log('Response:', response.data);
      navigation.replace('StudentProfile');
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Login</Text>
      <TextInput
        style={[styles.input, {borderColor: emailError ? 'red' : '#5d5d5d'}]}
        placeholderTextColor="#4d4d4d"
        placeholder="Enter Mobile no./Email"
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
        editable={!loading}
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
      />
      {passwordError ? (
        <Text style={{color: 'red'}}>Password is required</Text>
      ) : null}
      <TouchableOpacity
        style={styles.submitButton}
        title="Login"
        onPress={() => {
          handleSubmit();
        }}>
        <Text style={{color: '#eaeaea', fontSize: 16}}>Login</Text>
      </TouchableOpacity>
      <Text style={{color: '#3d3d3d', fontSize: 20}}>
        {' '}
        Don't have an account?{' '}
        <TouchableOpacity
          onPress={() => {
            navigation.replace('CreateAccount');
          }}>
          <Text style={{color: '#1E63BB', fontSize: 18}}>Sign up</Text>
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
    marginBottom: 24,
    color: '#2d2d2d',
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    padding: 8,
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

export default StudentLogin;
