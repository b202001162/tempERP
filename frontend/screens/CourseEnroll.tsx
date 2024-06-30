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

type CourseEnrollProps = NativeStackScreenProps<
  RootStackParamList,
  'CourseEnroll'
>;

const CourseEnroll = ({route}: CourseEnrollProps) => {
  const {courseId} = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [courses, setCourses] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [TAs, setTAs] = React.useState([]);
  const [role, setRole] = React.useState('2');
  const [isTAAvalable, setIsTAAvalable] = React.useState(false);

  const retrieveData = async () => {
    setLoading(true);
    try {
      const role = JSON.parse(await AsyncStorage.getItem('role'));
      let taIsAvailable = false;
      if (role === '0') {
        taIsAvailable = await JSON.parse(
          await AsyncStorage.getItem('taIsAvailable'),
        );
        await setIsTAAvalable(taIsAvailable);
      }
      await setRole(role);
      let emailId = '';
      if (role === '0') {
        emailId = JSON.parse(await AsyncStorage.getItem('taEmail'));
      } else {
        emailId = JSON.parse(await AsyncStorage.getItem('email'));
      }
      // const emailId = JSON.parse(await AsyncStorage.getItem('email'));
      await setEmail(emailId);
      //   const response = await axios.get('http://10.200.6.190:8080/courses');
      const response = await axios.get(`http://10.200.6.190:8080/getCourse`, {
        params: {
          Id: courseId,
        },
      });
      console.log('Response:', response.data.students);
      console.log('Email:', emailId);
      await setCourses(response.data);
      await setTAs(response.data.tas);
      let tas = response.data.tas;
      // check whether the this ta already enrolled in this course
      if (tas !== null) {
        for (let i = 0; i < tas.length; i++) {
          if (tas[i].email === emailId) {
            alert('You are already enrolled in this course');
            navigation.pop();
          }
        }
      }
      //check whether the course is already enrolled
      if (response.data.students !== null) {
        for (let i = 0; i < response.data.students.length; i++) {
          if (response.data.students[i].id === emailId) {
            alert('You are already enrolled in this course');
            navigation.pop();
          }
        }
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

  const courseItem = item => {
    return (
      <View style={[styles.profileDetailsCard, styles.elevation]}>
        <Text style={styles.detailKeyItem}>Course Rating</Text>
        <Text style={styles.detailValueItem}>{item.courseRating}</Text>
        <View style={styles.separator}></View>
        <Text style={styles.detailKeyItem}>Instructor</Text>
        <Text style={styles.detailValueItem}>{item.instructor}</Text>
        <View style={styles.separator}></View>
        <Text style={styles.detailKeyItem}>Description</Text>
        <Text style={styles.detailValueItem}>{item.description}</Text>
        <View style={styles.separator}></View>
        <Text style={styles.detailKeyItem}>Credits</Text>
        <Text style={styles.detailValueItem}>{item.credits}</Text>
      </View>
    );
  };

  const TAItem = ({item, index}) => {
    // console.log('TA:', item);

    return (
      <View
        style={[styles.profileDetailsCard, {backgroundColor: 'transperant'}]}>
        <Text style={styles.detailKeyItem}>TA {index}</Text>
        <Text style={styles.detailKeyItem}>TA Name</Text>
        <Text style={styles.detailValueItem}>{item.name}</Text>
        <View style={styles.separator}></View>
        <Text style={styles.detailKeyItem}>TA Email</Text>
        <Text style={styles.detailValueItem}>{item.email}</Text>
        <View style={styles.separator}></View>
        <Text style={styles.detailKeyItem}>TA Rating</Text>
        <Text style={styles.detailValueItem}>{item.rating}</Text>
      </View>
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let response = {};
      if (role === '2') {
        response = await axios.post(
          `http://10.200.6.190:8080/enrollCourse?courseId=${courseId}&Id=${email}`,
        );
      } else {
        console.log(courseId, email);

        response = await axios.post(
          `http://10.200.6.190:8080/addCourseToTA?courseId=${courseId}&taId=${email}`,
        );
      }
      console.log('Response:', response.data);
      if (response.data === 'Pass') {
        alert('Request sent successfully');
        navigation.pop();
      } else if (response.data === 'Successful') {
        alert('Course Registred Successfully');
        navigation.pop();
      } else if (response.data === 'Fail') {
        alert('Course enrollment failed');
        navigation.pop();
      } else if (response.data === 'Already Enrolled') {
        alert('You are already enrolled in this course');
        navigation.pop();
      } else {
        alert('Request failed');
      }
    } catch (e) {
      console.log(e);
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
          Course Enrollment
        </Text>
      </View>
      <View style={styles.container}>
        <ScrollView style={{flex: 1, width: '100%'}}>
          <View style={styles.subContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#2d2d2d" />
            ) : (
              <>
                <View style={[styles.courseHeading, styles.elevation]}>
                  <Text style={styles.title}>{courses.name}</Text>
                </View>
                <View style={styles.profileInformation}>
                  <Text
                    style={{
                      marginTop: 15,
                      fontSize: 17,
                      fontWeight: 'semibold',
                      color: '#3d3d3d',
                    }}>
                    Course details:
                  </Text>
                  {courseItem(courses)}
                  <Text
                    style={{
                      marginTop: 15,
                      fontSize: 17,
                      fontWeight: 'semibold',
                      color: '#3d3d3d',
                    }}>
                    TA details:
                  </Text>
                  {TAs ? (
                    <>
                      {TAs.map((item, index) => {
                        return <TAItem item={item} key={index} index={index} />;
                      })}
                    </>
                  ) : (
                    <Text
                      style={{
                        color: '#7d7d7d',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      No TA assigned
                    </Text>
                  )}
                </View>
                {role === '0' && isTAAvalable ? (
                  <TouchableOpacity
                    onPress={() => {
                      handleSubmit();
                    }}
                    style={styles.submitButton}>
                    {role === '2' ? (
                      <Text style={{color: '#eaeaea', fontSize: 18}}>
                        Enroll
                      </Text>
                    ) : (
                      <Text style={{color: '#eaeaea', fontSize: 18}}>
                        Request for this course
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : null}
                {role === '2' ? (
                  <TouchableOpacity
                    onPress={() => {
                      handleSubmit();
                    }}
                    style={styles.submitButton}>
                    {role === '2' ? (
                      <Text style={{color: '#eaeaea', fontSize: 18}}>
                        Enroll
                      </Text>
                    ) : (
                      <Text style={{color: '#eaeaea', fontSize: 18}}>
                        Request for this course
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : null}
              </>
            )}
          </View>
        </ScrollView>
      </View>
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
    backgroundColor: '#ddd',
    color: '#2d2d2d',
    paddingTop: 10,
    width: '100%',
  },
  subContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    width: '100%',
  },
  courseHeading: {
    width: '85%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#eaeaea',
    borderRadius: 5,
    borderRightWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#9d9d9d',
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
    paddingTop: 7,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
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
    marginTop: 3,
    marginBottom: 3,
  },
  elevation: {
    elevation: 7,
    shadowColor: '#1d1d1de0',
  },
});

export default CourseEnroll;
