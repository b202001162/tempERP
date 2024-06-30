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
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

type FacultyTADashboardProps = NativeStackScreenProps<
  RootStackParamList,
  'FacultyTADashboard'
>;

const FacultyTADashboard = ({route}: FacultyTADashboardProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState('1');
  const [facultyData, setFacultyData] = React.useState({});
  const [currentCourses, setCurrentCourses] = React.useState([]);
  const [taData, setTAData] = React.useState({});

  const retrieveData = async () => {
    setLoading(true);
    try {
      const role = await JSON.parse(await AsyncStorage.getItem('role'));
      if (role === null) {
        await AsyncStorage.clear();
        navigation.replace('FacultyTALogin');
        return;
      }
      await setRole(role);
      // const emailId = JSON.parse(await AsyncStorage.getItem('email'));
      let emailId = '';
      let response = {};
      if (role === '1') {
        emailId = await JSON.parse(await AsyncStorage.getItem('facultyEmail'));
        if (emailId === null) {
          await AsyncStorage.clear();
          navigation.replace('FacultyTALogin');
          return;
        }
        response = await axios.get(`http://10.200.6.190:8080/getFaculty`, {
          params: {
            Id: emailId,
          },
        });
        console.log('Email:', emailId);
        await AsyncStorage.setItem(
          'instituteName',
          await JSON.stringify(response.data.instituteName),
        );
        await AsyncStorage.setItem(
          'facultyName',
          JSON.stringify(response.data.name),
        );
      } else if (role === '0') {
        emailId = JSON.parse(await AsyncStorage.getItem('taEmail'));
        if (emailId === null) {
          await AsyncStorage.clear();
          navigation.replace('FacultyTALogin');
          return;
        }
        response = await axios.get(
          `http://10.200.6.190:8080/getTA?email=${emailId}`,
        );
        console.log('Email:', emailId);
        await setTAData(response.data);
        await AsyncStorage.setItem(
          'taIsAvailable',
          JSON.stringify(response.data.isAvailable),
        );
        console.log('TA Data:', response.data.currentCourses);
        if (response.data.currentCourses !== null)
          await setCurrentCourses(response.data.currentCourses);
        await AsyncStorage.setItem(
          'taName',
          JSON.stringify(response.data.name),
        );
      } else if (role === '2') {
        emailId = JSON.parse(await AsyncStorage.getItem('email'));
        if (emailId === null) {
          await AsyncStorage.clear();
          navigation.replace('FacultyTALogin');
          return;
        }
        response = await axios.get(`http://10.200.6.190:8080/getStudent`, {
          params: {
            Id: emailId,
          },
        });
        console.log('Email:', emailId);
        await AsyncStorage.setItem(
          'studentName',
          JSON.stringify(response.data.name),
        );
      }
      if (response.data === null) {
        await AsyncStorage.clear();
        alret('Invalid User');
        navigation.replace('FacultyTALogin');
        return;
      }
      console.log('Response:', response.data);
      await setEmail(emailId);
      await setFacultyData(response.data);
      if (role === '1' && response.data.currentCourseList !== null)
        await setCurrentCourses(response.data.currentCourseList);
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    retrieveData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* <Icon
            name="arrow-left-long"
            size={25}
            color="#2d2d2d"
            style={{marginRight: 10}}
          />
          <Text style={styles.navigationText}>Faculty Dashboard</Text> */}
        </View>
        <View style={styles.navigationIcons}>
          <Icon
            name="bell"
            size={23}
            color="#2d2d2d"
            style={{marginRight: 15}}
            onPress={() => {
              navigation.push('Notifications');
            }}
          />
          <Icon2
            onPress={() => {
              navigation.push('FacultyProfile');
            }}
            name="user-circle"
            size={23}
            color="#2d2d2d"
          />
        </View>
      </View>
      <ScrollView style={{width: '100%'}}>
        <View style={styles.subContainer}>
          <View style={{width: '100%', paddingLeft: 15}}>
            <Text style={styles.title}>
              Welcome, {facultyData ? facultyData.name : 'NULL'}
            </Text>
          </View>
          <View style={styles.courseContainer}>
            {role === '1' ? (
              <Text style={styles.courseContainerTitle}>Current Courses</Text>
            ) : (
              <Text style={styles.courseContainerTitle}>Assigned Courses</Text>
            )}
            {loading ? (
              <ActivityIndicator size="large" color="#2d2d2d" />
            ) : (
              <View style={{width: '100%', flexDirection: 'column-reverse'}}>
                {currentCourses ? (
                  <>
                    {currentCourses.map((item, index) => {
                      console.log('Item:', item);
                      return (
                        <Pressable
                          style={styles.courseContainerItem}
                          key={index}
                          onPress={() => {
                            navigation.push('CourseDetails', {
                              courseId: item.id,
                              courseName: item.name,
                              numOfStudents: item.numOfStudents,
                            });
                          }}>
                          <Text style={styles.courseContainerItemTextTitle}>
                            {item.name}
                          </Text>
                          <Icon
                            name="caret-right"
                            size={20}
                            color="#2d2d2d"
                            style={styles.courseContainerItemIcon}
                          />
                        </Pressable>
                      );
                    })}
                  </>
                ) : (
                  <Text style={{color: '#2d2d2d', fontSize: 16}}>
                    No courses available
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      {role === '1' && facultyData.currentSemesterCourses < 2 ? (
        <View style={styles.createNewCourseButtonContainer}>
          <TouchableOpacity
            style={styles.createNewCourseButton}
            onPress={() => {
              navigation.push('StartNewCourse');
            }}>
            <Icon name="plus" size={28} color="#eaeaea" />
          </TouchableOpacity>
        </View>
      ) : null}
      {role === '0' ? (
        <View style={[styles.bottomNavigationBar, styles.elevation]}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              width: '30%',
              fontWeight: 'bold',
            }}>
            <Ionicons name="grid-outline" size={28} color="#1d1d1d" />
            <Text style={{color: '#1d1d1d', fontSize: 16, fontWeight: 'bold'}}>
              Dashboard
            </Text>
          </View>
          <Pressable
            onPress={() => {
              navigation.replace('ExploreCourses');
            }}
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              width: '30%',
            }}>
            <Ionicons name="compass-outline" size={28} color="#6d6d6d" />
            <Text style={{color: '#6d6d6d', fontSize: 16}}>Explore</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.replace('FacultyProfile');
            }}
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              width: '30%',
            }}>
            <Ionicons name="person-outline" size={28} color="#6d6d6d" />
            <Text style={{color: '#6d6d6d', fontSize: 16}}>Profile</Text>
          </Pressable>
        </View>
      ) : null}
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
  bottomNavigationBar: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    zIndex: 100,
  },
  bottomNavigationBarActiveColor: {
    color: '#1d1d1d',
  },
  navigationText: {
    color: '#2d2d2d',
    fontSize: 18,
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
    width: '87%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 15,
    // backgroundColor: '#fefefe',
    borderRadius: 8,
    marginBottom: 20,
  },
  courseContainerTitle: {
    color: '#6d6d6d',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseContainerItem: {
    width: '97%',
    padding: 15,
    backgroundColor: '#fefefe',
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#9d9d9d',
    borderWidth: 1,
    justifyContent: 'center',
    marginLeft: 10,
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
  elevation: {
    elevation: 10,
    shadowColor: '#1d1d1de0',
  },
});

export default FacultyTADashboard;
