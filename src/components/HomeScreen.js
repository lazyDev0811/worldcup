import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import RNRestart from 'react-native-restart';
import {NavigationActions, StackActions} from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  logoutText,
  checkText,
  refreshText,
  webText,
} from '../constants/strings';
import {resetNavigation, configIOS, configAndriod} from '../utils/Helper';

import AsyncStorage from '@react-native-community/async-storage';
import {default as Web} from './Web';
let access_Token = '';
let refresh_Token = '';
let accessTokenExpirationDate = '';
let html = require('./ep-home');
let htmlLoad = '<b>Load</b>';
let key = 1;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: ' ',
    };
  }

  componentDidMount() {
    access_Token = this.props.navigation.state.params.accessToken;
    refresh_Token = this.props.navigation.state.params.refreshToken;
    //his.setState({'refresh_Token

    // accessTokenExpirationDate = this.props.navigation.state.params.accessTokenExpirationDate;
    //TODO: check date and expiry
  }

  onCheckPress = () => {
    this.setState({
      token: access_Token,
    });
  };

  async revokeLogin(token) {
    let config = null;
    if (Platform.OS === 'ios') {
      config = configIOS;
    } else {
      config = configAndriod;
    }
    try {
      var details = {
        client_id: config.clientId,
        refresh_token: token,
      };
      //const formData = new URLSearchParams(details);
      const formBody = Object.keys(details)
        .map(
          key =>
            encodeURIComponent(key) + '=' + encodeURIComponent(details[key]),
        )
        .join('&');
      let resp2 = await fetch(
        'https://sso-latest-test.dexit.co/auth/realms/dexit.co/protocol/openid-connect/logout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody,
        },
      );
      if (resp2.status === 204) {
        return true;
      } else {
        throw new Error('could not revoke token:' + resp2.status);
      }
    } catch (error) {
      Alert.alert('Failed to revoke token', error.message);
    }
  }

  onLogoutPress = async () => {
    const {navigation} = this.props;

    //await this.revokeLogin(access_Token);
//    await this.revokeLogin(refresh_Token);

    AsyncStorage.setItem('accessToken', '');
    AsyncStorage.setItem('refreshToken', '');
   // this.setState({html: htmlLoad});

    resetNavigation(
      navigation,
      NavigationActions,
      StackActions,
      'LoginScreen',
      {},
    );

    RNRestart.Restart();
  };

  // onRefreshPress = async () => {
  //   let config = null;
  //   if (Platform.OS === 'ios') {
  //     config = configIOS;
  //   } else {
  //     config = configAndriod;
  //   }
  //
  //   if (refresh_Token.length > 2) {
  //     const result = await refresh(config, {
  //       refreshToken: refresh_Token,
  //     });
  //     access_Token = result.accessToken;
  //     AsyncStorage.setItem('accessToken', access_Token);
  //
  //     Alert.alert('Refreshed!');
  //   } else {
  //     Alert.alert("Refresh token can't be refreshed more!");
  //   }
  // };

  // onWebPress = async() => {
  //   //check the token...open way is to force refresh for now
  //   let config = null;
  //   if (Platform.OS === 'ios') {
  //     config = configIOS;
  //   } else {
  //     config = configAndriod;
  //   }
  //
  //     if (refresh_Token.length > 2) {
  //         try {
  //             const result = await refresh(config, {
  //                 refreshToken: refresh_Token,
  //             });
  //           access_Token = result.accessToken;
  //           AsyncStorage.setItem('accessToken', access_Token);
  //           this.props.navigation.navigate('WebScreen');
  //         }catch (e) {
  //           Alert.alert("Refresh token can't be refreshed more!");
  //           this.onLogoutPress();
  //         }
  //     } else {
  //         Alert.alert("Refresh token can't be refreshed more!");
  //         //redirect to loging
  //         this.onLogoutPress();
  //     }
  //
  //   // this.props.navigation.navigate('WebScreen');
  // };

  renderButton(type) {
    return (
      <TouchableOpacity
        style={{marginTop: 12}}
        onPress={
          type === 'logout'
            ? this.onLogoutPress
            : type === 'check'
            ? this.onCheckPress
            : type === 'web'
            ? this.onWebPress
            : this.onRefreshPress
        }>
        <View
          style={[
            styles.loginView,
            type === 'logout' || type === 'web'
              ? {width: wp('90%')}
              : {width: wp('40%')},
          ]}>
          <Text style={styles.loginText}>
            {type === 'logout'
              ? logoutText
              : type === 'check'
              ? checkText
              : type === 'web'
              ? webText
              : refreshText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderMain() {
    return (
      <View style={styles.container}>
        {/*<View style={styles.textContainer}>*/}
        {/*  <Text style={[styles.commonEmailPasswordText]}>*/}
        {/*    {this.state.token}*/}
        {/*  </Text>*/}
        {/*</View>*/}
        <View style={{flex: 1}}>
          <Web
            //key={refresh_Token}
            style={{flex: 1}}
            onlogoutPress={this.onLogoutPress}

          />
        </View>
        <View style={styles.buttonContainer}>
          {/*{this.renderButton('logout')}*/}
        </View>
      </View>
    );
  }

  render() {
    return <View style={styles.container}>{this.renderMain()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 1,
    flex: 1,
    backgroundColor: '#f9fbfd',
  },
  webContainer: {
    flex: 5,
    // backgroundColor: '#fde53a',
    marginLeft: 1,
    marginRight: 1,
    marginBottom: 1,
    width: wp('100%'),
  },
  containerWeb: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  // subButtonContainer: {
  //   flexDirection: 'row',
  //   width: wp('90%'),
  //   alignSelf: 'center',
  // },

  textContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: hp('5%'),
    width: wp('90%'),
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 0.2,
  },

  commonEmailPasswordText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
    padding: 2,
  },

  loginView: {
    backgroundColor: 'rgba(77,77,77,0.2)',
    borderRadius: 8,
    paddingTop: 10,
    paddingBottom: 10,
    width: 5,
    margin: 1,
    alignItems: 'center',
  },

  loginText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomeScreen;
