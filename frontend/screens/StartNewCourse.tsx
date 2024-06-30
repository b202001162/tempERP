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
import SelectDropdown from 'react-native-select-dropdown';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';

type StartNewCourseProps = NativeStackScreenProps<
  RootStackParamList,
  'StartNewCourse'
>;

const StartNewCourse = ({route}: StartNewCourseProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [facultyData, setFacultyData] = React.useState({});
  const [facultyName, setFacultyName] = React.useState('');
  const [currentCourses, setCurrentCourses] = React.useState([]);
  const [courseList, setCourseList] = React.useState([]);

  const [courseName, setCourseName] = React.useState('');
  const [courseDescription, setCourseDescription] = React.useState('');
  const [credits, setCredits] = React.useState('');
  const [domains, setDomains] = React.useState([]);
  const [courseNameError, setCourseNameError] = React.useState(false);
  const [semester, setSemester] = React.useState(0);
  const [allCourses, setAllCourses] = React.useState([]);
  const [otherSemesterCourses, setOtherSemesterCourses] = React.useState([]);
  const [selectedCourse, setSelectedCourse] = React.useState('');
  const [selectedCourseId, setSelectedCourseId] = React.useState('');

  const retrieveData = async () => {
    setLoading(true);
    try {
      const emailId = JSON.parse(await AsyncStorage.getItem('facultyEmail'));
      const facultyName = JSON.parse(await AsyncStorage.getItem('facultyName'));
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
        `http://10.200.6.190:8080/getAllCoursesNameByFaculty`,
        {
          params: {
            facultyEmail: emailId,
          },
        },
      );
      console.log('Response:', response.data);
      let temp = [];
      for (let i = 0; i < response.data.length; i++) {
        let course = response.data[i];
        // remove space from the course name amd convert all characted to small alphabet
        course = course.replace(/\s/g, '');
        course = course.toLowerCase();
        temp.push(course);
      }
      await setCourseList(temp);
      let instituteName = await JSON.parse(
        await AsyncStorage.getItem('instituteName'),
      );
      console.log('Institute Name:', instituteName);
      const res = await axios.get(
        `http://10.200.6.190:8080/getAllCoursesByInstituteName`,
        {
          params: {
            instituteName: instituteName,
          },
        },
      );
      console.log('Response:', res.data);
      await setAllCourses(res.data);
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
    await setCourseName(temp);
    if (courseName === '' || credits === '' || semester === 0) {
      alert('Please fill all the fields');
      return;
    } else if (courseNameError) {
      alert('Course name already exists');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://10.200.6.190:8080/addCourseAndSetToFaculty`,
        {
          name: courseName,
          credits: credits,
          instructor: facultyName,
          facultyEmail: email,
          courseRating: 0,
          semester: semester,
          prerequisites: selectedCourseId,
        },
      );
      console.log('Response:', response.data);
      if (response.data === 'Successful') {
        alert('Course added successfully');
        navigation.pop(), navigation.replace('FacultyTADashboard');
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeInDropDownSemester = async (selectedItem) => {
    console.log(selectedItem);
    let temp = allCourses.filter(course => course.semester !== selectedItem);
    await setOtherSemesterCourses(temp);
    await setSemester(selectedItem);
  };

  const handleCourseName = async (text: string) => {
    // if the prefix or the entire coursename is same as the courseList then show the alert
    let temp = text.replace(/\s/g, '');
    temp = temp.toLowerCase();
    for (let i = 0; i < courseList.length; i++) {
      if (courseList[i] === temp) {
        await setCourseNameError(true);
        break;
      } else {
        await setCourseNameError(false);
      }
    }
    await setCourseName(text);
  };

  const handleCreditsChange = async (text: string) => {
    if (text === '') {
      await setCredits(2);
      return;
    }
    1;
    // parse text to float
    // let temp = parseInt(text);
    let temp = parseFloat(text);
    if (temp >= 2 && temp <= 5) {
      await setCredits(text);
    } else {
      await setCredits(2);
      alert('Credits should be between 2 and 5');
    }
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
          <Text style={styles.navigationText}>New course</Text>
        </View>
        <View style={styles.navigationIcons}>
          <Icon
            name="bell"
            size={23}
            color="#2d2d2d"
            style={{marginRight: 15}}
          />
          <Icon name="user" size={23} color="#2d2d2d" />
        </View>
      </View>
      <ScrollView style={{width: '100%'}}>
        <View style={styles.subContainer}>
          <View style={styles.courseContainer}>
            <Text style={styles.courseContainerTitle}>Name *</Text>
            <TextInput
              style={[styles.input, {marginBottom: 0}]}
              placeholder="Enter Course Name"
              onChangeText={text => handleCourseName(text)}
              placeholderTextColor="#4d4d4d"
            />
            {courseNameError ? (
              <Text style={{color: 'red', fontSize: 14, marginBottom: 5}}>
                Course name already exists
              </Text>
            ) : (
              <Text
                style={{color: 'red', fontSize: 14, marginBottom: 5}}></Text>
            )}
            <Text style={styles.courseContainerTitle}>Credits *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  marginBottom: 0,
                },
              ]}
              placeholder="Enter Credits"
              onChangeText={text => handleCreditsChange(text)}
              placeholderTextColor="#4d4d4d"
              keyboardType="numeric"
              value={credits}
            />
            <Text
              style={[
                styles.courseContainerTitle,
                {
                  color: '#5d5d5d',
                  fontWeight: 'regular',
                  marginBottom: 10,
                  fontSize: 12,
                },
              ]}>
              * between 2 to 5{' '}
            </Text>
            <Text style={styles.courseContainerTitle}>Semester *</Text>
            {/* select dropdown semester from 1 to 8 */}
            <SelectDropdown
              data={[
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
                handleChangeInDropDownSemester(selectedItem.id);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && selectedItem.name) ||
                        'Select semester*'}
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

            {semester !== 0 ? (
              <>
                <Text style={styles.courseContainerTitle}>
                  Prerequisite Course
                </Text>
                <SelectDropdown
                  data={otherSemesterCourses}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                    setSelectedCourseId(selectedItem.id);
                  }}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <View style={styles.dropdownButtonStyle}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                          {(selectedItem && selectedItem.name) ||
                            'Select Course*'}
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
                        <Text style={styles.dropdownItemTxtStyle}>
                          {item.name}
                        </Text>
                      </View>
                    );
                  }}
                  showsVerticalScrollIndicator={true}
                  dropdownStyle={styles.dropdownMenuStyle}
                />
              </>
            ) : null}
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

export default StartNewCourse;
