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
  Modal,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/FontAwesome';

type CourseDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  'CourseDetails'
>;

const CourseDetails = ({route}: CourseDetailsProps) => {
  const {courseId, courseName} = route.params;
  const [modalVisible, setModalVisible] = React.useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [courseData, setCourseData] = React.useState({});
  const [role, setRole] = React.useState('');
  const [numOfStudents, setNumOfStudents] = React.useState(0);
  const [ended, setEnded] = React.useState(false);

  const retrieveData = async () => {
    setLoading(true);
    try {
      const role = JSON.parse(await AsyncStorage.getItem('role'));
      await setRole(role);
      let emailId = '';
      const response = await axios.get(`http://10.200.6.190:8080/getCourse`, {
        params: {
          Id: courseId,
        },
      });
      console.log('Response:', response.data);
      await setNumOfStudents(response.data.numOfStudents);
      if (response.data.ended !== null) {
        await setEnded(response.data.ended);
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

  const handleEndTheCourse = async () => {
    try {
      const response = await axios.post(
        `http://10.200.6.190:8080/endTheCourse?courseId=${courseId}`,
      );
      console.log('Response:', response.data);
      setModalVisible(false);
      retrieveData();
    } catch (e) {
      console.log('Error:', e);
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
          <Text style={styles.navigationText}>Course details</Text>
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
      <ScrollView
        style={{
          width: '100%',
        }}>
        <View style={styles.subContainer}>
          <View
            style={[
              styles.header,
              {
                marginBottom: 20,
                width: '90%',
                justifyContent: 'space-between',
                paddingVertical: 20,
                paddingHorizontal: 10,
                flexDirection: 'column',
                alignItems: 'flex-start',
              },
            ]}>
            {loading ? (
              <ActivityIndicator size="large" color="#2d2d2d" />
            ) : (
              <>
                <Text style={styles.headerTitle}>{courseName}</Text>
                <Text
                  style={[
                    styles.headerTitle,
                    {
                      fontSize: 17,
                      color: '#2d2d2d',
                      fontWeight: 'normal',
                    },
                  ]}>
                  Number of students: {numOfStudents}
                </Text>
              </>
            )}
          </View>
          <View style={styles.courseContainer}>
            <Text style={styles.courseContainerTitle}>
              {ended ? 'Manage Grades' : null}
            </Text>
            {role === '1' && ended ? (
              <Pressable
                style={styles.courseContainerItem}
                onPress={() => {
                  navigation.push('ListOfStudents', {
                    courseId: courseId,
                    courseName: courseName,
                  });
                }}>
                <Text style={styles.courseContainerItemTextTitle}>
                  Submit grades (Students)
                </Text>
                <Icon
                  name="caret-right"
                  size={25}
                  color="#2d2d2d"
                  style={styles.courseContainerItemIcon}
                />
              </Pressable>
            ) : null}
            {/* {role === '1' && ended ? (
              <Pressable style={styles.courseContainerItem} onPress={() => {}}>
                <Text style={styles.courseContainerItemTextTitle}>
                  Grade the TAs
                </Text>
                <Icon
                  name="caret-right"
                  size={25}
                  color="#2d2d2d"
                  style={styles.courseContainerItemIcon}
                />
              </Pressable>
            ) : null} */}
            <Text style={styles.courseContainerTitle}>
              {ended ? 'View Course' : 'Manage course'}
            </Text>
            {!ended ? (
              <>
                <Pressable
                  style={styles.courseContainerItem}
                  onPress={() => {
                    navigation.push('AddTopic', {
                      courseId: courseId,
                      courseName: courseName,
                    });
                  }}>
                  <Text style={styles.courseContainerItemTextTitle}>
                    Add a new topic
                  </Text>
                  <Icon
                    name="caret-right"
                    size={25}
                    color="#2d2d2d"
                    style={styles.courseContainerItemIcon}
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    navigation.push('AddVideo', {
                      courseId: courseId,
                      courseName: courseName,
                      topicId: null,
                      topicName: null,
                      topicDescription: null,
                      topicStartedDate: null,
                      topicAvailable: 1,
                    });
                  }}
                  style={styles.courseContainerItem}>
                  <Text style={styles.courseContainerItemTextTitle}>
                    Add a new Video to topic
                  </Text>
                  <Icon
                    name="caret-right"
                    size={25}
                    color="#2d2d2d"
                    style={styles.courseContainerItemIcon}
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    navigation.push('AddMaterial', {
                      courseId: courseId,
                      courseName: courseName,
                      topicId: null,
                      topicName: null,
                      topicDescription: null,
                      topicStartedDate: null,
                      topicAvailable: 1,
                    });
                  }}
                  style={styles.courseContainerItem}>
                  <Text style={styles.courseContainerItemTextTitle}>
                    Add a new material to topic
                  </Text>
                  <Icon
                    name="caret-right"
                    size={25}
                    color="#2d2d2d"
                    style={styles.courseContainerItemIcon}
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    navigation.push('AddAssignment', {
                      courseId: courseId,
                      courseName: courseName,
                      topicId: null,
                      topicName: null,
                      topicDescription: null,
                      topicStartedDate: null,
                      topicAvailable: 1,
                    });
                  }}
                  style={styles.courseContainerItem}>
                  <Text style={styles.courseContainerItemTextTitle}>
                    Add a new Assignments to topic
                  </Text>
                  <Icon
                    name="caret-right"
                    size={25}
                    color="#2d2d2d"
                    style={styles.courseContainerItemIcon}
                  />
                </Pressable>
              </>
            ) : null}
            <Pressable
              style={styles.courseContainerItem}
              onPress={() => {
                navigation.push('ViewTopics', {
                  courseId: courseId,
                  courseName: courseName,
                });
              }}>
              <Text style={styles.courseContainerItemTextTitle}>
                View Topics
              </Text>
              <Icon
                name="caret-right"
                size={25}
                color="#2d2d2d"
                style={styles.courseContainerItemIcon}
              />
            </Pressable>
            <Text style={styles.courseContainerTitle}>
              {ended ? 'View Tokens' : 'Manage Tokens'}
            </Text>
            <Pressable
              onPress={() => {
                navigation.push('Tokens', {
                  courseId: courseId,
                  courseName: courseName,
                });
              }}
              style={[
                styles.courseContainerItem,
                styles.shadowProp,
                {paddingVertical: 12},
              ]}>
              <Text style={styles.courseContainerItemTextTitle}>Tokens</Text>
              <Icon
                name="caret-right"
                size={25}
                color="#2d2d2d"
                style={styles.courseContainerItemIcon}
              />
            </Pressable>
            {role === '1' ? (
              <>
                <Text style={styles.courseContainerTitle}>Course details</Text>
                <Pressable
                  style={styles.courseContainerItem}
                  onPress={() => {
                    navigation.push('CourseDetailsEditOrView', {
                      courseId: courseId,
                      courseName: courseName,
                    });
                  }}>
                  <Text style={styles.courseContainerItemTextTitle}>
                    Edit or View course details
                  </Text>
                  <Icon
                    name="caret-right"
                    size={25}
                    color="#2d2d2d"
                    style={styles.courseContainerItemIcon}
                  />
                </Pressable>
                {role === '1' && !ended ? (
                  <Pressable
                    style={styles.courseContainerItem}
                    onPress={() => {
                      navigation.push('ListOfStudents', {
                        courseId: courseId,
                        courseName: courseName,
                      });
                    }}>
                    <Text style={styles.courseContainerItemTextTitle}>
                      List of students
                    </Text>
                    <Icon
                      name="caret-right"
                      size={25}
                      color="#2d2d2d"
                      style={styles.courseContainerItemIcon}
                    />
                  </Pressable>
                ) : null}
                {role === '1' && !ended ? (
                  <Pressable
                    style={styles.courseContainerItem}
                    onPress={() => {
                      setModalVisible(true);
                    }}>
                    <Text style={styles.courseContainerItemTextTitle}>
                      End the course
                    </Text>
                    <Icon
                      name="caret-right"
                      size={25}
                      color="#2d2d2d"
                      style={styles.courseContainerItemIcon}
                    />
                  </Pressable>
                ) : null}
              </>
            ) : null}
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={[
                styles.modalText,
                {
                  color: '#2d2d2d',
                  fontSize: 18,
                  fontWeight: 'bold',
                },
              ]}>
              Would you want to end the course?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%',
              }}>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  {
                    backgroundColor: 'transparent',
                    borderColor: '#2d2d2d',
                    borderWidth: 1,
                    elevation: 0,
                  },
                ]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      color: '#2d2d2d',
                    },
                  ]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  handleEndTheCourse();
                }}>
                <Text style={styles.textStyle}>End the course</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  headerTitle: {
    fontSize: 20,
    color: '#1E63BB',
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
    marginBottom: 10,
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2d2d2d',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
});

export default CourseDetails;
