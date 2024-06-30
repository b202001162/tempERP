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
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/FontAwesome';

type CourseDetailsEditOrViewProps = NativeStackScreenProps<
  RootStackParamList,
  'CourseDetailsEditOrView'
>;

const CourseDetailsEditOrView = ({route}: CourseDetailsEditOrViewProps) => {
  const {courseId, courseName} = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [courseData, setCourseData] = React.useState({});
  const [isEdit, setIsEdit] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [coursename, setCourseName] = React.useState('');
  const [credits, setCredits] = React.useState('');

  const retrieveData = async () => {
    setLoading(true);
    try {
      const emailId = JSON.parse(await AsyncStorage.getItem('email'));
      console.log('Email:', emailId);
      const response = await axios.get(`http://10.200.6.190:8080/getCourse`, {
        params: {
          Id: courseId,
        },
      });
      console.log('Response:', response.data);
      await setCourseData(response.data);
      await setDescription(response.data.description);
      await setCredits(response.data.credits);
      await setCourseName(courseName);
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
        `http://10.200.6.190:8080/editCourseDetails`,
        {
          id: courseId,
          name: coursename,
          description: description,
          credits: credits,
        },
      );
      console.log('Response:', response.data);
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
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
          <Text style={styles.navigationText}>Edit Course details</Text>
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
            <Text style={styles.headerTitle}>{courseName}</Text>
          )}
        </View>
        <View style={styles.courseContainer}>
          <Pressable
            style={styles.editButton}
            onPress={() => setIsEdit(!isEdit)}>
            {isEdit ? <Text>Cancle edit</Text> : <Text>Edit details</Text>}
          </Pressable>
          {loading ? (
            <ActivityIndicator size="large" color="#2d2d2d" />
          ) : (
            <>
              <Text style={styles.courseContainerTitle}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Course Name"
                onChangeText={text => setCourseName(text)}
                placeholderTextColor="#3d3d3d"
                defaultValue={coursename}
                editable={isEdit}
              />
              <Text style={styles.courseContainerTitle}>Description</Text>
              <TextInput
                style={[styles.input, {marginBottom: 0}]}
                placeholder="Enter Course Description"
                onChangeText={text => setCourseDescription(text)}
                placeholderTextColor="#4d4d4d"
                multiline={true}
                maxLength={1000}
                defaultValue={description}
                editable={isEdit}
              />
              <Text
                style={[
                  styles.courseContainerTitle,
                  {
                    color: '#5d5d5d',
                    fontWeight: 'regular',
                    marginBottom: 10,
                    fontSize: 12,
                    marginLeft: 15,
                  },
                ]}>
                * Limit 1000 characters{' '}
              </Text>
              <Text style={styles.courseContainerTitle}>Credits</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Credits"
                onChangeText={text => setCredits(text)}
                placeholderTextColor="#4d4d4d"
                keyboardType="numeric"
                defaultValue={credits.toString()}
                editable={isEdit}
              />
            </>
          )}
        </View>
        {isEdit ? (
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
        ) : null}
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
    flexDirection: 'row',
    alignItems: 'center',
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

export default CourseDetailsEditOrView;
