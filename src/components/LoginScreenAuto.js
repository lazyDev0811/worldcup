// import React from 'reactn';
// import {
//     View,
//     Image,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
//     Platform,
//     Alert
// } from 'react-native';
// import {emailText, passwordText, loginText, enter_email, enter_password} from '../constants/strings';
// import {NavigationActions, StackActions} from 'react-navigation';
// import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
// import {
//   resetNavigation,
//   configIOS,
//   configAndriod,
//   checkTokenValid,
// } from '../utils/Helper';
// // import {authorize} from 'react-native-app-auth';
// import AsyncStorage from '@react-native-community/async-storage';
//
// import Auth from '../utils/auth';
//
// class LoginScreen extends React.Component {
//
//     constructor(props) {
//         super(props)
//         // this.state = {
//         //     emailText: '',
//         //     passwordText: ''
//         // }
//
//
//         this.auth = new Auth();
//
//     }
//
//
//     login = async () => {
//
//         const {navigation} = this.props;
//
//         let details = {
//             'client_id': 'api_test',
//             'client_secret': 'c73c11d9-72a0-4c08-b108-faa63e0ddd9c',
//             'grant_type':'client_credentials'
//         };
//
//         const resp = await this.auth.login(details);
//
//         if (resp.status && resp.status === 200) {
//             let result = await resp.json();
//
//
//         //const result = await authorize(config);
//
//             const accessToken = result.access_token;
//             const refreshToken = result.refresh_token;
//             //const exiresIn = result.expires_in;
//
//             const accessTokenExpirationDate = '';//result.accessTokenExpirationDate;
//
//
//             const parameters = {'accessToken': accessToken, 'refreshToken': refreshToken, 'accessTokenExpirationDate':accessTokenExpirationDate};
//             AsyncStorage.setItem('accessToken', accessToken);
//             AsyncStorage.setItem('refreshToken', refreshToken);
//             //AsyncStorage.setItem('accessTokenExpirationDate', accessTokenExpirationDate);
//             resetNavigation(navigation, NavigationActions, StackActions, 'HomeScreen', parameters);
//
//         }else {
//             throw new Error('invalid login');
//         }
//     }
//
//     componentDidMount() {
//         this.login().then(r => console.log('logged in')).catch((e) => alert('could not login'));
//     }
//
//     // onEmailChange = (text) => {
//     //     this.setState({
//     //         emailText: text
//     //     });
//     // }
//     //
//     // onPasswordChange = (text) => {
//     //     this.setState({
//     //         passwordText: text
//     //     });
//     // }
//
//     showAlert = (message) => {
//         Alert.alert(
//             message
//         );
//     }
//     // async fetchMe() {
//     //     const resp = fetch('https://jsonplaceholder.typicode.com/todos/1');
//     //
//     //         .then(response => response.json())
//     //         .then(json => {
//     //             console.log(json);
//     //             return json;
//     //         });
//     // }
//
//     onLoginPress = async () => {
//
//         // //const {emailText, passwordText} = this.state;
//         // // if (emailText.length === 0) {
//         // //     this.showAlert(enter_email)
//         // // } else if (passwordText.length === 0) {
//         // //     this.showAlert(enter_password)
//         // // } else {
//         // const {navigation} = this.props;
//         // // use the client to make the auth request and receive the authState
//         // try {
//         //     let config = null;
//         //     if (Platform.OS === 'ios') {
//         //         config = configIOS;
//         //     } else {
//         //         config = configAndriod;
//         //     }
//         //     // debugger;
//         //     // const testme = await this.fetchMe();
//         //
//         //
//         //     const result = await authorize(config);
//         //
//         //     const accessToken = result.accessToken;
//         //     const refreshToken = result.refreshToken;
//         //     const accessTokenExpirationDate = result.accessTokenExpirationDate;
//         //
//         //     const parameters = {'accessToken': accessToken, 'refreshToken': refreshToken, 'accessTokenExpirationDate':accessTokenExpirationDate};
//         //     AsyncStorage.setItem('accessToken', accessToken);
//         //     AsyncStorage.setItem('refreshToken', refreshToken);
//         //     AsyncStorage.setItem('accessTokenExpirationDate', accessTokenExpirationDate);
//         //     resetNavigation(navigation, NavigationActions, StackActions, 'HomeScreen', parameters);
//         //
//         // } catch (error) {
//         //     console.log('error',error);
//         //     console.trace();
//         //     alert('there was an error contacting the server');
//         // }
//
//             // }
//     }
//
//     renderLoginButton() {
//         // if (this.props.authentication.loading) {
//         //     return <ActivityIndicator
//         //         size='small'
//         //     />
//         // } else {
//         return (
//             <TouchableOpacity style={{marginTop: 12}}
//                               onPress={this.onLoginPress}>
//                 <View style={styles.loginView}>
//                     <Text style={styles.loginText}>
//                         {loginText}
//                     </Text>
//                 </View>
//             </TouchableOpacity>
//         );
//         // }
//     }
//
//
//
//     renderMain() {
//         return (
//             <View style={styles.container}>
//
//                 <View style={styles.logoCircle}>
//                     <Image
//                         style={styles.logo}
//                         source={require('../assets/icons/ic_logo.png')}
//                     />
//                 </View>
//                 <Text style={styles.headerText}>Welcome
//                 </Text>
//
//                 {/* <Text style={[styles.commonEmailPasswordText, { marginTop: 24 }]}>
//                     {emailText}
//                 </Text>
//
//                 <TextInput
//                     style={styles.commonEmailPasswordTextInput}
//                     value={this.state.emailText}
//                     onChangeText={this.onEmailChange}
//                 />
//
//                 <Text style={[styles.commonEmailPasswordText, { marginTop: 16 }]}>
//                     {passwordText}
//                 </Text>
//
//                 <TextInput
//                     secureTextEntry={true}
//                     style={styles.commonEmailPasswordTextInput}
//                     value={this.state.passwordText}
//                     onChangeText={this.onPasswordChange}
//                 /> */}
//
//                 {/*{this.renderLoginButton()}*/}
//
//             </View>
//         );
//
//     }
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 {this.renderMain()}
//             </View>
//         );
//     }
// }
//
// const styles = StyleSheet.create({
//
//     container: {
//         flex: 1,
//         //backgroundColor: '#f9fbfd',
//         backgroundColor: '#142550',
//         padding: 4,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//
//     commonEmailPasswordText: {
//         color: 'black',
//         fontSize: 14
//     },
//
//     commonEmailPasswordTextInput: {
//         backgroundColor: 'white',
//         borderRadius: 4,
//         borderWidth: 0.2,
//         borderColor: '#a7bcd2',
//         paddingTop: 8,
//         paddingBottom: 8,
//         paddingLeft: 12,
//         paddingRight: 12,
//         width: wp('90%'),
//         margin: 8,
//     },
//
//     loginView: {
//         //backgroundColor: '#57a9ea',
//         backgroundColor: '#142550',
//         borderRadius: 8,
//         paddingTop: 10,
//         paddingBottom: 10,
//         width: wp('90%'),
//         margin: 8,
//         borderWidth: 1,
//         alignItems: 'center',
//         borderColor: 'white',
//     },
//     headerText: {
//         alignItems: 'center',
//         color: 'white',
//         fontSize: 20,
//     },
//     loginText: {
//         color: 'white',
//         fontSize: 16,
//     },
//     logoCircle: {
//         width:  wp('45%'),
//         height:wp('45%'),
//         //width: 300,
//         //height: 300,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: wp('45%')/2,
//         //borderColor:'red',
//         //borderRadius: wp('40%') / 2,//(wp('40%') / 2),
//         backgroundColor:'white',
//     },
//     logo: {
//         width: wp('30%'),
//         height: wp('30%'),
//      //  backgroundColor:'green',
//         // borderRadius: wp('40%') / 2,
//         // borderWidth: 20,
//
//
//         // backgroundColor:'red'
//     }
//
// });
//
// export default LoginScreen;
