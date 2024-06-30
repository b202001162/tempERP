import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RadioButton} from 'react-native-paper';

type EditStudentProfileProps = NativeStackScreenProps<
  RootStackParamList,
  'EditStudentProfile'
>;

const EditStudentProfile = ({route}: EditStudentProfileProps) => {
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
  const [radioValue, setRadioValue] = React.useState('first');
  const [program, setProgram] = React.useState('');
  const [institute, setInstitute] = React.useState('');
  const [dob, setDob] = React.useState('');
  const [gander, setGander] = React.useState('');

  const retrieveData = async () => {
    setLoading(true);
    try {
      const emailId = JSON.parse(await AsyncStorage.getItem('email'));
      await setEmail(emailId);
      //   await setPassword(JSON.parse(await AsyncStorage.getItem('password')));
      //   setFirstName(JSON.parse(await AsyncStorage.getItem('firstName')));
      //   setLastName(JSON.parse(await AsyncStorage.getItem('lastName')));
      //   setMobile(JSON.parse(await AsyncStorage.getItem('mobile')));
      console.log('Email:', email);
      try {
        const response = await axios.get(
          'http://10.200.6.190:8080/getStudentByEmailId',
          {
            params: {
              Email: emailId,
            },
          },
        );
        console.log('Response:', response.data);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setMobile(response.data.mobileNumber);
        setProgram(response.data.program);
        setInstitute(response.data.instituteName);
        setDob(response.data.dateOfBirth);
        setGander(response.data.gander);
      } catch (e) {
        console.log('Error:', e);
      }
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    retrieveData();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        'http://10.200.6.190:8080/updateStudentByEmail',
        {
          email: email,
          firstName: firstName,
          lastName: lastName,
          mobileNumber: mobile,
          program: program,
          instituteName: institute,
          dateOfBirth: dob,
          gander: gander,
        },
      );
      console.log('Response:', response.data);
      navigation.pop(), navigation.replace('StudentProfile');
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={20}
          color="#2d2d2d"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text
          style={styles.headerTitle}
          onPress={() => {
            navigation.goBack();
          }}>
          Edit Profile
        </Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="#2d2d2d" />
          ) : (
            <View style={styles.profileInformation}>
              <Text style={styles.title}>Academic Details:</Text>
              <View style={styles.profileDetailsCard}>
                <Text style={styles.detailKeyItem}>Program:</Text>
                <TextInput
                  style={[
                    styles.input,
                    {borderColor: firstNameError ? 'red' : '#5d5d5d'},
                  ]}
                  defaultValue={program}
                  onChangeText={text => setProgram(text)}
                />
                <View style={styles.separator} />
                <Text style={styles.detailKeyItem}>Institute:</Text>
                <TextInput
                  style={[
                    styles.input,
                    {borderColor: firstNameError ? 'red' : '#5d5d5d'},
                  ]}
                  defaultValue={institute}
                  onChangeText={text => setInstitute(text)}
                />
              </View>
              <Text style={styles.title}>Prosonal Details:</Text>
              <View style={styles.profileDetailsCard}>
                <Text style={styles.detailKeyItem}>First name:</Text>
                <TextInput
                  style={[
                    styles.input,
                    {borderColor: firstNameError ? 'red' : '#5d5d5d'},
                  ]}
                  defaultValue={firstName}
                  onChangeText={text => setFirstName(text)}
                />
                <Text style={styles.detailKeyItem}>Last name:</Text>
                <TextInput
                  style={[
                    styles.input,
                    {borderColor: firstNameError ? 'red' : '#5d5d5d'},
                  ]}
                  defaultValue={lastName}
                  onChangeText={text => setLastName(text)}
                />
                <View style={styles.separator} />
              </View>
              <Text style={styles.title}>Biographical Information:</Text>
              <View style={styles.profileDetailsCard}>
                <Text style={styles.detailKeyItem}>Date of Birth:</Text>
                <Text style={styles.detailValueItem}>{'08 APR 2003'}</Text>
                <View style={styles.separator} />
                <Text style={styles.detailKeyItem}>Gander:</Text>
                <RadioButton.Group value={radioValue}>
                  <RadioButton.Item
                    value="first"
                    label="Male"
                    status={radioValue === 'first' ? 'checked' : 'unchecked'}
                    onPress={() => setRadioValue('first')}
                  />
                  <RadioButton.Item
                    value="second"
                    label="Female"
                    status={radioValue === 'second' ? 'checked' : 'unchecked'}
                    onPress={() => setRadioValue('second')}
                  />
                </RadioButton.Group>
                <View style={styles.separator} />
                <TouchableOpacity
                  style={{alignItems: 'center', justifyContent: 'center'}}
                  onPress={() => {
                    handleSubmit();
                  }}>
                  <Text style={styles.submitButton}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    backgroundColor: '#eaeaea',
  },
  headerTitle: {
    fontSize: 20,
    color: '#2d2d2d',
    fontWeight: 'bold',
    marginLeft: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    color: '#2d2d2d',
    paddingTop: 10,
  },
  displayPictureContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#666666',
    marginBottom: 40,
    marginTop: 50,
  },
  profileInformation: {
    felx: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '90%',
  },
  title: {
    fontSize: 19,
    marginBottom: 0,
    color: '#3d3d3d',
    fontWeight: 'bold',
    margin: 0,
    padding: 0,
  },
  input: {
    width: '80%',
    padding: 8,
    paddingHorizontal: 16,
    marginTop: 7,
    borderWidth: 1,
    color: '#2d2d2d',
    borderColor: '#5d5d5d',
    borderRadius: 8,
    marginBottom: 10,
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
  profileDetailsCard: {
    width: '100%',
    // backgroundColor: '#efefef',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    paddingTop: 0,
    marginBottom: 15,
  },
  detailKeyItem: {
    fontSize: 15,
    color: '#7d7d7d',
    fontWeight: 'bold',
  },
  detailValueItem: {
    paddingLeft: 10,
    fontSize: 18,
    color: '#2d2d2d',
  },
  separator: {
    width: '100%',
    marginTop: 7,
    marginBottom: 7,
  },
});

export default EditStudentProfile;
