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
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
type NotificationDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  'NotificationDetails'
>;

const NotificationDetails = ({route}: NotificationDetailsProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const {notificationId, notificationTitle, notificationMessage, notificationDate} = route.params;
  const [role, setRole] = React.useState('2');
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [notificationData, setNotificationData] = React.useState({});
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
        const response = await axios.get(`http://10.200.6.190:8080/getNotificationById?id=${notificationId}`);
        console.log(response.data);
        await setNotificationData(response.data);
    } catch (error) {
        console.error(error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    retriveData();
  }, []);

  const formatDate = (formattedDate) => {
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

  return (
    <View style={styles.container}>
      {/* <Text>Notifications</Text> */}
      <View style={styles.navigationBar}>
        {/* <Text style={styles.title}>Notification details</Text> */}
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.title} >
            {notificationData ? notificationData.title : 'Notification details'}
        </Text>
        <ScrollView style={{width: '100%'}}>
        {loading ? (
          <ActivityIndicator size="large" color="#2d2d2d" />
        ) : (
            <View style={styles.notificationContainer}>
                {
                    notificationData ? (
                        <View style={styles.notificationContainerItem}>
                            <Text style={styles.notificationContainerItemTextTitle}>{notificationData.title}</Text>
                            <Text style={styles.notificationContainerItemText}>{notificationData.message}</Text>
                            <Text style={styles.notificationContainerItemText}>{formatDate(notificationData.date)}</Text>
                        </View>
                    ) : (
                        <Text>No data available</Text>
                    )
                }
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
    paddingTop: 10,
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
    // marginLeft: 10,
  },
  notificationContainerItemIcon: {
    position: 'absolute',
    right: 15,
  },
  notificationContainerItemTextTitle: {
    color: '#2d2d2d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationContainerItemText: {
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
});

export default NotificationDetails;
