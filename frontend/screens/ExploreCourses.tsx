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
  Animated,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RadioButton} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Pressable} from 'react-native';

type ExploreCoursesProps = NativeStackScreenProps<
  RootStackParamList,
  'ExploreCourses'
>;

const ExploreCourses = ({route}: ExploreCoursesProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState('2');

  const retrieveData = async () => {
    setLoading(true);
    try {
      const role = JSON.parse(await AsyncStorage.getItem('role'));
      await setRole(role);
      let emailId = '';
      let semester = 0;
      if (role === '0') {
        emailId = JSON.parse(await AsyncStorage.getItem('taEmail'));
      } else {
        emailId = JSON.parse(await AsyncStorage.getItem('email'));
        let temp = JSON.parse(await AsyncStorage.getItem('semester'));        
        console.log('Semester:', temp);
        // convert semester to number
        temp = parseInt(temp);
        semester = temp;
        instituteName = await JSON.parse(await AsyncStorage.getItem('instituteName'));
      }
      // const emailId = JSON.parse(await AsyncStorage.getItem('email'));
      await setEmail(emailId);
      const response = await axios.get('http://10.200.6.190:8080/getCoursesBySemester', {
        params: {
          semester: semester,
          instituteName: instituteName,
        },
      });
      console.log('Response:', response.data);
      console.log('Email:', emailId);
      await setCourses(response.data);
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
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  const CourseItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[styles.profileDetailsCard, styles.elevation]}
        onPress={() => {
          navigation.push('CourseEnroll', {courseId: item.id});
        }}>
        <Text
          style={[
            styles.detailValueItem,
            {fontWeight: 'bold', paddingLeft: 0, marginTop: 10, fontSize: 20},
          ]}>
          {item.name}
        </Text>
        <Text style={styles.detailValueItem}>{item.instructor}</Text>
        <View style={styles.separator}></View>
        <Text style={styles.detailKeyItem}>
          Description:{' '}
          <Text
            style={[
              styles.detailValueItem,
              {fontWeight: 'regular', fontSize: 16, color: '#4d4d4d'},
            ]}>
            {item.description}
          </Text>
        </Text>

        <View style={styles.separator}></View>
        <Text style={styles.detailKeyItem}>
          Credits:{' '}
          <Text
            style={[
              styles.detailValueItem,
              {fontWeight: 'regular', fontSize: 16, color: '#4d4d4d'},
            ]}>
            {item.credits}
          </Text>
        </Text>
        <View style={styles.separator}></View>
      </TouchableOpacity>
    );
  };

  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 45);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 45],
    outputRange: [0, -45],
  });

  return (
    <>
      <Animated.View
        style={{
          transform: [{translateY: translateY}],
          elevation: 4,
          zIndex: 100,
        }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle} onPress={() => {}}>
            Explore Courses
          </Text>
        </View>
      </Animated.View>
      <View style={[styles.bottomNavigationBar, styles.elevation]}>
        <Pressable
          onPress={() => {
            role === '2'
              ? navigation.replace('StudentDashboard')
              : navigation.replace('FacultyTADashboard');
          }}
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            width: '30%',
          }}>
          <Ionicons name="grid-outline" size={28} color="#6d6d6d" />
          <Text style={{color: '#6d6d6d', fontSize: 16}}>Dashboard</Text>
        </Pressable>
        <Pressable
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            width: '30%',
            fontWeight: 'bold',
          }}>
          <Ionicons name="compass-outline" size={28} color="#1d1d1d" />
          <Text style={{color: '#1d1d1d', fontSize: 16, fontWeight: 'bold'}}>
            Explore
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.replace('StudentProfile');
          }}
          style={{flexDirection: 'column', alignItems: 'center', width: '30%'}}>
          <Ionicons name="person-outline" size={28} color="#6d6d6d" />
          <Text style={{color: '#6d6d6d', fontSize: 16}}>Profile</Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        <ScrollView
          style={{flex: 1, width: '100%'}}
          onScroll={e => {
            scrollY.setValue(e.nativeEvent.contentOffset.y);
          }}>
          <View style={styles.subContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#2d2d2d" />
            ) : (
              <View style={styles.profileInformation}>
                {courses.map((item, index) => {
                  key = item.id;
                  return <CourseItem key={key} item={item} />;
                })}
              </View>
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
    backgroundColor: 'transparent',
    // backgroundColor: '#eaeaea',
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
    paddingBottom: 80,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    width: '100%',
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
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  },
  detailKeyItem: {
    fontSize: 15,
    color: '#7d7d7d',
    fontWeight: 'bold',
  },
  detailValueItem: {
    fontSize: 18,
    color: '#1d1d1d',
  },
  separator: {
    width: '100%',
    marginTop: 2,
    marginBottom: 2,
  },
  elevation: {
    elevation: 7,
    shadowColor: '#1d1d1de0',
  },
});

export default ExploreCourses;
