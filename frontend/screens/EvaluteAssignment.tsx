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
  Linking,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/FontAwesome';

type EvaluteAssignmentProps = NativeStackScreenProps<
  RootStackParamList,
  'EvaluteAssignment'
>;

const EvaluteAssignment = ({route}: EvaluteAssignmentProps) => {
  const {studentId, assignmentId, assignmentName, maxMarks, assignmentDescription, assignmentDueDate, url, dueDate, createdDate} = route.params;
  console.log('Student ID:', studentId);
  console.log('Assignment ID:', assignmentId);
  console.log('Assignment Name:', assignmentName);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [coursename, setCourseName] = React.useState('');
  const [credits, setCredits] = React.useState('');
  const [topicName, setTopicName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [topics, setTopics] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const [marks, setMarks] = React.useState(0);
  const [submission, setSubmission] = React.useState({});
  const [obtainedMarks, setObtainedMarks] = React.useState(0);
  const [isEvaluated, setIsEvaluated] = React.useState(false);

  const handleMarksChange = async (text: string) => {
    // marks should be between 0 and maxMarks
    if (parseInt(text) > maxMarks) {
      alert('Marks cannot exceed maximum marks');
      await setMarks(maxMarks.toString());
    } else if (parseInt(text) < 0) {
      alert('Marks cannot be negative');
      await setMarks('0');
    } else {
      await setMarks(text);
    }
    console.log('Marks:', marks);
  };

  const handleEvaluation = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://10.200.6.190:8080/evaluateAssignment`,
        {
          params: {
            studentId: studentId,
            assignmentId: assignmentId,
            marks: marks,
          },
        },
      );
      console.log('Response:', response.data);
      navigation.goBack(), navigation.replace('AssignmentSubmissionsFaculty', 
        {
          assignmentId: assignmentId,
          assignmentName: assignmentName,
          assignmentDescription: assignmentDescription,
          assignmentDueDate: assignmentDueDate,
          url: url,
          dueDate: dueDate,
          createdDate: createdDate,
          maxMarks: maxMarks,
        }
      );
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  const retrieveData = async () => {
    setLoading(true);
    try {
      const emailId = JSON.parse(await AsyncStorage.getItem('facultyEmail'));
      console.log('Email:', emailId);
      const response = await axios.get(
        `http://10.200.6.190:8080/getSubmissionFiles`,
        {
          params: {
            studentId: studentId,
            assignmentId: assignmentId,
          },
        },
      );
      await setSubmission(response.data);
      await setObtainedMarks(response.data.obtainedMarks);
      await setIsEvaluated(response.data.isEvaluated);
      console.log('Response:', response.data);
      await setFiles(response.data.submissionFiles);
      //   await setTopics(response.data);
      //   await setEmail(emailId);
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
          <Icon
            name="arrow-left-long"
            size={25}
            color="#2d2d2d"
            style={{marginRight: 10}}
          />
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
      <ScrollView style={{width: '100%'}}>
        <View style={styles.subContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{assignmentName}</Text>
          </View>
          <View style={styles.courseContainer}>
            <Text style={[styles.title, {marginBottom: 5}]}>Submissions</Text>
            <Text
              style={{
                color: '#7d7d7d',
                fontSize: 15,
                fontWeight: 'bold',
                marginBottom: 25,
              }}>
              {studentId}
            </Text>
            {loading ? (
              <ActivityIndicator size="large" color="#2d2d2d" />
            ) : (
              <View style={{flexDirection: 'column-reverse', width: '100%'}}>
                {files && loading === false && files.length > 0 ? (
                  <>
                    {files.map((file, index) => (
                      <Pressable
                        key={index}
                        onPress={() => {
                          Linking.openURL(file.fileDownloadUri);
                        }}
                        style={[
                          styles.notificationContainerItem,
                          {width: '90%'},
                        ]}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            paddingLeft: 10,
                          }}>
                          <Icon
                            name="file-pdf"
                            size={30}
                            color="#2d2d2d"
                            style={{
                              marginRight: 10,
                            }}
                          />
                          <View>
                            {/* <Text
                            style={styles.notificationContainerItemTextTitle}>
                            {file.fileName}
                          </Text> */}
                            <Text
                              style={styles.notificationContainerItemTextTitle}>
                              {file.fileName}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    ))}
                  </>
                ) : (
                  <Text
                    style={{
                      color: '#7d7d7d',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    No submissions yet
                  </Text>
                )}
              </View>
            )}
          </View>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginTop: 20,
            }}>
            <Text style={[styles.title, {marginBottom: 5, paddingLeft: 20}]}>
              Evaluation
            </Text>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingLeft: 20,
                textAlign: 'center',
              }}>
              <Text
                style={{color: '#7d7d7d', fontSize: 20, fontWeight: 'bold'}}>
                Marks:
              </Text>
              <TextInput
                style={[styles.input, {width: '40%'}]}
                placeholder="Enter grade"
                keyboardType="numeric"
                placeholderTextColor="#5d5d5d"
                onChangeText={text => handleMarksChange(text)}
                editable={!loading && !isEvaluated}
                defaultValue={obtainedMarks.toString()}
              />
              <Text
                style={{color: '#7d7d7d', fontSize: 20, fontWeight: 'bold'}}>
                {' '}
                /{maxMarks}
              </Text>
            </View>
            {!isEvaluated ? (
              <Pressable
                onPress={() => handleEvaluation()}
                style={[
                  styles.submitButton,
                  {
                    width: '50%',
                    marginLeft: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                {loading ? (
                  <ActivityIndicator size="small" color="#eaeaea" />
                ) : (
                  <Text style={{color: '#eaeaea', fontSize: 18}}>
                    Submit marks
                  </Text>
                )}
              </Pressable>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainerItem: {
    width: '89%',
    padding: 15,
    backgroundColor: '#fefefe',
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#9d9d9d',
    borderWidth: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    // marginLeft: 10,
  },
  notificationContainerItemIcon: {
    position: 'absolute',
    right: 15,
  },
  notificationContainerItemTextTitle: {
    color: '#2d2d2d',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationContainerItemText: {
    color: '#2d2d2d',
    fontSize: 15,
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    borderColor: '#1E63BB',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    marginBottom: 15,
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
    color: '#1E63BB',
    fontWeight: 'bold',
  },
  navigationBar: {
    width: '100%',
    paddingVertical: 20,
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
    // marginBottom: 20,
  },
  courseContainerTitle: {
    color: '#6d6d6d',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  courseContainerItem: {
    width: '97%',
    padding: 15,
    paddingVertical: 10,
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
    color: '#3d3d3d',
    fontSize: 17,
    fontWeight: 'bold',
  },
  courseContainerItemText: {
    color: '#3d3d3d',
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
    fontSize: 20,
    marginBottom: 24,
    color: '#6d6d6d',
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
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#2d2d2d',
    color: '#eaeaea',
    padding: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginBottom: 20,
    marginTop: 10,
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
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
});

export default EvaluteAssignment;
