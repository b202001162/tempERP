import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
// Stack Navigator
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import StudentLogin from './screens/StudentLogin.tsx';
import CreateAccount from './screens/CreateAccount.tsx';
import StudentProfile from './screens/StudentProfile.tsx';
import EditStudentProfile from './screens/EditStudentProfile.tsx';
import ExploreCourses from './screens/ExploreCourses.tsx';
import CourseEnroll from './screens/CourseEnroll.tsx';
import FacultyTALogin from './screens/FacultyTALogin.tsx';
import FacultyTADashboard from './screens/FacultyTADashboard.tsx';
import StartNewCourse from './screens/StartNewCourse.tsx';
import CourseDetails from './screens/CourseDetails.tsx';
import CourseDetailsEditOrView from './screens/CourseDetailsEditOrView.tsx';
import AddTopic from './screens/AddTopic.tsx';
import ViewTopics from './screens/ViewTopics.tsx';
import Topic from './screens/Topic.tsx';
import AddVideo from './screens/AddVideo.tsx';
import AddMaterial from './screens/AddMaterial.tsx';
import AddAssignment from './screens/AddAssignment.tsx';
import StudentDashboard from './screens/StudentDashboard.tsx';
import FacultyProfile from './screens/FacultyProfile.tsx';
import Notifications from './screens/Notifications.tsx';
import NotificationDetails from './screens/NotificationDetails.tsx';
import AssignmentSubmission from './screens/AssignmentSubmission.tsx';
import AssignmentSubmissionsFaculty from './screens/AssignmentSubmissionsFaculty.tsx';
import AdminLogin from './screens/AdminLogin.tsx';
import InstituteAdminDashboard from './screens/InstituteAdminDashboard.tsx';
import CreateFaculty from './screens/CreateFaculty.tsx';
import CreateTA from './screens/CreateTA.tsx';
import SuperAdminDashboard from './screens/SuperAdminDashboard.tsx';
import CreateInstituteAdmin from './screens/CreateInstituteAdmin.tsx';
import ListOfAllInstituteAdmins from './screens/ListOfAllInstituteAdmins.tsx';
import ListOfFacultiesByInstituteAdmin from './screens/ListOfFacultiesByInstituteAdmin.tsx';
import ListOfTAsByInstituteAdmin from './screens/ListOfTAsByInstituteAdmin.tsx';
import LoadingComponent from './screens/LoadingComponent.tsx';
import ListOfStudents from './screens/ListOfStudents.tsx';
import EvaluteAssignment from './screens/EvaluteAssignment.tsx';
import Tokens from './screens/Tokens.tsx';
import RaiseAToken from './screens/RaiseAToken.tsx';
import TokenChats from './screens/TokenChats.tsx';
import GradeSubmissionPerStudent from './screens/GradeSubmissionPerStudent.tsx';
import ListCourseBySemesterAndInstitute from './screens/ListCourseBySemesterAndInstitute.tsx';
import EditCourseForAdmin from './screens/EditCourseForAdmin.tsx';
import CourseRegistration from './screens/CourseRegistration.tsx';
import ListOfStudentsForAdmin from './screens/ListOfStudentsForAdmin.tsx';
import CreateStudentByAdmin from './screens/CreateStudentByAdmin.tsx';

