import React from 'reactn';
import {View, Image, StyleSheet, Alert, Platform} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {configAndriod, configIOS, resetNavigation} from '../utils/Helper';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {checkTokenValid} from '../utils/Helper';
import Auth from '../utils/auth';

// import {refresh} from 'react-native-app-auth';

//let refreshToken = '';
//let accessToken = '';
class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.auth = new Auth();
  }

  componentDidMount() {
    const self = this;
    setTimeout(function() {
      self.navigate();
    }, 3000);
  }

  onRefreshPress = async () => {
    let config = null;
    if (Platform.OS === 'ios') {
      config = configIOS;
    } else {
      config = configAndriod;
    }
    let refreshToken = await AsyncStorage.getItem('refreshToken');

    if (refreshToken.length > 2) {
      // const result = await this.auth.refreshToken(refreshToken, config.clientId) refresh(config, {
      //   refreshToken: refreshToken,
      // });
      const res = await this.auth.refreshToken(
        refreshToken,
        config.clientId,
      );

      if (res.status !== 200) {
        throw new Error('cannot refresh');
      }
      let result = await result.json();

      let access_Token = result.accessToken;
      let refresh_Token = result.refreshToken;
      await AsyncStorage.setItem('accessToken', access_Token);
      await AsyncStorage.setItem('refreshToken', refresh_Token);

      //Alert.alert('Refreshed!');
      return {accessToken: access_Token, refreshToken: refresh_Token};
    } else {
      throw new Error('cannot refresh');

      //Alert.alert("Refresh token can't be refreshed more!");
    }
  };

  navigate() {
    const {navigation} = this.props;

    var self = this;
    AsyncStorage.getItem('accessToken', (err, accessToken) => {
      if (accessToken !== null) {
        AsyncStorage.getItem('refreshToken', (err, refreshToken) => {
          if (refreshToken !== null) {
            var validAccessToken = checkTokenValid(accessToken);
            if (!validAccessToken) {
              self
                .onRefreshPress()
                .then(res => {
                  resetNavigation(
                    navigation,
                    NavigationActions,
                    StackActions,
                    'HomeScreen',
                    res,
                  );
                })
                .catch(err => {
                  resetNavigation(
                    navigation,
                    NavigationActions,
                    StackActions,
                    'LoginScreen',
                    {},
                  );
                });
            } else {
              const parameters = {
                accessToken: accessToken,
                refreshToken: refreshToken,
              };
              resetNavigation(
                navigation,
                NavigationActions,
                StackActions,
                'HomeScreen',
                parameters,
              );
            }
          } else {
            //AsyncStorage.
            resetNavigation(
              navigation,
              NavigationActions,
              StackActions,
              'LoginScreen',
              {},
            );
          }
        });
      } else {
        resetNavigation(
          navigation,
          NavigationActions,
          StackActions,
          'LoginScreen',
          {},
        );
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<View stype={styles.logoCircle}>*/}
          <Image
            style={styles.logo}
            source={require('../assets/icons/big_logo.png')}
          />
        {/*</View>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#142550',
    // backgroundColor: '#e2782c',
    backgroundColor: '#fafdff',
    flex: 1,
    justifyContent: 'center',
  },
  logoCircle: {
    alignSelf: 'center',
    width: wp('40%'),
    height: wp('40%'),
    borderRadius: this.width / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  logo: {
    alignSelf: 'center',
    width: wp('30%'),
    height: wp('30%'),
  },
});

export default SplashScreen;
