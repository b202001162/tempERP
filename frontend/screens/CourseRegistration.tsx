import React, {useState} from 'react';
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
  Modal,
  Pressable,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {RadioButton} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';

type CourseRegistrationProps = NativeStackScreenProps<
  RootStackParamList,
  'CourseRegistration'
>;

const CourseRegistration = ({route}: CourseRegistrationProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {sem, studentEmail} = route.params;
  const [email, setEmail] = React.useState('');
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState('2');
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
  const [theme, setTheme] = React.useState('light');
  const [offeredCourses, setOfferedCourses] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [checkBoxValues, setCheckBoxValues] = useState({});
  const [studentName, setStudentName] = useState('');
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [numOfCourses, setNumOfCourses] = useState(0);
  const [offeredCourseCredits, setOfferedCourseCredits] = useState(0);
  const [creditsArray, setCreditsArray] = useState([]);
  const [prerequisites, setPrerequisites] = useState([]);

  const retrieveData = async () => {
    setLoading(true);
    try {
      const role = JSON.parse(await AsyncStorage.getItem('role'));
      await setRole(role);
      let emailId = '';
      let semester = 0;
      let studentName = '';
      let tempRegisteredCourses = [];
      if (role === '0') {
        emailId = JSON.parse(await AsyncStorage.getItem('taEmail'));
      } else {
        emailId = JSON.parse(await AsyncStorage.getItem('email'));
        let temp = JSON.parse(await AsyncStorage.getItem('semester'));
        console.log('Semester:', temp);
        // convert semester to number
        temp = parseInt(temp);
        semester = temp;
        instituteName = await JSON.parse(
          await AsyncStorage.getItem('instituteName'),
        );
        studentName = await JSON.parse(
          await AsyncStorage.getItem('studentName'),
        );
        tempRegisteredCourses = await JSON.parse(
          await AsyncStorage.getItem('tempRegisteredCourses'),
        );
      }
      // const emailId = JSON.parse(await AsyncStorage.getItem('email'));
      await setEmail(emailId);
      await setStudentName(studentName);
      const response = await axios.get(
        'http://10.200.6.190:8080/getCoursesBySemester',
        {
          params: {
            semester: semester,
            instituteName: instituteName,
          },
        },
      );
      console.log('Response:', response.data);
      console.log('Email:', emailId);
      await setCourses(response.data);
      await setOfferedCourses(response.data);
      let temp = 0,
        temp1 = 0,
        creditsArrayTemp = [];
      for (let i = 0; i < response.data.length; i++) {
        creditsArrayTemp[response.data[i].id] = response.data[i].credits;
        if (!response.data[i].isCoreCourse) {
          setCheckBoxValues(oldValues => {
            return {...oldValues, [response.data[i].id]: false};
          });
        } else {
          setCheckBoxValues(oldValues => {
            return {...oldValues, [response.data[i].id]: true};
          });
          temp += response.data[i].credits;
          temp1 += 1;
        }
        await setCreditsArray(creditsArrayTemp);
        await setTotalCredits(temp);
        await setNumOfCourses(temp1);
      }
      if (tempRegisteredCourses.length > 0) {
        let creaditsSum = 0;
        await setNumOfCourses(tempRegisteredCourses.length);
        for (let i = 0; i < tempRegisteredCourses.length; i++) {
          for (let j = 0; j < response.data.length; j++) {
            if (tempRegisteredCourses[i] === response.data[j].id) {
              creaditsSum += response.data[j].credits;
            }
          }

          setCheckBoxValues(oldValues => {
            return {...oldValues, [tempRegisteredCourses[i]]: true};
          });
        }
        await setTotalCredits(creaditsSum);
      }
      const res = await axios.get(
        `http://10.200.6.190:8080/getAllRegisteredCoursesForStudent`,
        {
          params: {
            email: emailId,
            semester: semester,
          },
        },
      );
      await setPrerequisites(res.data);
      console.log('Registered Courses:', res.data);
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    retrieveData();
  }, []);

  const setMultipleCheckBoxChange = (index, newValue, prerequisitesCourse, prerequisiteCourseName) => {
    console.log(
      'Index:',
      index,
      'New Value:',
      newValue,
      'Credits:',
      creditsArray[index],
      totalCredits,
      numOfCourses,
      prerequisitesCourse,
    );
    if (
      (prerequisitesCourse !== '') &&
      prerequisites.length > 0
    ) {
      let flag = false;
      for (let i = 0; i < prerequisites.length; i++) {
        if (prerequisitesCourse == prerequisites[i].id) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        alert("You can't register this course. Prerequisite course is " + prerequisiteCourseName);
        return;
      }
    }

    if (newValue) {
      if (numOfCourses + 1 > 6) {
        alert('Maximum courses limit exceeded! Which is 6.');
        return;
      }
      if (totalCredits + creditsArray[index] > 22) {
        alert('Maximum credits limit exceeded! Which is 22.');
        return;
      }
      setNumOfCourses(oldValue => oldValue + 1);
      setTotalCredits(oldValue => oldValue + creditsArray[index]);
    } else {
      if (numOfCourses - 1 < 0) {
        alert('Minimum courses limit exceeded! Which is 0.');
        return;
      }
      if (totalCredits - creditsArray[index] < 0) {
        alert('Minimum credits limit exceeded! Which is 0.');
        return;
      }
      setNumOfCourses(oldValue => oldValue - 1);
      setTotalCredits(oldValue => oldValue - creditsArray[index]);
    }
    setCheckBoxValues({...checkBoxValues, [index]: newValue});
  };

  const NewTermItem = ({item}) => {
    return (
      <View
        style={
          theme === 'light'
            ? styles.courseRegistrationTableRow
            : styles.dCourseRegistrationTableRow
        }>
        <View
          style={
            theme === 'light'
              ? styles.courseRegistrationTableCell
              : styles.dCourseRegistrationTableCell
          }>
          <Text
            style={
              theme === 'light'
                ? styles.courseRegistrationTableText
                : styles.dCourseRegistrationTableText
            }>
            {item.name}
          </Text>
        </View>
        <View
          style={
            (theme === 'light'
              ? styles.courseRegistrationTableCell
              : styles.dCourseRegistrationTableCell,
            {width: 50, textAlign: 'center'})
          }>
          <Text
            style={[
              theme === 'light'
                ? styles.courseRegistrationTableText
                : styles.dCourseRegistrationTableText,
              {textAlign: 'center'},
            ]}>
            {item.credits}
          </Text>
        </View>
        <View
          style={
            (theme === 'light'
              ? styles.courseRegistrationTableCell
              : styles.dCourseRegistrationTableCell,
            {width: 70})
          }>
          {item.isCoreCourse ? (
            <Text
              style={
                theme === 'light'
                  ? styles.courseRegistrationTableText
                  : styles.dCourseRegistrationTableText
              }>
              Core
            </Text>
          ) : (
            <Text
              style={
                theme === 'light'
                  ? styles.courseRegistrationTableText
                  : styles.dCourseRegistrationTableText
              }>
              Elective
            </Text>
          )}
        </View>
        <View
          style={
            (theme === 'light'
              ? styles.courseRegistrationTableCell
              : styles.dCourseRegistrationTableCell,
            {width: 80})
          }>
          <CheckBox
            disabled={item.isCoreCourse}
            value={checkBoxValues[item.id] || false}
            onValueChange={newValue =>
              setMultipleCheckBoxChange(item.id, newValue, item.prerequisites, item.prerequisiteCourseName)
            }
            tintColors={
              item.isCoreCourse
                ? {true: '#aaa', false: '#aaa'}
                : {true: '#4d4d4d', false: '#4d4d4d'}
            }
          />
        </View>
      </View>
    );
  };

  const handleSubmit = async () => {
    if (totalCredits < 16) {
      alert('Minimum credits limit not reached! Which is 16.');
      return;
    }
    setLoading(true);
    let temp = [];
    for (let key in checkBoxValues) {
      if (checkBoxValues[key]) {
        temp.push(key);
      }
    }
    try {
      const response = await axios.post(
        'http://10.200.6.190:8080/registerCoursesForStudent',
        {
          email: email,
          tempRegisteredCourses: temp,
        },
      );
      console.log('Response:', response.data);
      await AsyncStorage.setItem('tempRegisteredCourses', JSON.stringify(temp));
      alert('Courses Registered Successfully!');
      navigation.pop(), navigation.replace('StudentDashboard');
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 45);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 45],
    outputRange: [0, -45],
  });

  return (
    <>
      <View style={styles.container}>
        <Animated.View
          style={{
            transform: [{translateY: translateY}],
            elevation: 4,
            zIndex: 100,
          }}>
          <View style={styles.navigationBar}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="arrow-left-long"
                size={23}
                color="#2d2d2d"
                style={{marginRight: 10}}
                onPress={() => navigation.goBack()}
              />
              <Text style={styles.navigationText}>Course Registration</Text>
            </View>
            <View style={styles.navigationIcons}></View>
          </View>
        </Animated.View>
        {loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#2d2d2d" />
          </View>
        ) : (
          <ScrollView
            style={{flex: 1, width: '100%'}}
            onScroll={e => {
              scrollY.setValue(e.nativeEvent.contentOffset.y);
            }}>
            <View style={styles.subContainer}>
              <View style={{width: '95%'}}>
                <Text
                  style={
                    theme === 'light'
                      ? [styles.textStyle, {fontSize: 13}]
                      : [
                          styles.dPaymentHistoryStudentDetailsText,
                          {fontSize: 13},
                        ]
                  }>
                  Semester
                </Text>
                <Text
                  style={[
                    theme === 'light' ? styles.valueText : styles.dValueText,
                  ]}>
                  {1}
                </Text>
                <Text
                  style={
                    theme === 'light'
                      ? [styles.textStyle, {fontSize: 13}]
                      : [
                          styles.dPaymentHistoryStudentDetailsText,
                          {fontSize: 13},
                        ]
                  }>
                  Name
                </Text>
                <Text
                  style={
                    theme === 'light' ? styles.valueText : styles.dValueText
                  }>
                  {studentName}
                </Text>
                <View style={styles.courseRegistrationTable}>
                  <View style={styles.courseRegistrationTableHeader}>
                    <View style={styles.courseRegistrationTableCell}>
                      <Text style={styles.courseRegistrationTableHeaderText}>
                        Course Name
                      </Text>
                    </View>
                    <View
                      style={(styles.courseRegistrationTableCell, {width: 50})}>
                      <Text style={styles.courseRegistrationTableHeaderText}>
                        Credits
                      </Text>
                    </View>
                    <View
                      style={(styles.courseRegistrationTableCell, {width: 70})}>
                      <Text style={styles.courseRegistrationTableHeaderText}>
                        Type
                      </Text>
                    </View>
                    <View
                      style={(styles.courseRegistrationTableCell, {width: 80})}>
                      <Text style={styles.courseRegistrationTableHeaderText}>
                        Action
                      </Text>
                    </View>
                  </View>
                  {offeredCourses.map((item, index) => {
                    return <NewTermItem key={index} item={item} />;
                  })}
                </View>
                <View style={{width: '100%', alignItems: 'center'}}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}>
                    <Text
                      style={{
                        color: '#eaeaea',
                        fontSize: 16,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
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
    width: '100%',
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
  courseRegistrationTable: {
    width: '100%',
    marginTop: 20,
  },
  dCourseRegistrationTable: {
    width: '100%',
    marginTop: 20,
  },

  resultCGPATableHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#EAEAEA',
    padding: 10,
    // borderRadius: 10,
  },
  dResultCGPATableHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#23303C',
    padding: 10,
    // borderRadius: 10,
  },
  courseRegistrationTableHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EAEAEA',
    padding: 10,
    // borderRadius: 10,
  },
  dCourseRegistrationTableHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#23303C',
    padding: 10,
    // borderRadius: 10,
  },

  courseRegistrationTableHeaderText: {
    color: '#1E63BB',
    fontSize: 15,
  },
  dCourseRegistrationTableHeaderText: {
    color: '#98BAFC',
    fontSize: 15,
  },

  courseRegistrationTableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    padding: 10,
    // borderRadius: 10,
    borderTopWidth: 1,
    borderTopColor: '#555',
  },
  dCourseRegistrationTableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#22364f',
    padding: 10,
    // borderRadius: 10,
    borderTopWidth: 1,
    borderTopColor: '#555',
  },
  resultCGPATableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    padding: 10,
    // borderRadius: 10,
    borderTopWidth: 1,
    borderTopColor: '#555',
  },
  dResultCGPATableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#22364f',
    padding: 10,
    // borderRadius: 10,
    borderTopWidth: 1,
    borderTopColor: '#555',
  },

  courseRegistrationTableCell: {
    color: '#1E63BB',
    fontSize: 15,
    width: 110,
  },
  dCourseRegistrationTableCell: {
    color: '#98BAFC',
    fontSize: 15,
    width: 110,
  },

  moreInfoBtn: {
    backgroundColor: 'grey',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 7,
    paddingTop: 7,
  },
  dMoreInfoBtn: {
    backgroundColor: 'grey',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 7,
    paddingTop: 7,
  },

  moreInfoBtnText: {
    color: '#EAEAEA',
    fontSize: 13,
    fontWeight: 'bold',
  },
  dMoreInfoBtnText: {
    color: '#23303C',
    fontSize: 13,
    fontWeight: 'bold',
  },

  courseRegistrationTableText: {
    color: '#3d3d3d',
  },
  dCourseRegistrationTableText: {
    color: '#cdcdcd',
  },

  modalContainerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dModalView: {
    margin: 20,
    backgroundColor: '#1d1d1d',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  dModalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#eee',
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  dButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    backgroundColor: '#1d1d1d',
  },

  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#1E63BB',
    padding: 10,
    paddingHorizontal: 20,
  },
  dButtonClose: {
    backgroundColor: '#98BAFC',
    padding: 10,
    paddingHorizontal: 20,
  },

  textStyle: {
    color: '#5d5d5d',
    fontWeight: 'bold',
  },
  dTextStyle: {
    color: '#23303C',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  valueText: {
    color: '#1d1d1d',
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 10,
  },
  dValueText: {
    color: '#eee',
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 10,
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
});

export default CourseRegistration;
