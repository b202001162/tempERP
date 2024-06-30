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
import Icon from 'react-native-vector-icons/FontAwesome6';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
type NotificationsProps = NativeStackScreenProps<
  RootStackParamList,
  'Notifications'
>;

const Notifications = ({route}: NotificationsProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [role, setRole] = React.useState('2');
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [notificationData, setNotificationData] = React.useState([]);
  const [type, setType] = React.useState(0);
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
    } else if (role === '2'){
      emailId = await JSON.parse(await AsyncStorage.getItem('email'));
    } else if(role === '3') {
      emailId = await JSON.parse(await AsyncStorage.getItem('adminEmail'));
    } else if(role === '4') {
      emailId = await JSON.parse(await AsyncStorage.getItem('superAdminEmail'));
    }
    // const email = await JSON.parse(await AsyncStorage.getItem('email'));
    setEmail(emailId);
    try {
      const response = await axios.get(
        `http://10.200.6.190:8080/getAllNotificationsByEmail?email=${emailId}`,
      );
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

  const handleAcceptRequest = async (
    notificationId,
    email,
    courseId,
    taEmail,
  ) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://10.200.6.190:8080/acceptTARequest?notificationId=${notificationId}&email=${email}&courseId=${courseId}&taEmail=${taEmail}`,
      );
      console.log('Response:', response.data);
      if(response.data === 'Accepted') {
        navigation.replace("Notifications");
      } else {
        console.log('Error:', response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (
    notificationId,
    email,
    courseId,
    taEmail,
  ) => {
    try {
      const response = await axios.put(
        `http://10.200.6.190:8080/rejectTARequest?notificationId=${notificationId}&email=${email}&courseId=${courseId}&taEmail=${taEmail}`,
      );
      console.log('Response:', response.data);
      navigation.replace("Notifications");
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text>Notifications</Text> */}
      <View style={styles.navigationBar}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{flexDirection: 'row'}}>
          <Icon
            name="arrow-left-long"
            style={{marginRight: 10}}
            size={24}
            color="#2d2d2d"
          />
          <Text style={styles.title}>Notifications</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.subContainer}>
        <ScrollView style={{width: '100%'}}>
          {loading ? (
            <ActivityIndicator size="large" color="#2d2d2d" />
          ) : (
            <View style={styles.notificationContainer}>
              {notificationData.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('NotificationDetails', {
                        notificationId: item.id,
                        notificationTitle: item.title,
                        notificationMessage: item.message,
                        notificationDate: item.date,
                      });
                    }}
                    key={index}
                    style={styles.notificationContainerItem}>
                    <Text
                      style={[
                        styles.notificationContainerItemText,
                        {
                          fontSize: 13,
                          color: '#6d6d6d',
                          fontWeight: 'bold',
                        },
                      ]}>
                      {formatDateOnly(item.date)}
                      <Text
                        style={{
                          color: '#1d1d1d',
                          fontWeight: 'bold',
                          fontSize: 17,
                        }}>
                        {' '}
                        |{' '}
                      </Text>
                      {formatTimeOnly(item.date)}
                    </Text>
                    <Text style={styles.notificationContainerItemTextTitle}>
                      {item.title}
                    </Text>
                    {item.senderEmail && item.senderName ? (
                      <Text
                        style={[
                          styles.notificationContainerItemTextTitle,
                          {fontWeight: 'regular'},
                        ]}>
                        <Text style={{fontWeight: 'bold'}}>
                          {item.senderName}
                        </Text>
                      </Text>
                    ) : null}
                    <Text style={styles.notificationContainerItemText}>
                      {makeMessageTrimmed(item.message)}
                    </Text>
                    {item.dueDate ? (
                      <Text
                        style={[
                          styles.notificationContainerItemText,
                          {
                            fontSize: 13,
                            color: '#FFC232',
                            fontWeight: 'bold',
                          },
                        ]}>
                        Due: {formatDateOnly(item.dueDate)}
                        <Text
                          style={{
                            color: '#1d1d1d',
                            fontWeight: 'bold',
                            fontSize: 17,
                          }}>
                          {' '}
                          |{' '}
                        </Text>
                        {formatTimeOnly(item.dueDate)}
                      </Text>
                    ) : null}
                    {item.type === 2 ? (
                      <View style={styles.requestButtonsContainer}>
                        <TouchableOpacity
                          onPress={() => {
                            console.log('Accepting request');
                            handleAcceptRequest(item.id, email, item.courseId, item.senderEmail);
                          }}
                          style={styles.requestButtonAccept}>
                          <Icon
                            name="check"
                            size={18}
                            color="#1E63BB"
                            style={{marginRight: 10}}
                          />
                          <Text
                            style={{
                              color: '#1E63BB',
                              fontWeight: 'bold',
                              fontSize: 15,
                            }}>
                            ACCEPT
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            console.log('Rejecting request');
                            handleRejectRequest(item.id, email, courseId, item.senderEmail);
                          }}
                          style={styles.requestButtonReject}>
                          <Icon
                            name="xmark"
                            size={18}
                            color="#FF3E3E"
                            style={{marginRight: 10}}
                          />
                          <Text
                            style={{
                              color: '#FF3E3E',
                              fontWeight: 'bold',
                              fontSize: 15,
                            }}>
                            REJECT
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
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
    flexDirection: 'column-reverse',
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
});

export default Notifications;
