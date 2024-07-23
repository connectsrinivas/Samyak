/*************************************************
 * SukraasLIS
 * URL.js
 * Created by Sankar on 08/06/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

// Development Server
export const isDevelopment = true;
export const serverName = 'Dev Server';

// Stage Server Config
export const S3URL =
  // 'http://103.146.234.22:7486/SukraaAppRT/App_Config/Stage_Patient/config.json';
  // 'http://103.146.234.52:7021/App_RT_UAT/App_Config/Stage_Patient/config.json';
   'http://110.44.126.145:9090/SamyakApp_Stage/API/Patient';


// Live Server Config
// export const S3URL =
// 'http://110.44.126.145/SamyakApp/App_Config/Live_Patient/config.json';

export const LOGIN = 'User_Login';
export const SIGN_UP = 'User_Registration';
export const OTP_SEND = 'OTP_Send';
export const OTP_VERIFICATION = 'OTP_Verification';
export const SET_PASSWORD = 'SetPassword';
export const SPECIAL_PACKAGE = 'Special_Package';
export const LAB_TEST_PACKAGE = 'Test_Package';
export const PRESCRIPTION_UPLOAD = 'Upload_Prescription';
export const PRESCRIPTION_DELETE = 'Delete_Prescription';
export const USER_INFO = 'User_View';
export const HEALTH_TIPS = 'Health_Tips';
export const GET_GENDER = 'Get_Gender';
export const GET_TITLE = 'Get_Title';
export const GET_RELATIONSHIP = 'Get_RelationShip';
export const GET_DEPARTMENT = 'Get_Department';
export const GET_BRANCH_DETAIL = 'Get_Branch_Detail';
export const USER_VS_DEFAULT_BRANCH = 'User_Vs_Default_Branch';
export const CONTACT_US = 'Contact_Us';
export const UPDATE_PROFILE = 'User_Profile_Update';
export const DOWNLOAD_REPORT = 'Download_Report';

export const ADD_PATIENT = 'Add_Patient';
export const EDIT_PATIENT = 'Edit_Patient';
export const GET_PATIENT = 'Get_Patient_List';
export const DELETE_PATIENT = 'Delete_Patient';

export const SUBMIT_ADDRESS = 'Add_User_Address';
export const UPDATE_ADDRESS = 'Edit_User_Address';
export const GET_ADDRESS = 'Get_User_Address';
export const GET_ADDRESS_TYPE = 'Get_Address_Type';
export const DELETE_ADDRESS = 'Delete_User_Address';

export const TRENDS_PATIENT = 'Get_Patient_Trends';
export const PATIENT_TEST_LIST = 'Get_Patient_Test_List';
export const GET_PROMOTION = 'Get_Promotion';
export const APPLY_PROMOTION = 'Apply_Promotion';

export const ORDER_BOOKING = 'Order_Booking';

export const OAUTH = 'oauth/token';
export const CHECK_USERNAME = 'rest/signup/checkUserName?userName=';
export const User_UploadPrescription = 'Upload_Prescription';
export const User_DeletePrescription = 'Delete_Prescription';

//order Booking List
export const ORDER_BOOKING_LIST = 'Order_Booking_List';

//Booking Comments
export const Post_CommentAction = 'user/upload_prescription';
export const star_RatingAction = 'user/delete_prescription';
export const UPDATE_RATINGS = 'Update_Ratings';
export const POST_RATE_CODE = 'Post_RateCode';
export const POST_REVIEWS = 'Post_Reviews';

//Booking Types
export const GET_BOOKING_TYPES = 'Get_Booking_Types';
export const GET_BOOKING_SLOT_DAYWISE = 'Get_Booking_Slot_DayWise';

export const GET_PACKAGE_TEST_LIST = 'TestInfo_In_A_Service';
// About

export const ABOUT_US = 'About_Us';
export const CONFIG = 'App_Settings';

export const CHECK_DUPLICATE_TEST = 'Check_Service_Duplicate';
export const BOOKING_DETAILS = 'Order_Booking_Detail';

// Notification
export const NOTIFICATION_COUNT = 'User_Notify_In_Count';
export const NOTIFICATION_LIST = 'User_Notify_In_List';
export const NOTIFICATION_COUNT_COUNT = 'User_Notify_Update';
