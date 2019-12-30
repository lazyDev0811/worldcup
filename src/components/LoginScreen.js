import React from 'reactn';
import {
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Alert,
    Picker
} from 'react-native';
import {emailText, passwordText, loginText, enter_email, enter_password} from '../constants/strings';
import {NavigationActions, StackActions} from 'react-navigation';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {
  resetNavigation,
  configIOS,
  configAndriod,
  checkTokenValid,
} from '../utils/Helper';
import {authorize} from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';

class LoginScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            language: '',
        }
    }

    componentDidMount() {

    }
    showAlert = (message) => {
        Alert.alert(
            message
        );
    }


    onLoginPress = async () => {

        const {navigation} = this.props;
        // use the client to make the auth request and receive the authState
        try {
            let config = null;
            if (Platform.OS === 'ios') {
                config = configIOS;
            } else {
                config = configAndriod;
            }
            // const testme = await this.fetchMe();


            const result = await authorize(config);

            const accessToken = result.accessToken;
            const refreshToken = result.refreshToken;
            const accessTokenExpirationDate = result.accessTokenExpirationDate;

            const parameters = {'accessToken': accessToken, 'refreshToken': refreshToken, 'accessTokenExpirationDate':accessTokenExpirationDate};
            AsyncStorage.setItem('accessToken', accessToken);
            AsyncStorage.setItem('refreshToken', refreshToken);
            AsyncStorage.setItem('accessTokenExpirationDate', accessTokenExpirationDate);
            resetNavigation(navigation, NavigationActions, StackActions, 'HomeScreen', parameters);

        } catch (error) {
            console.log('error',error);
            console.trace();
            alert('there was an error contacting the server');
        }

        // }
    }

    renderLoginButton() {
        return (
            <TouchableOpacity style={{marginTop: 12}}
                              onPress={this.onLoginPress}>
                <View style={styles.loginView}>
                    <Text style={styles.loginText}>
                        {loginText}
                    </Text>
                </View>
            </TouchableOpacity>
        );

    }

    renderMain() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require('../assets/icons/big_logo.png')}
                />
                <Picker
                    selectedValue={this.state.language}
                    style={{height: 50, width: 200}}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({language: itemValue})
                    }>
                    <Picker.Item label="العربية" value="arabic" />
                    <Picker.Item label="English" value="english" />
                </Picker>
                {this.renderLoginButton()}
            </View>
        );

    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderMain()}
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fafdff',
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },

    commonEmailPasswordText: {
        color: 'black',
        fontSize: 14
    },

    commonEmailPasswordTextInput: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 0.2,
        borderColor: '#a7bcd2',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        width: wp('90%'),
        margin: 8,
    },

    loginView: {
        backgroundColor: '#fafdff',
        borderRadius: 8,
        paddingTop: 10,
        paddingBottom: 10,
        width: wp('90%'),
        margin: 8,
        borderWidth: 2,
        alignItems: 'center',
        borderColor: '#4b515c',
    },

    loginText: {
        fontFamily:'Poppins-Bold',
        color: '#4b515c',
        fontSize: 17,
        fontWeight: 'bold',
    },
    logo: {
        width: wp('30%'),
        height: wp('30%'),
    }

});

export default LoginScreen;
