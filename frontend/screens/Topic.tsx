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
import Icon3 from 'react-native-vector-icons/FontAwesome5';

import YoutubePlayer from 'react-native-youtube-iframe';

type ViewTopicsProps = NativeStackScreenProps<RootStackParamList, 'ViewTopics'>;

const ViewTopics = ({route}: ViewTopicsProps) => {
  const {
    courseId,
    courseName,
    topicId,
    topicName,
    topicDescription,
    topicStartedDate,
  } = route.params;
  console.log('Course ID:', courseId);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [topicData, setTopicData] = React.useState({});
  const [videos, setVideos] = React.useState([]);
  const [
    videoPlayerContainerVisibleArray,
    setVideoPlayerContainerVisibleArray,
  ] = React.useState([]);
  const [materials, setMaterails] = React.useState([]);
  const [assignments, setAssignments] = React.useState([]);
  const [role, setRole] = React.useState('');

  const retrieveData = async () => {
    setLoading(true);
    try {
      const role = JSON.parse(await AsyncStorage.getItem('role'));
      await setRole(role);
      const emailId = JSON.parse(await AsyncStorage.getItem('facultyEmail'));
      console.log('Email:', emailId);
      const response = await axios.get(`http://10.200.6.190:8080/getTopic`, {
        params: {
          Id: topicId,
        },
      });
      console.log('Response:', response.data);
      await setTopicData(response.data);
      await setEmail(emailId);
      await setVideos(response.data.videos);
      await setMaterails(response.data.materials);
      await setAssignments(response.data.assignments);
      let temp = new Object();
      if (response.data.videos)
        for (let i = 0; i < response.data.videos.length; i++) {
          temp[response.data.videos[i].id] = false;
        }
      console.log('Temp:', temp);
      await setVideoPlayerContainerVisibleArray(temp);
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    retrieveData();
  }, []);

  const onlyDate = (dateString: string) => {
    const year = dateString.substring(0, 4);
    const month = parseInt(dateString.substring(5, 7)) - 1; // Adjust for zero-based month indexing
    const day = dateString.substring(8, 10);

    const formattedDate =
      (day.length === 1 ? '0' + day : day) +
      '/' +
      (month.toString().length === 1 ? '0' + (month + 1) : month + 1) +
      '/' +
      year.substring(4, 0);
    return formattedDate;
  };

  const extractYoutubeVideoId = url => {
    // Regex to match YouTube video URLs with or without query parameters
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=)?([\w-]{11})/;
    const match = url.match(youtubeRegex);

    // Return the video ID if found, otherwise return an empty string
    return match ? match[1] : '';
  };

  const [playing, setPlaying] = React.useState(false);

  const onStateChange = React.useCallback(state => {
    if (state === 'loading') {
      console.log('loading');
    }

    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const setVideoPlayerContainerVisible = async (id: string) => {
    setVideoPlayerContainerVisibleArray(prevArray => ({
      ...prevArray,
      [id]: !prevArray[id],
    }));
  };

  const onPlaybackQualityChange = React.useCallback(quality => {
    console.log('Quality:', quality);
  }, []);

  const togglePlaying = React.useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return null; // Handle empty string
  
    try {
      // Parse the date string using Date object
      const dateObj = new Date(dateString);
  
      // Extract components for formatting
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
      const year = dateObj.getFullYear();
  
      // Return the formatted date string
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date string:', error);
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
            <Text style={styles.headerTitle}>{courseName}</Text>
            <View
              style={{
                width: '95%',
                borderBottomWidth: 1,
                borderColor: '#9d9d9d',
                marginLeft: 7,
                marginTop: 5,
                marginBottom: 5,
              }}></View>
            <Text style={styles.headerText}>{topicName}</Text>
            <Text
              style={[
                styles.headerText,
                {color: '#6d6d6d', fontWeight: 'semibold'},
              ]}>
              {topicDescription}
            </Text>
            <Text
              style={[
                styles.headerText,
                {color: '#6d6d6d', fontWeight: 'semibold'},
              ]}>
              Created since {onlyDate(topicStartedDate)}
            </Text>
          </View>
          <View style={styles.courseContainer}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.title}>Video lectures</Text>
              {role !== '2' ? (
                <Pressable
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => {
                    navigation.push('AddVideo', {
                      courseId: courseId,
                      courseName: courseName,
                      topicId: topicId,
                      topicName: topicName,
                      topicDescription: topicDescription,
                      topicStartedDate: topicStartedDate,
                      topicAvailable: 0,
                    });
                  }}>
                  <Icon3
                    name="plus"
                    size={15}
                    color="#4d4d4d"
                    style={{marginRight: 5}}
                  />
                  <Text
                    style={{
                      color: '#4d4d4d',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    Add Video
                  </Text>
                </Pressable>
              ) : null}
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#2d2d2d" />
            ) : (
              <>
                {videos ? (
                  <>
                    {videos.map((video: any) => {
                      return (
                        <View style={styles.courseContainerItem} key={video.id}>
                          <Pressable
                            style={{width: '100%'}}
                            onPress={() => {
                              setVideoPlayerContainerVisible(video.id);
                            }}>
                            <Text style={styles.courseContainerItemTextTitle}>
                              {video.name}
                            </Text>
                            <Text style={styles.courseContainerItemText}>
                              {video.description}
                            </Text>
                          </Pressable>
                          <Icon3
                            name="play-circle"
                            size={30}
                            color="#2d2d2d"
                            style={styles.courseContainerItemIcon}
                          />
                          {videoPlayerContainerVisibleArray[video.id] ? (
                            <View style={styles.videoPlayerContainer}>
                              <YoutubePlayer
                                height={175}
                                play={playing}
                                videoId={extractYoutubeVideoId(video.url)}
                                onChangeState={onStateChange}
                              />
                            </View>
                          ) : null}
                        </View>
                      );
                    })}
                  </>
                ) : (
                  <Text
                    style={{
                      color: '#6d6d6d',
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginTop: 10,
                      marginBottom: 10,
                    }}>
                    No videos available
                  </Text>
                )}
              </>
            )}
            {/* horizontal rule */}
            <View
              style={{
                width: '100%',
                borderBottomWidth: 1,
                borderColor: '#9d9d9d',
                marginLeft: 0,
                marginTop: 5,
                marginBottom: 15,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.title}>Materials</Text>
              {loading === false && role !== '2' ? (
                <Pressable
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => {
                    navigation.push('AddMaterial', {
                      courseId: courseId,
                      courseName: courseName,
                      topicId: topicId,
                      topicName: topicName,
                      topicDescription: topicDescription,
                      topicStartedDate: topicStartedDate,
                      topicAvailable: 0,
                    });
                  }}>
                  <Icon3
                    name="plus"
                    size={15}
                    color="#4d4d4d"
                    style={{marginRight: 5}}
                  />
                  <Text
                    style={{
                      color: '#4d4d4d',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    Add Material
                  </Text>
                </Pressable>
              ) : null}
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#2d2d2d" />
            ) : (
              <>
                {materials ? (
                  <>
                    {materials.map((material: any) => {
                      return (
                        <Pressable
                          style={styles.courseContainerItem}
                          key={material.id}
                          onPress={() => {
                            Linking.openURL(material.url);
                          }}>
                          <Text style={styles.courseContainerItemTextTitle}>
                            {material.name}
                          </Text>
                          <Text style={styles.courseContainerItemText}>
                            {material.description}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </>
                ) : (
                  <Text
                    style={{
                      color: '#6d6d6d',
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginTop: 10,
                      marginBottom: 10,
                    }}>
                    No materials available
                  </Text>
                )}
              </>
            )}
            <View
              style={{
                width: '100%',
                borderBottomWidth: 1,
                borderColor: '#9d9d9d',
                marginLeft: 0,
                marginTop: 5,
                marginBottom: 15,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.title}>Assignments</Text>
              {loading === false && role !== '2' ? (
                <Pressable
                  onPress={() => {
                    navigation.push('AddAssignment', {
                      courseId: courseId,
                      courseName: courseName,
                      topicId: topicId,
                      topicName: topicName,
                      topicDescription: topicDescription,
                      topicStartedDate: topicStartedDate,
                      topicAvailable: 0,
                    });
                  }}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon3
                    name="plus"
                    size={15}
                    color="#4d4d4d"
                    style={{marginRight: 5}}
                  />
                  <Text
                    style={{
                      color: '#4d4d4d',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    Add Assignment
                  </Text>
                </Pressable>
              ) : null}
            </View>
            {assignments ? (
              <>
                {assignments.map((assignment: any) => {
                  return (
                    <Pressable
                      onPress={() => {
                        role === '2'
                          ? navigation.push('AssignmentSubmission', {
                              assignmentId: assignment.id,
                              assignmentName: assignment.name,
                              assignmentDescription: assignment.description,
                              assignmentDueDate: assignment.dueDate,
                              url: assignment.url,
                              createdDate: formatDate(assignment.createdDate) + "  " + assignment.createdTime,
                              maxMarks: assignment.maxMarks,
                            })
                          : navigation.push('AssignmentSubmissionsFaculty', {
                              assignmentId: assignment.id,
                              assignmentName: assignment.name,
                              assignmentDescription: assignment.description,
                              assignmentDueDate: assignment.dueDate,
                              url: assignment.url,
                              createdDate: formatDate(assignment.createdDate) + "  " + assignment.createdTime,
                              maxMarks: assignment.maxMarks,
                            });
                      }}
                      style={styles.courseContainerItem}
                      key={assignment.id}>
                      <Text style={styles.courseContainerItemTextTitle}>
                        {assignment.name}
                      </Text>
                      <Text style={styles.courseContainerItemText}>
                        {assignment.description}
                      </Text>
                    </Pressable>
                  );
                })}
              </>
            ) : (
              <Text
                style={{
                  color: '#6d6d6d',
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginTop: 10,
                }}>
                No assignments available
              </Text>
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
    flexDirection: 'column',
    alignItems: 'flex-start',
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
    paddingLeft: 10,
  },
  headerText: {
    fontSize: 16,
    color: '#4d4d4d',
    fontWeight: 'bold',
    paddingLeft: 10,
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
  videoPlayerContainer: {
    width: '100%',
    backgroundColor: '#fefefe',
    borderRadius: 8,
    marginBottom: 10,
    animation: 'fadeIn 0.5s',
    paddingVertical: 15,
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

export default ViewTopics;
