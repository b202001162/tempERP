import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AdminLoginProps = NativeStackScreenProps<RootStackParamList, 'AdminLogin'>;

const AdminLogin = ({route}: AdminLoginProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState('3');

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
    let response = {};
    if (role === '3') {
      await AsyncStorage.setItem('adminEmail', await JSON.stringify(email));
      response = await axios.post(
        `http://10.200.6.190:8080/loginInstituteAdmin`,
        {email: email, password: password},
      );
    } else if (role === '4') {
      await AsyncStorage.setItem(
        'superAdminEmail',
        await JSON.stringify(email),
      );
      response = await axios.post(
        `http://10.200.6.190:8080/loginSuperAdmin`,
        {email: email, password: password},
      );
    }

    console.log('Response:', response.data);

    if (response.data === 'Fail' || response.data === 'Invalid Email') {
      await AsyncStorage.clear();
      alert(response.data);
      setLoading(false);
      return;
    }
    // 2 for Student
    // 1 for Faculty
    // 0 for TA
    await AsyncStorage.setItem('role', await JSON.stringify(role));
    if (role === '3') {
      navigation.replace('InstituteAdminDashboard');
    } else {
      navigation.replace('SuperAdminDashboard');
    }
  };

  const retriveData = async () => {
    let temp = JSON.parse(await AsyncStorage.getItem('role'));
    if (temp !== null) {
      if (temp === '3') {
        navigation.replace('InstituteAdminDashboard');
      } else {
        navigation.replace('SuperAdminDashboard');
      }
    }
  };

  React.useEffect(() => {
    retriveData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.roleChoice}>
        <Pressable
          style={role !== '3' ? styles.choice : styles.activeChoice}
          onPress={() => {
            setRole('3');
          }}>
          <Text
            style={role !== '3' ? styles.choiceText : styles.activeChoiceText}>
            Admin
          </Text>
        </Pressable>
        <Pressable
          style={role !== '4' ? styles.choice : styles.activeChoice}
          onPress={() => {
            setRole('4');
          }}>
          <Text
            style={role !== '4' ? styles.choiceText : styles.activeChoiceText}>
            Super Admin
          </Text>
        </Pressable>
      </View>
      {role === '1' ? <Text style={styles.title}>Faculty Login</Text> : null}
      {role === '0' ? <Text style={styles.title}>TA Login</Text> : null}
      {role === '2' ? <Text style={styles.title}>Student Login</Text> : null}
      <TextInput
        style={[styles.input, {borderColor: emailError ? 'red' : '#5d5d5d'}]}
        placeholderTextColor="#4d4d4d"
        placeholder="Enter email address"
        editable={!loading}
        onChangeText={text => setEmail(text)}
      />
      {emailError ? (
        <Text style={{color: 'red'}}>Email is required</Text>
      ) : null}
      <TextInput
        style={[styles.input, {borderColor: passwordError ? 'red' : '#5d5d5d'}]}
        placeholderTextColor="#4d4d4d"
        placeholder="Enter password"
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
        <Text style={{color: '#eaeaea', fontSize: 16, fontWeight: 'bold'}}>
          Login
        </Text>
      </TouchableOpacity>
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
  roleChoice: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // width: '80%',
    marginBottom: 10,
    backgroundColor: '#fefefe',
    borderRadius: 8,
    marginBottom: 20,
  },
  choice: {
    padding: 10,
    margin: 5,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeChoice: {
    padding: 10,
    margin: 5,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    color: '#eaeaea',
    borderRadius: 8,
  },
  choiceText: {
    color: '#2d2d2d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeChoiceText: {
    color: '#eaeaea',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminLogin;
