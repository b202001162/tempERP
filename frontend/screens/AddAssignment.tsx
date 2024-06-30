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
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from 'react-native-date-picker';

type AddAssignmentProps = NativeStackScreenProps<
  RootStackParamList,
  'AddAssignment'
>;

const AddAssignment = ({route}: AddAssignmentProps) => {
  const {
    courseId,
    courseName,
    topicId,
    topicName,
    topicDescription,
    topicStartedDate,
    topicAvailable,
  } = route.params;
  console.log('Course ID:', courseId);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [maxMarks, setMaxMarks] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [AssignmentName, setAssignmentName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [URL, setURL] = React.useState('');
  const [topics, setTopics] = React.useState([]);
  const [topicid, setTopicId] = React.useState('');
  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);

  const retrieveData = async () => {
    await setTopicId(topicId);
    console.log('Topic ID:', topicId);
    setLoading(true);
    try {
      const emailId = JSON.parse(await AsyncStorage.getItem('email'));
      console.log('Email:', emailId);
      const response = await axios.get(`http://10.200.6.190:8080/getTopics`, {
        params: {
          Id: courseId,
        },
      });
      console.log('Response:', response.data);
      await setTopics(response.data);
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

  const handleSubmit = async () => {
    if (topicAvailable === 1 && topicid === '') {
      alert('Please select a topic');
      return;
    }
    if (AssignmentName === '') {
      alert('Please enter a video name');
      return;
    }
    if (maxMarks === 0) {
      alert('Please enter maximum marks');
      return;
    }
    if (description === '') {
      alert('Please enter a description');
      return;
    }
    if (URL === '') {
      alert('Please enter a URL');
      return;
    }
    if (!isPossiblyGoogleDriveURL(URL)) {
      alert('Please enter a valid google drive URL');
      return;
    }
    setLoading(true);
    console.log('All good');
    const response = await axios.post(
      `http://10.200.6.190:8080/addAssignment`,
      {
        courseId: courseId,
        topicId: topicid,
        name: AssignmentName,
        description: description,
        url: URL,
        dueDate: date,
        maxMarks: maxMarks,
      },
    );
    console.log('Response:', response.data);
    if (topicAvailable === 0) {
      navigation.pop(),
        navigation.replace('Topic', {
          courseId: courseId,
          courseName: courseName,
          topicId: topicid,
          topicName: topicName,
          topicDescription: topicDescription,
          topicStartedDate: topicStartedDate,
        });
    } else {
      navigation.pop(),
        navigation.replace('CourseDetails', {
          courseId: courseId,
          courseName: courseName,
        });
    }
    try {
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  const isPossiblyGoogleDriveURL = url => {
    const driveUrlPatterns = [
      'https://drive.google.com/file/d/', // Public file with ID
      'https://docs.google.com/spreadsheets/d/', // Public spreadsheet with ID
      'https://docs.google.com/document/d/', // Public document with ID
    ];

    for (const pattern of driveUrlPatterns) {
      if (url.startsWith(pattern)) {
        return true;
      }
    }

    return false;
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
          </View>
          <View style={styles.courseContainer}>
            <Text style={styles.title}>Add a new assignment</Text>

            <>
              {topicAvailable === 1 ? (
                <>
                  <Text style={styles.courseContainerTitle}>Topic Name</Text>
                  <SelectDropdown
                    data={topics}
                    onSelect={(selectedItem, index) => {
                      console.log(selectedItem, index);
                      setTopicId(selectedItem.id);
                    }}
                    renderButton={(selectedItem, isOpened) => {
                      return (
                        <View style={styles.dropdownButtonStyle}>
                          <Text style={styles.dropdownButtonTxtStyle}>
                            {(selectedItem && selectedItem.name) ||
                              'Select a topic*'}
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
              <Text style={styles.courseContainerTitle}>Assignment title*</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Assignment Title"
                onChangeText={text => setAssignmentName(text)}
                placeholderTextColor="#3d3d3d"
              />
              <Text style={styles.courseContainerTitle}>Maximum marks*</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter marks"
                onChangeText={text => setMaxMarks(text)}
                placeholderTextColor="#3d3d3d"
              />
              <Text style={styles.courseContainerTitle}>Description*</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter description"
                onChangeText={text => setDescription(text)}
                placeholderTextColor="#3d3d3d"
                multiline={true}
                // numberOfLines={4}
                maxLength={500}
              />
              <Text style={styles.courseContainerTitle}>Google drive URL*</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter URL"
                onChangeText={text => setURL(text)}
                placeholderTextColor="#3d3d3d"
                multiline={true}
              />
              <View
                style={{
                  width: '100%',
                  // padding: 10,
                  // paddingHorizontal: 15,
                  // marginLeft: 10,
                  // marginBottom: 15,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <Text style={styles.courseContainerTitle}>Due date*</Text>
                <Pressable
                  style={[
                    styles.submitButton,
                    {
                      borderColor: '#2d2d2d',
                      borderWidth: 1,
                      backgroundColor: 'transparent',
                      marginLeft: 10,
                      paddingHorizontal: 15,
                      borderRadius: 8,
                    },
                  ]}
                  onPress={() => setOpen(true)}>
                  <Text style={{color: '#2d2d2d'}}>Set due time</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.input}
                onPress={() => {
                  setOpen(true);
                  console.log(date.toString());
                }}>
                <Text style={{color: '#2d2d2d'}}>
                  {formatDateTime(date.toString())}
                </Text>
              </Pressable>
            </>
          </View>
          <DatePicker
            modal
            title="Due date"
            open={open}
            date={date}
            minuteInterval={15}
            minimumDate={new Date()}
            onConfirm={date => {
              setOpen(false);
              setDate(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
            is24hourSource="locale"
          />
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
    fontSize: 22,
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

export default AddAssignment;
