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

type GradeSubmissionPerStudentProps = NativeStackScreenProps<
  RootStackParamList,
  'GradeSubmissionPerStudent'
>;

const GradeSubmissionPerStudent = ({route}: GradeSubmissionPerStudentProps) => {
  const {studentId, studentName, courseId, courseName} = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [courseData, setCourseData] = React.useState({});
  const [isEdit, setIsEdit] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [coursename, setCourseName] = React.useState('');
  const [credits, setCredits] = React.useState('');
  const [studentAssignmentsMarks, setStudentAssignmentsMarks] = React.useState(
    [],
  );
  const [totalMarksObtained, setTotalMarksObtained] = React.useState(0);
  const [totalMarks, setTotalMarks] = React.useState(0);
  const [grades, setGrades] = React.useState(0);
  const [isGradeSubmitted, setIsGradeSubmitted] = React.useState(false);

  const retrieveData = async () => {
    setLoading(true);
    try {
      const emailId = JSON.parse(await AsyncStorage.getItem('email'));
      console.log('Email:', studentId);
      const response = await axios.get(
        `http://10.200.6.190:8080/getAllAssignmentMarksPerStudentByCourse`,
        {
          params: {
            courseId: courseId,
            studentEmail: studentId,
          },
        },
      );
      console.log('Response:', response.data);
      if (response.data != null && response.data.length > 0) {
        await setStudentAssignmentsMarks(response.data);
        let totalMarks = 0;
        let totalMarksObtained = 0;
        response.data.map(item => {
          if (item.maxMarks == 0 || item.maxMarks == null) totalMarks += 10;
          else totalMarks += item.maxMarks;
          totalMarksObtained += item.obtainedMarks;
        });
        await setTotalMarks(totalMarks);
        await setTotalMarksObtained(totalMarksObtained);
      }
      const response2 = await axios.get(
        `http://10.200.6.190:8080/getResultsByStudent`,
        {
          params: {
            courseId: courseId,
            studentEmail: studentId,
          },
        },
      );
      console.log('Response2:', response2.data.grades);
      if (response2.data != null) {
        let grades = response2.data.grades;
        await setGrades(grades);
      }
      if (response2.data != null) await setIsGradeSubmitted(true);
      //   await setCourseData(response.data);
      //   await setDescription(response.data.description);
      //   await setCredits(response.data.credits);
      //   await setCourseName(courseName);
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleGradesChange = async text => {
    // if contains space or special characters remove them
    let regex = /^[0-9\b]+$/;
    if (!regex.test(text)) {
      alert('Grades must be between 1 and 10');
      return;
    }
    // if contains anything other than numbers remove them
    if (text == '') {
      alert('Grades must be between 1 and 10');
      return;
    }
    if (parseInt(text) < 1 || parseInt(text) > 10) {
      alert('Grades must be between 1 and 10');
      return;
    }
    await setGrades(parseInt(text));
  };

  React.useEffect(() => {
    retrieveData();
  }, []);

  const handleEvaluation = async () => {
    if (grades === 0 || grades < 1 || grades > 10) {
      alert('Grades must be between 1 and 10');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `http://10.200.6.190:8080/postResultPerStudent`,
        {
          courseId: courseId,
          email: studentId,
          grades: grades,
          facultyEmail: await JSON.parse(
            await AsyncStorage.getItem('facultyEmail'),
          ),
        },
      );
      console.log('Response:', response.data);
      alert('Grades submitted successfully');
      navigation.goBack(),
        navigation.push('ListOfStudents', {
          courseId: courseId,
          courseName: courseName,
        });
    } catch (e) {
      console.log('Error:', e);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="arrow-left-long"
            size={25}
            color="#2d2d2d"
            style={{marginRight: 10}}
          />
          <Text style={styles.navigationText}>Grade Submission</Text>
        </View>
        <View style={styles.navigationIcons}>
          <Icon
            name="bell"
            size={23}
            color="#2d2d2d"
            style={{marginRight: 15}}
          />
          <Icon2 name="user-circle" size={23} color="#2d2d2d" />
        </View>
      </View>
      <View style={styles.subContainer}>
        <View style={styles.header}>
          {loading ? (
            <ActivityIndicator size="large" color="#2d2d2d" />
          ) : (
            <>
              <Text style={styles.headerTitle}>{studentName}</Text>
              <Text style={styles.headerTitle}>{studentId}</Text>
            </>
          )}
        </View>
        <View style={styles.courseContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#2d2d2d" />
          ) : (
            <>
              <Text style={styles.courseContainerTitle}>
                Total Marks Obtained: {totalMarksObtained} out of {totalMarks}
              </Text>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  textAlign: 'center',
                }}>
                {isGradeSubmitted && !loading ? (
                  <Text
                    style={[
                      styles.courseContainerTitle,
                      {
                        color: '#2d2d2d',
                        marginTop: 10,
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginBottom: 10,
                        marginLeft: 0,
                        paddingLeft: 0,
                      },
                    ]}>
                    Grades: {grades}
                  </Text>
                ) : (
                  <>
                    <Text
                      style={{
                        color: '#7d7d7d',
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginTop: 10,
                      }}>
                      Enter Grades:
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {width: '40%', marginLeft: 10, marginBottom: 0},
                      ]}
                      placeholder="Enter grade"
                      keyboardType="numeric"
                      placeholderTextColor="#5d5d5d"
                      onChangeText={text => handleGradesChange(text)}
                      editable={!loading && !isGradeSubmitted}
                      value={grades.toString()}
                    />
                    <Text
                      style={[
                        styles.courseContainerTitle,
                        {
                          color: '#5d5d5d',
                          fontWeight: 'regular',
                          fontSize: 12,
                          marginLeft: 15,
                        },
                      ]}>
                      * Grades must be between 1 and 10
                    </Text>
                  </>
                )}
              </View>
              {isGradeSubmitted ? null : (
                <Pressable
                  onPress={() => handleEvaluation()}
                  style={[
                    styles.submitButton,
                    {
                      marginLeft: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 10,
                    },
                  ]}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#eaeaea" />
                  ) : (
                    <Text style={{color: '#eaeaea', fontSize: 18}}>
                      Submit Grades
                    </Text>
                  )}
                </Pressable>
              )}
              <Text
                style={[
                  styles.courseContainerTitle,
                  {
                    fontSize: 16,
                    color: '#2d2d2d',
                    fontWeight: 'normal',
                    marginBottom: 10,
                  },
                ]}>
                All Assignments marks
              </Text>
              <ScrollView
                style={{width: '100%', marginBottom: 20, height: 385}}>
                {studentAssignmentsMarks.map((item, index) => (
                  <View style={styles.courseContainerItem} key={index}>
                    <Text style={styles.courseContainerItemTextTitle}>
                      {item.topicName ? item.topicName : 'Topic'}
                    </Text>
                    <Text style={styles.courseContainerItemText}>
                      {item.assignmentName ? item.assignmentName : 'Assignment'}
                    </Text>
                    <Text style={styles.courseContainerItemText}>
                      <Text style={{fontWeight: 'bold'}}>
                        {item.obtainedMarks}
                      </Text>{' '}
                      out of{' '}
                      <Text style={{fontWeight: 'bold'}}>
                        {item.maxMarks ? item.maxMarks : '10'}
                      </Text>
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </View>
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
  header: {
    width: '90%',
    // height: 50,
    paddingVertical: 15,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    borderColor: '#1E63BB',
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
  editButton: {
    backgroundColor: '#2d2d2d',
    color: '#eaeaea',
    padding: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginBottom: 20,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: '#4d4d4d',
    fontWeight: 'bold',
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
  },
  courseContainerItem: {
    width: '97%',
    padding: 15,
    backgroundColor: '#fefefe',
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#2d2d2d',
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
    fontSize: 18,
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
    width: '90%',
    padding: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    borderWidth: 1,
    color: '#1d1d1d',
    borderColor: '#5d5d5d',
    borderRadius: 8,
    marginBottom: 20,
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

export default GradeSubmissionPerStudent;
