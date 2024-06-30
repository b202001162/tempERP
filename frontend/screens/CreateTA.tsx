import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome6';

type CreateTAProps = NativeStackScreenProps<
  RootStackParamList,
  'CreateTA'
>;

const CreateTA = ({route}: CreateTAProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [facultyData, setFacultyData] = React.useState({});
  const [facultyName, setFacultyName] = React.useState('');
  const [currentCourses, setCurrentCourses] = React.useState([]);
  const [facultyEmailList, setFacultyEmailList] = React.useState([]);

  const [courseName, setCourseName] = React.useState('');
  const [courseDescription, setCourseDescription] = React.useState('');
  const [credits, setCredits] = React.useState('');
  const [domains, setDomains] = React.useState([]);
  const [courseNameError, setCourseNameError] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState('');

  const retrieveData = async () => {
    setLoading(true);
    try {
      const emailId = JSON.parse(await AsyncStorage.getItem('adminEmail'));
      await setEmail(emailId);
      await setFacultyName(facultyName);
      console.log('Email:', emailId);
      //   const response = await axios.get(`http://10.200.6.190:8080/getFaculty`, {
      //     params: {
      //       Id: emailId,
      //     },
      //   });
      //   console.log('Response:', response.data);
      //   await setEmail(emailId);
      //   await setFacultyData(response.data);
      //   if (response.data.currentCourses !== null)
      //     await setCurrentCourses(response.data.currentCourseList);
      const response = await axios.get(
        `http://10.200.6.190:8080/getAllTAsEmails`,
      );
      console.log('Response:', response.data);
      // let temp = [];
      // for (let i = 0; i < response.data.length; i++) {
      //   let course = response.data[i];
      //   // remove space from the course name amd convert all characted to small alphabet
      //   course = course.replace(/\s/g, '');
      //   course = course.toLowerCase();
      //   temp.push(course);
      // }
      await setFacultyEmailList(response.data);
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
    // remove white space from the last work of course name
    let temp = courseName.trim();
    console.log('Course Name:', temp);
    if (facultyName === '' || newEmail === '') {
      alert('Please fill all the fields');
      return;
    } else if (courseNameError) {
      alert('Faculty email already exists');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://10.200.6.190:8080/addTAByAdmin?email=${email}`,
        {
          name: facultyName,
          email: newEmail,
        },
      );
      console.log('Response:', response.data);
      if (response.data === 'Successful') {
        alert('TA added successfully');
        navigation.pop(), navigation.replace('InstituteAdminDashboard');
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async (text: string) => {
    // if the prefix or the entire coursename is same as the courseList then show the alert
    let temp = text.replace(/\s/g, '');
    temp = temp.toLowerCase();
    for (let i = 0; i < facultyEmailList.length; i++) {
      if (facultyEmailList[i] === temp) {
        await setCourseNameError(true);
        break;
      } else {
        await setCourseNameError(false);
      }
    }
    await setNewEmail(text);
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
          <Text style={styles.navigationText}>Add TA</Text>
        </View>
        <View style={styles.navigationIcons}>
          
        </View>
      </View>
      <ScrollView style={{width: '100%'}}>
        <View style={styles.subContainer}>
          <View style={styles.courseContainer}>
            <Text style={styles.courseContainerTitle}>Name *</Text>
            <TextInput
              style={[styles.input, {marginBottom: 0}]}
              placeholder="Enter TA Name"
              onChangeText={text => setFacultyName(text)}
              placeholderTextColor="#4d4d4d"
            />
            <Text style={{color: 'red', fontSize: 14, marginBottom: 5}}></Text>
            <Text style={styles.courseContainerTitle}>Email *</Text>
            <TextInput
              style={[styles.input, {marginBottom: 0}]}
              placeholder="Enter TA Email"
              onChangeText={text => handleEmail(text)}
              placeholderTextColor="#4d4d4d"
            />
            {courseNameError ? (
              <Text style={{color: 'red', fontSize: 14, marginBottom: 5}}>
                Email already exists
              </Text>
            ) : (
              <Text
                style={{color: 'red', fontSize: 14, marginBottom: 5}}></Text>
            )}
          </View>
          <Pressable
            style={styles.submitButton}
            onPress={() => {
              handleSubmit();
            }}>
            {loading ? (
              <ActivityIndicator size="large" color="#eaeaea" />
            ) : (
              <Text
                style={{color: '#eaeaea', fontSize: 16, fontWeight: 'bold'}}>
                Submit
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
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
  subContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    width: '100%',
  },
  courseContainer: {
    width: '85%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 15,
    // backgroundColor: '#fefefe',
    borderRadius: 8,
    marginBottom: 20,
  },
  courseContainerTitle: {
    color: '#5d5d5d',
    fontSize: 17,
    fontWeight: 'bold',
  },
  courseContainerItem: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fefefe',
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#9d9d9d',
    borderWidth: 1,
    justifyContent: 'center',
  },
  courseContainerItemIcon: {
    position: 'absolute',
    right: 15,
  },
  courseContainerItemTextTitle: {
    color: '#2d2d2d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  courseContainerItemText: {
    color: '#2d2d2d',
    fontSize: 16,
  },
  createNewCourseButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  createNewCourseButton: {
    backgroundColor: '#2d2d2d',
    padding: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    color: '#2d2d2d',
    fontWeight: 'bold',
  },
  input: {
    width: '95%',
    padding: 8,
    paddingHorizontal: 12,
    marginTop: 1,
    borderWidth: 1,
    color: '#2d2d2d',
    borderColor: '#5d5d5d',
    borderRadius: 8,
    marginBottom: 15,
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
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeChoice: {
    padding: 10,
    margin: 5,
    width: 100,
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

export default CreateTA;
