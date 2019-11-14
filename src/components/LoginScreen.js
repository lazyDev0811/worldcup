import React from 'reactn';
import {
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Alert
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
        // this.state = {
        //     emailText: '',
        //     passwordText: ''
        // }
    }

    componentDidMount() {

    }

    // onEmailChange = (text) => {
    //     this.setState({
    //         emailText: text
    //     });
    // }
    //
    // onPasswordChange = (text) => {
    //     this.setState({
    //         passwordText: text
    //     });
    // }

    showAlert = (message) => {
        Alert.alert(
            message
        );
    }
    // async fetchMe() {
    //     const resp = fetch('https://jsonplaceholder.typicode.com/todos/1');
    //
    //         .then(response => response.json())
    //         .then(json => {
    //             console.log(json);
    //             return json;
    //         });
    // }

    onLoginPress = async () => {

        //const {emailText, passwordText} = this.state;
        // if (emailText.length === 0) {
        //     this.showAlert(enter_email)
        // } else if (passwordText.length === 0) {
        //     this.showAlert(enter_password)
        // } else {
        const {navigation} = this.props;
        // use the client to make the auth request and receive the authState
        try {
            let config = null;
            if (Platform.OS === 'ios') {
                config = configIOS;
            } else {
                config = configAndriod;
            }
            // debugger;
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
        // if (this.props.authentication.loading) {
        //     return <ActivityIndicator
        //         size='small'
        //     />
        // } else {
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
        // }
    }

    renderMain() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require('../assets/icons/ic_logo.png')}
                />

                {/* <Text style={[styles.commonEmailPasswordText, { marginTop: 24 }]}>
                    {emailText}
                </Text>

                <TextInput
                    style={styles.commonEmailPasswordTextInput}
                    value={this.state.emailText}
                    onChangeText={this.onEmailChange}
                />

                <Text style={[styles.commonEmailPasswordText, { marginTop: 16 }]}>
                    {passwordText}
                </Text>

                <TextInput
                    secureTextEntry={true}
                    style={styles.commonEmailPasswordTextInput}
                    value={this.state.passwordText}
                    onChangeText={this.onPasswordChange}
                /> */}

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
        backgroundColor: '#f9fbfd',
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
        margin: 8
    },

    loginView: {
        backgroundColor: '#57a9ea',
        borderRadius: 8,
        paddingTop: 10,
        paddingBottom: 10,
        width: wp('90%'),
        margin: 8,
        alignItems: 'center'
    },

    loginText: {
        color: 'white',
        fontSize: 16
    },

    logo: {
        width: wp('30%'),
        height: wp('30%')
    }

});

export default LoginScreen;
