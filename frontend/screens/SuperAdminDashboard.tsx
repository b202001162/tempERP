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
import Ionicons from 'react-native-vector-icons/Ionicons';

type SuperAdminDashboardProps = NativeStackScreenProps<
  RootStackParamList,
  'SuperAdminDashboard'
>;

const SuperAdminDashboard = ({route}: SuperAdminDashboardProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState('3');
  const [adminData, setAdminData] = React.useState({});
  const [currentCourses, setCurrentCourses] = React.useState([]);

  const retrieveData = async () => {
    setLoading(true);
    try {
      // const emailId = JSON.parse(await AsyncStorage.getItem('email'));

      const emailId = JSON.parse(await AsyncStorage.getItem('superAdminEmail'));
      if (emailId === null) {
        await AsyncStorage.clear();
        navigation.replace('AdminLogin');
      }
      console.log('Email:', emailId);
      const response = await axios.get(
        `http://10.200.6.190:8080/getSuperAdmin`,
        {
          params: {
            email: emailId,
          },
        },
      );
      console.log('Response:', response.data);
      await setEmail(emailId);
      await setAdminData(response.data);
      //   if (response.data.courses !== null)
      //     await setCurrentCourses(response.data.courses);
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
          {/* <Icon
            name="arrow-left-long"
            size={25}
            color="#2d2d2d"
            style={{marginRight: 10}}
          />
          <Text style={styles.navigationText}>Faculty Dashboard</Text> */}
        </View>
        <View style={styles.navigationIcons}>
          <Icon
            name="bell"
            size={23}
            color="#2d2d2d"
            style={{marginRight: 5}}
            onPress={() => {
              navigation.push('Notifications');
            }}
          />
        </View>
      </View>
      <ScrollView style={{width: '100%'}}>
        <View style={styles.subContainer}>
          <View style={{width: '100%', paddingLeft: 15}}>
            <Text style={styles.title}>Welcome, {adminData.name}</Text>
          </View>
          <View style={styles.courseContainer}>
            <Text style={styles.courseContainerTitle}>Details</Text>
            <View
              style={[
                styles.courseContainerItem,
                {
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                },
              ]}>
              <Text style={styles.courseContainerItemText}>
                Institute Admins: {adminData.numberOfInstituteAdmins}
              </Text>
              <Text style={styles.courseContainerItemText}>
                Faculties: {adminData.numberOfFaculties}
              </Text>
              <Text style={styles.courseContainerItemText}>
                TAs: {adminData.numberOfTAs}
              </Text>
            </View>
            <Text style={styles.courseContainerTitle}>Manage</Text>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.push('ListOfAllInstituteAdmins');
                }}
                style={[
                  styles.courseContainerItem,
                  {
                    backgroundColor: '#fefefe',
                    borderColor: '#9d9d9d',
                    borderWidth: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  },
                ]}>
                <Text style={styles.courseContainerItemTextTitle}>Institute Admins</Text>
                <Icon
                  name="caret-right"
                  size={20}
                  color="#2d2d2d"
                  style={styles.courseContainerItemIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.courseContainerTitle}>Other Options</Text>
            <TouchableOpacity
              style={[
                styles.courseContainerItem,
                {
                  backgroundColor: '#fefefe',
                  borderColor: 'red',
                  borderWidth: 1,
                  justifyContent: 'flex-start',
                },
              ]}
              onPress={async () => {
                await AsyncStorage.clear();
                navigation.replace('AdminLogin');
              }}>
                <Icon2
                name="sign-out"
                size={22}
                color="#2d2d2d"
                style={[
                  styles.courseContainerItemIcon,
                  {
                    position: 'relative',
                    right: 0,
                    marginRight: 10,
                    transform: [{rotate: '180deg'}],
                    color: 'red',
                  },
                ]}
              />
              <Text style={[styles.courseContainerItemTextTitle, {color: 'red', fontSize: 18}]}>LOGOUT</Text>
            </TouchableOpacity>
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
    backgroundColor: '#4d4d4d',
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#9d9d9d',
    borderWidth: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
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
    color: '#eaeaea',
    fontSize: 20,
  },
  createNewCourseButtonContainer: {
    position: 'absolute',
    bottom: 115,
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
  elevation: {
    elevation: 10,
    shadowColor: '#1d1d1de0',
  },
});

export default SuperAdminDashboard;
