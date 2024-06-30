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
import Icon from 'react-native-vector-icons/FontAwesome6';
import SelectDropdown from 'react-native-select-dropdown';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';

type CreateStudentByAdminProps = NativeStackScreenProps<
  RootStackParamList,
  'CreateStudentByAdmin'
>;

const CreateStudentByAdmin = ({route}: CreateStudentByAdminProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [firstName, setFirstName] = React.useState('');
  const [firstNameError, setFirstNameError] = React.useState(false);
  const [lastName, setLastName] = React.useState('');
  const [lastNameError, setLastNameError] = React.useState(false);
  const [mobile, setMobile] = React.useState('');
  const [mobileError, setMobileError] = React.useState(false);
  const [semester, setSemester] = React.useState(0);
  const [semesterError, setSemesterError] = React.useState(false);

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

    if (semester === 0) {
      setSemesterError(true);
      return;
    } else {
      setSemesterError(false);
    }

    setLoading(true);
    setEmail(removeWhiteSpace(email));
    setFirstName(removeWhiteSpace(firstName));
    setLastName(removeWhiteSpace(lastName));
    setMobile(removeWhiteSpace(mobile));
    console.log('Email:', email);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Mobile:', mobile);
    try {
      const response = await axios.post(
        'http://10.200.6.190:8080/addStudentByInstituteAdmin',
        {
          email: email,
          password: 'password',
          firstName: firstName,
          lastName: lastName,
          mobileNumber: mobile,
          instituteAdminEmail: await JSON.parse(
            await AsyncStorage.getItem('adminEmail'),
          ),
          semester: semester,
          instituteName: await JSON.parse(
            await AsyncStorage.getItem('instituteName'),
          ),
        },
      );
      console.log('Response:', response.data);
      navigation.pop(),
        navigation.pop(),
        navigation.replace('InstituteAdminDashboard');
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
    // setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="arrow-left-long"
            size={23}
            color="#2d2d2d"
            style={{marginRight: 10}}
          />
          <Text style={styles.navigationText}>Add Student</Text>
        </View>
        <View style={styles.navigationIcons}></View>
      </View>
      <View style={styles.subContainer}>
        <View style={{width: '85%', alignItems: ''}}>
          <Text
            style={{
              fontSize: 16,
              color: '#2d2d2d',
              marginTop: 20,
              marginBottom: 10,
            }}>
            Enter Student first name
          </Text>
        </View>
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
        <View style={{width: '85%', alignItems: ''}}>
          <Text
            style={{
              fontSize: 16,
              color: '#2d2d2d',
              marginTop: 20,
              marginBottom: 10,
            }}>
            Enter Student last name
          </Text>
        </View>
        <TextInput
          style={[
            styles.input,
            {borderColor: lastNameError ? 'red' : '#5d5d5d'},
          ]}
          placeholderTextColor="#4d4d4d"
          placeholder="Last Name"
          editable={!loading}
          onChangeText={text => setLastName(text)}
        />
        {lastNameError ? (
          <Text style={{color: 'red'}}>Last Name is required</Text>
        ) : null}
        <View style={{width: '85%', alignItems: ''}}>
          <Text
            style={{
              fontSize: 16,
              color: '#2d2d2d',
              marginTop: 20,
              marginBottom: 10,
            }}>
            Enter Student Mobile no.
          </Text>
        </View>
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
        <View style={{width: '85%', alignItems: ''}}>
          <Text
            style={{
              fontSize: 16,
              color: '#2d2d2d',
              marginTop: 20,
              marginBottom: 10,
            }}>
            Enter Student Email Address
          </Text>
        </View>
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
        <View style={{width: '85%', alignItems: ''}}>
          <Text
            style={{
              fontSize: 16,
              color: '#2d2d2d',
              marginTop: 20,
              marginBottom: 10,
            }}>
            Select Semester
          </Text>
          <SelectDropdown
            selectedValue={1}
            selectedLabelIndex={1}
            defaultValueByIndex={semester}
            data={[
              {id: 0, name: 'Select a semester'},
              {id: 1, name: 'Semester 1'},
              {id: 2, name: 'Semester 2'},
              {id: 3, name: 'Semester 3'},
              {id: 4, name: 'Semester 4'},
              {id: 5, name: 'Semester 5'},
              {id: 6, name: 'Semester 6'},
              {id: 7, name: 'Semester 7'},
              {id: 8, name: 'Semester 8'},
            ]}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
              setSemester(selectedItem.id);
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem.name) ||
                      'Select a semester*'}
                  </Text>
                  <Icon3
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    style={styles.dropdownButtonArrowStyle}
                    color="#2d2d2d"
                  />
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && {backgroundColor: '#D2D9DF'}),
                  }}>
                  <Text style={styles.dropdownItemTxtStyle}>{item.name}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={true}
            dropdownStyle={styles.dropdownMenuStyle}
          />
          {semesterError ? (
            <Text style={{color: 'red'}}>Semester is required</Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.submitButton}
          title="Login"
          onPress={() => {
            handlesubmit();
          }}>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={{color: '#eaeaea', fontSize: 16}}>Add Student</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    color: '#2d2d2d',
  },
  navigationBar: {
    width: '100%',
    paddingVertical: 20,
    // backgroundColor: '#00000010',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  navigationText: {
    color: '#2d2d2d',
    fontSize: 20,
    fontWeight: 'bold',
  },
  navigationIcons: {
    flexDirection: 'row',
    alignItems: 'center',
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
  subContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    width: '100%',
  },

  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: '#E9ECEF19',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#6d6d6d',
    marginLeft: 10,
    marginBottom: 15,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#5d5d5d',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});

export default CreateStudentByAdmin;
