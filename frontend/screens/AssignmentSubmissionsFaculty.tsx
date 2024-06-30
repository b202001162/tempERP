import React from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Linking,
  FlatList,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import Icon from 'react-native-vector-icons/FontAwesome6';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
type AssignmentSubmissionsFacultyProps = NativeStackScreenProps<
  RootStackParamList,
  'AssignmentSubmissionsFaculty'
>;
import DocumentPicker from 'react-native-document-picker';

const AssignmentSubmissionsFaculty = ({
  route,
}: AssignmentSubmissionsFacultyProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    assignmentId,
    assignmentName,
    assignmentDescription,
    assignmentDueDate,
    url,
    dueDate,
    createdDate,
    maxMarks,
  } = route.params;
  const [role, setRole] = React.useState('2');
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [notificationData, setNotificationData] = React.useState([]);
  const [type, setType] = React.useState(0);
  const [singleFile, setSingleFile] = React.useState(null);
  const [files, setFiles] = React.useState([]);
  const [submissions, setSubmissions] = React.useState([]);
  // 1 for general notification
  // const [emailError, setEmailError] = React.useState(false);

  const retriveData = async () => {
    setLoading(true);
    const role = await JSON.parse(await AsyncStorage.getItem('role'));
    setRole(role);
    let emailId = '';
    if (role === '1') {
      emailId = await JSON.parse(await AsyncStorage.getItem('facultyEmail'));
    } else if (role === '0') {
      emailId = await JSON.parse(await AsyncStorage.getItem('taEmail'));
    } else {
      emailId = await JSON.parse(await AsyncStorage.getItem('email'));
    }
    // const email = await JSON.parse(await AsyncStorage.getItem('email'));
    setEmail(emailId);
    try {
      const response = await axios.get(
        `http://10.200.6.190:8080/getSubmissionsByAssignmentId?assignmentId=${assignmentId}`,
      );
      console.log('Response:', response.data);
      await setSubmissions(response.data);
      let temp = [];
      for (let i = 0; i < response.data.length; i++) {
        for (let j = 0; j < response.data[i].submissionFiles.length; j++) {
          temp.push(response.data[i].submissionFiles[j]);
          temp[temp.length - 1].studentId = response.data[i].studentId;
        }
      }
      setFiles(temp);
      console.log('Files:', temp);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    retriveData();
  }, []);

  const makeMessageTrimmed = message => {
    if (message.length > 50) {
      return message.substring(0, 50) + '...';
    }
    return message;
  };

  const formatDate = formattedDate => {
    try {
      const date = new Date(formattedDate);
      const options = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      //   date.toLocaleTimeString('en-US', options);
      // date.toLocaleDateString('en-GB', options)
      return date.toLocaleTimeString('en-GB', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      // You can return a default value or handle the error differently here
      return null; // Or any placeholder value you prefer
    }
  };

  const formatTimeOnly = formattedDate => {
    try {
      const date = new Date(formattedDate);
      const options = {
        hour: '2-digit',
        minute: '2-digit',
      };
      return date.toLocaleTimeString('en-GB', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  const formatDateOnly = formattedDate => {
    try {
      const date = new Date(formattedDate);
      const options = {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      };
      return date.toLocaleDateString('en-GB', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  const selectFile = async () => {
    // Opening Document Picker to select one file
    setLoading(true);
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.pdf],
        // There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });

      await setSingleFile(res);
      console.log('Single File', res);

      // Set a loading state (optional)
    } catch (err) {
      setSingleFile(null);
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        alert('Canceled');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = dateTimeString => {
    if (!dateTimeString) return null; // Handle empty string

    try {
      // Parse the date time string using Date object
      const dateObj = new Date(dateTimeString);

      // Extract components for formatting
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
      const year = dateObj.getFullYear();

      // Format the time portion
      const hour = dateObj.getHours();
      const minute = dateObj.getMinutes().toString().padStart(2, '0');

      // Handle 12-hour clock format and meridiem
      let formattedHour = hour === 0 ? 12 : hour % 12; // Handle midnight as 12
      const meridiem = hour >= 12 ? 'pm' : 'am';
      if (hour == 12) formattedHour = 12;
      if (formattedHour < 10) formattedHour = '0' + formattedHour;
      // Return the formatted date time string
      return `${day}-${month}-${year} ${formattedHour}:${minute} ${meridiem}`;
    } catch (error) {
      console.error('Error formatting date time string:', error);
      return null; // Handle parsing errors
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text>AssignmentSubmissionsFaculty</Text> */}
      <View style={styles.navigationBar}>
        <Text style={styles.title}>Assignment Submission</Text>
      </View>
      <View style={styles.subContainer}>
        <ScrollView style={{width: '100%'}}>
          {loading ? (
            <ActivityIndicator size="large" color="#2d2d2d" />
          ) : (
            <View style={[styles.assingmentDetailsContainer]}>
              <View
                style={[
                  styles.notificationContainerItem,
                  {backgroundColor: 'transparent', borderWidth: 0},
                ]}>
                <Text style={styles.notificationContainerItemTextTitle}>
                  {assignmentName}
                </Text>
                <Text style={styles.notificationContainerItemText}>
                  Uploaded Time:{' '}
                  <Text
                    style={{
                      color: '#1d1d1d',
                      fontWeight: 'bold',
                    }}>
                    {createdDate}
                  </Text>
                </Text>
                <Text style={styles.notificationContainerItemText}>
                  Due date:{' '}
                  <Text
                    style={{
                      color:
                        new Date(assignmentDueDate) < new Date()
                          ? 'red'
                          : 'green',
                      fontWeight: 'bold',
                    }}>
                    {formatDateTime(assignmentDueDate)}
                  </Text>
                </Text>
                <Text style={styles.notificationContainerItemText}>
                  Max marks:{' '}
                  <Text
                    style={{
                      fontWeight: 'bold',
                    }}>
                    {maxMarks}
                  </Text>
                </Text>
                <Text
                  style={[
                    styles.notificationContainerItemText,
                    {
                      color: '#2d2d2d',
                      fontSize: 15,
                      fontWeight: 'bold',
                      marginTop: 2,
                    },
                  ]}>
                  {assignmentDescription}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => Linking.openURL(url)}
                style={[styles.notificationContainerItem, {width: '60%'}]}>
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
                  <Text style={styles.notificationContainerItemTextTitle}>
                    {assignmentName}
                  </Text>
                </View>
              </TouchableOpacity>
              {/* Horizantal Line */}
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: '#2d2d2d',
                  marginVertical: 10,
                }}
              />
              {submissions && loading === false && files.length > 0 ? (
                <>
                  {submissions.map((file, index) => (
                    <Pressable
                      key={index}
                      onPress={() => {
                        navigation.push('EvaluteAssignment', {
                          studentId: file.studentId,
                          assignmentId: assignmentId,
                          assignmentName: assignmentName,
                          maxMarks: maxMarks,
                          assignmentDescription: assignmentDescription,
                          assignmentDueDate: assignmentDueDate,
                          url: url,
                          dueDate: dueDate,
                          createdDate: createdDate,
                        });
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
                            {file.studentId}
                          </Text>
                          {file.isEvaluated ? (
                            <Text
                              style={[
                                styles.notificationContainerItemText,
                                {
                                  color: 'green',
                                  fontWeight: 'bold',
                                },
                              ]}>
                              Evaluated
                            </Text>
                          ) : (
                            <Text
                              style={[
                                styles.notificationContainerItemText,
                                {
                                  color: 'orange',
                                  fontWeight: 'bold',
                                },
                              ]}>
                              Not Evaluated
                            </Text>
                          )}
                        </View>
                        <Icon
                          name="caret-right"
                          size={25}
                          color="#2d2d2d"
                          style={styles.courseContainerItemIcon}
                        />
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
        </ScrollView>
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
  requestButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  requestButtonAccept: {
    borderColor: '#1E63BB',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  requestButtonReject: {
    borderColor: '#FF3E3E',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  assingmentDetailsContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 15,
    // backgroundColor: '#fefefe',
    borderRadius: 8,
    marginBottom: 20,
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
    paddingTop: 0,
    width: '100%',
  },
  notificationContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 15,
    // backgroundColor: '#fefefe',
    borderRadius: 8,
    marginBottom: 20,
  },
  notificationContainerTitle: {
    color: '#6d6d6d',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
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
    fontSize: 22,
    marginBottom: 10,
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
  courseContainerItemIcon: {
    position: 'absolute',
    right: 15,
  },
});

export default AssignmentSubmissionsFaculty;