export type RootStackParamList = {
  StudentLogin: undefined;
  CreateAccount: undefined;
  StudentProfile: undefined;
  EditStudentProfile: undefined;
  ExploreCourses: undefined;
  CourseEnroll: {courseId: number};
  FacultyTALogin: undefined;
  FacultyTADashboard: undefined;
  StartNewCourse: undefined;
  CourseDetails: {courseId: number};
  CourseDetailsEditOrView: {courseId: number};
  AddTopic: {courseId: number};
  ViewTopics: {courseId: number};
  Topic: {courseId: number; topicId: number};
  AddVideo: {courseId: number};
  AddMaterial: {courseId: number};
  AddAssignment: {courseId: number};
  StudentDashboard: undefined;
  FacultyProfile: undefined;
  Notifications: undefined;
  NotificationDetails: {notificationId: number};
  AssignmentSubmission: {assignmentId: number};
  AssignmentSubmissionsFaculty: {assignmentId: number};
  AdminLogin: undefined;
  InstituteAdminDashboard: undefined;
  CreateFaculty: undefined;
  CreateTA: undefined;
  SuperAdminDashboard: undefined;
  CreateInstituteAdmin: undefined;
  ListOfAllInstituteAdmins: undefined;
  ListOfFacultiesByInstituteAdmin: undefined;
  ListOfTAsByInstituteAdmin: undefined;
  LoadingComponent: undefined;
  ListOfStudents: {courseId: number};
  EvaluteAssignment: {courseId: number};
  Tokens: {courseId: number; courseName: string; studentEmail: string};
  RaiseAToken: {courseId: number; courseName: string};
  TokenChats: {token: string};
  GradeSubmissionPerStudent: {courseId: number; courseName: string};
  ListCourseBySemesterAndInstitute: {semester: number; instituteId: number};
  EditCourseForAdmin: {courseId: number; courseName: string};
  CourseRegistration: {courseId: number};
  ListOfStudentsForAdmin: undefined;
  CreateStudentByAdmin: undefined;
};

// Create stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer style={{fontFamily: 'arial'}}>
      <Stack.Navigator initialRouteName="FacultyTALogin">
        <Stack.Screen
          name="StudentLogin"
          component={StudentLogin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccount}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="StudentProfile"
          component={StudentProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditStudentProfile"
          component={EditStudentProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ExploreCourses"
          component={ExploreCourses}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CourseEnroll"
          component={CourseEnroll}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FacultyTALogin"
          component={FacultyTALogin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FacultyTADashboard"
          component={FacultyTADashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="StartNewCourse"
          component={StartNewCourse}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CourseDetails"
          component={CourseDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CourseDetailsEditOrView"
          component={CourseDetailsEditOrView}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddTopic"
          component={AddTopic}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ViewTopics"
          component={ViewTopics}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Topic"
          component={Topic}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddVideo"
          component={AddVideo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddMaterial"
          component={AddMaterial}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddAssignment"
          component={AddAssignment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="StudentDashboard"
          component={StudentDashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FacultyProfile"
          component={FacultyProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NotificationDetails"
          component={NotificationDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AssignmentSubmission"
          component={AssignmentSubmission}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AssignmentSubmissionsFaculty"
          component={AssignmentSubmissionsFaculty}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AdminLogin"
          component={AdminLogin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InstituteAdminDashboard"
          component={InstituteAdminDashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateFaculty"
          component={CreateFaculty}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateTA"
          component={CreateTA}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SuperAdminDashboard"
          component={SuperAdminDashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateInstituteAdmin"
          component={CreateInstituteAdmin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListOfAllInstituteAdmins"
          component={ListOfAllInstituteAdmins}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListOfFacultiesByInstituteAdmin"
          component={ListOfFacultiesByInstituteAdmin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListOfTAsByInstituteAdmin"
          component={ListOfTAsByInstituteAdmin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LoadingComponent"
          component={LoadingComponent}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListOfStudents"
          component={ListOfStudents}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EvaluteAssignment"
          component={EvaluteAssignment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Tokens"
          component={Tokens}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RaiseAToken"
          component={RaiseAToken}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TokenChats"
          component={TokenChats}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GradeSubmissionPerStudent"
          component={GradeSubmissionPerStudent}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListCourseBySemesterAndInstitute"
          component={ListCourseBySemesterAndInstitute}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditCourseForAdmin"
          component={EditCourseForAdmin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CourseRegistration"
          component={CourseRegistration}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListOfStudentsForAdmin"
          component={ListOfStudentsForAdmin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateStudentByAdmin"
          component={CreateStudentByAdmin}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
