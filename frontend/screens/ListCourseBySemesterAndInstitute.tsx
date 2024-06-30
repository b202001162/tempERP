import React from 'react';
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
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RadioButton} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Pressable} from 'react-native';

type ListCourseBySemesterAndInstituteProps = NativeStackScreenProps<
  RootStackParamList,
  'ListCourseBySemesterAndInstitute'
>;

const ListCourseBySemesterAndInstitute = ({route}: ListCourseBySemesterAndInstituteProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const {institute, semester} = route.params;
    console.log('Institute:', institute, 'Semester:', semester);
    
  const [email, setEmail] = React.useState('');
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState('2');

  const retrieveData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://10.200.6.190:8080/getCoursesBySemester`, {
        params: {
          instituteName: institute,
          semester: semester,
        },
      });
      console.log('Response:', response.data);
      await setCourses(response.data);
    } catch (e) {
      console.log('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    retrieveData();
  }, []);


  const CourseItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={()=>
          {
            navigation.navigate('EditCourseForAdmin', {
              courseId: item.id,
              courseName: item.name,
              sem: item.semester,
            });
          
          }
        }
        style={[styles.profileDetailsCard, styles.elevation]}>
        <Text
          style={[
            styles.detailValueItem,
            {fontWeight: 'bold', paddingLeft: 0, marginTop: 10, fontSize: 20},
          ]}>
          {item.name}
        </Text>
        <View style={styles.separator}></View>
        <Text style={styles.detailKeyItem}>
          Credits:{' '}
          <Text
            style={[
              styles.detailValueItem,
              {fontWeight: 'regular', fontSize: 16, color: '#4d4d4d'},
            ]}>
            {item.credits}
          </Text>
        </Text>
        <View style={styles.separator}></View>
      </TouchableOpacity>
    );
  };

  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 45);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 45],
    outputRange: [0, -45],
  });

  return (
    <>
      <Animated.View
        style={{
          transform: [{translateY: translateY}],
          elevation: 4,
          zIndex: 100,
        }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle} onPress={() => {}}>
            Explore Courses
          </Text>
        </View>
      </Animated.View>
      <View style={styles.container}>
        <ScrollView
          style={{flex: 1, width: '100%'}}
          onScroll={e => {
            scrollY.setValue(e.nativeEvent.contentOffset.y);
          }}>
          <View style={styles.subContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#2d2d2d" />
            ) : (
              <View style={styles.profileInformation}>
                {courses.map((item, index) => {
                  key = item.id;
                  return <CourseItem key={key} item={item} />;
                })}
              </View>
            )}
          </View>
        </ScrollView>
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
    paddingTop: 10,
    width: '100%',
    paddingBottom: 80,
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
});

export default ListCourseBySemesterAndInstitute;
