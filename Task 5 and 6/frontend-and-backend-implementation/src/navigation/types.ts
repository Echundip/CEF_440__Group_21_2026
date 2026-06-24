import { NavigatorScreenParams } from '@react-navigation/native';

export type StudentTabParamList = {
  Dashboard: undefined;
  Courses: undefined;
  Downloads: undefined;
  Profile: undefined;
};

export type InstructorTabParamList = {
  InstructorHome: undefined;
  ManageCourses: undefined;
  Analytics: undefined;
  InstructorProfile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  StudentTabs: NavigatorScreenParams<StudentTabParamList>;
  InstructorTabs: NavigatorScreenParams<InstructorTabParamList>;
  AdminTabs: NavigatorScreenParams<AdminTabParamList>;
  CourseDetails: { courseId: string };
  Learning: { courseId: string };
  QoEMonitoring: undefined;
  CreateCourse: undefined;
  UploadContent: undefined;
  Assignments: undefined;
  LiveClasses: undefined;
  Calendar: undefined;
  Messages: undefined;
  Settings: undefined;
  AdminProfile: undefined;
};
export type AdminTabParamList = {
  AdminHome: undefined;
  Users: undefined;
  Health: undefined;
  Analytics: undefined;
  Courses: undefined;
};
