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

type TokensProps = NativeStackScreenProps<RootStackParamList, 'Tokens'>;

const Tokens = ({route}: TokensProps) => {
  const {courseId, courseName, studentEmail, facultyEmail} = route.params;
  console.log('Course ID:', courseId);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [coursename, setCourseName] = React.useState('');
  const [credits, setCredits] = React.useState('');
  const [topicName, setTopicName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [tokens, setTokens] = React.useState([]);
  const [role, setRole] = React.useState('');

  const retrieveData = async () => {
    setLoading(true);
    try {
      const role = JSON.parse(await AsyncStorage.getItem('role'));
      setRole(role);
      let emailId = '';
      if (role === '2')
        emailId = JSON.parse(await AsyncStorage.getItem('email'));
      else if (role === '1')
        emailId = JSON.parse(await AsyncStorage.getItem('facultyEmail'));
      else emailId = JSON.parse(await AsyncStorage.getItem('taEmail'));
      console.log('Email:', emailId);
      let response = null;
      if(role === '2') {
        response = await axios.get(
          `http://10.200.6.190:8080/getTokens`,
          {
            params: {
              courseId: courseId,
              studentEmail: emailId,
            },
          },
        );
      } else {
        response = await axios.get(
          `http://10.200.6.190:8080/getAllTokensByCourse`,
          {
            params: {
              courseId: courseId,
            },
          },
        );
      }
      console.log('Response:', response.data);
      await setTokens(response.data);
      await setEmail(emailId);
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    retrieveData();
  }, []);

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
        </View>
      </View>
      <ScrollView style={{width: '100%'}}>
        <View style={styles.subContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{courseName}</Text>
          </View>
          <View style={styles.courseContainer}>
            {role === '2' ? (
              <Pressable
                onPress={() => {
                  navigation.push('RaiseAToken', {
                    courseId: courseId,
                    courseName: courseName,
                    studentEmail: email,
                    facultyEmail: facultyEmail,
                  });
                }}
                style={[
                  styles.courseContainerItem,
                  styles.shadowProp,
                  {paddingVertical: 12},
                ]}>
                <Text style={styles.courseContainerItemTextTitle}>
                  Raise a token
                </Text>
                <Icon
                  name="caret-right"
                  size={25}
                  color="#2d2d2d"
                  style={styles.courseContainerItemIcon}
                />
              </Pressable>
            ) : null}
            {role !== '2' ? (
              <Text style={styles.title}>Unresolved Tokens</Text>
            ) : (
              <Text style={styles.title}>Unresolved Tokens</Text>
            )}
            {loading ? (
              <ActivityIndicator size="large" color="#2d2d2d" />
            ) : (
              <View style={{flexDirection: 'column', width: '100%'}}>
                {tokens ? (
                  <>
                    {tokens.map((topic, index) => {
                      if (topic.isResolved === true) return;
                      return (
                        <Pressable
                          onPress={() => {
                            navigation.push('TokenChats', {
                              courseId: courseId,
                              courseName: courseName,
                              studentEmail: topic.email,
                              facultyEmail: facultyEmail,
                              id: topic.id,
                            });
                          }}
                          style={[
                            styles.courseContainerItem,
                            styles.shadowProp,
                          ]}
                          key={index}>
                          {role !== '2' ? (
                            <Text style={styles.courseContainerItemText}>
                              {topic.email}
                            </Text>
                          ) : null}
                          <Text style={styles.courseContainerItemTextTitle}>
                            {topic.title}
                          </Text>
                          <Text style={styles.courseContainerItemText}>
                            {topic.description}
                          </Text>
                          <Text style={styles.courseContainerItemText}>
                            {formatDateTime(topic.createdDateTime)}
                          </Text>
                          <Icon
                            name="caret-right"
                            size={25}
                            color="#2d2d2d"
                            style={styles.courseContainerItemIcon}
                          />
                        </Pressable>
                      );
                    })}
                  </>
                ) : (
                  <Text
                    style={{
                      color: '#2d2d2d',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    No tokens available
                  </Text>
                )}
              </View>
            )}
            {role !== '2' ? (
              <Text style={styles.title}>Resolved Tokens</Text>
            ) : (
              <Text style={styles.title}>Resolved Tokens</Text>
            )}
            {loading ? (
              <ActivityIndicator size="large" color="#2d2d2d" />
            ) : (
              <View style={{flexDirection: 'column-reverse', width: '100%'}}>
                {tokens ? (
                  <>
                    {tokens.map((topic, index) => {
                      if (topic.isResolved === false) return;
                      return (
                        <Pressable
                          onPress={() => {
                            navigation.push('TokenChats', {
                              courseId: courseId,
                              courseName: courseName,
                              studentEmail: topic.email,
                              facultyEmail: facultyEmail,
                              id: topic.id,
                            });
                          }}
                          style={[
                            styles.courseContainerItem,
                            styles.shadowProp,
                          ]}
                          key={index}>
                          {role !== '2' ? (
                            <Text style={styles.courseContainerItemText}>
                              {topic.email}
                            </Text>
                          ) : null}
                          <Text style={styles.courseContainerItemTextTitle}>
                            {topic.title}
                          </Text>
                          <Text style={styles.courseContainerItemText}>
                            {topic.description}
                          </Text>
                          <Text style={styles.courseContainerItemText}>
                            {formatDateTime(topic.createdDateTime)}
                          </Text>
                          <Icon
                            name="caret-right"
                            size={25}
                            color="#2d2d2d"
                            style={styles.courseContainerItemIcon}
                          />
                        </Pressable>
                      );
                    })}
                  </>
                ) : (
                  <Text
                    style={{
                      color: '#2d2d2d',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    No tokens available
                  </Text>
                )}
              </View>
            )}
          </View>
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

export default Tokens;
