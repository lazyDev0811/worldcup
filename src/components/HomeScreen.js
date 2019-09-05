import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { logoutText, checkText, refreshText, webText } from '../constants/strings';
import { resetNavigation, configIOS, configAndriod } from '../utils/Helper';
import { refresh } from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';

let access_Token = '';
let refresh_Token = '';
class HomeScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            token: 'Sample Text'
        }
    }

    componentDidMount() {
        access_Token = this.props.navigation.state.params.accessToken;
        refresh_Token = this.props.navigation.state.params.refreshToken;

    }

    onCheckPress = () => {
        this.setState({
            token: access_Token
        });
    }

    onLogoutPress = () => {
        const { navigation } = this.props;
        AsyncStorage.setItem('accessToken', '');
        AsyncStorage.setItem('refreshToken', '');
        resetNavigation(navigation, NavigationActions, StackActions, 'LoginScreen', {});
    }

    onRefreshPress = async () => {
        let config = null;
        if (Platform.OS === 'ios') {
            config = configIOS
        } else { config = configAndriod }

        if (refresh_Token.length > 2) {
            const result = await refresh(config, {
                refreshToken: refresh_Token,
            });
            access_Token = result.accessToken;
            AsyncStorage.setItem('accessToken', access_Token);

            Alert.alert(
                `Refreshed!`
            );
        } else {
            Alert.alert(
                `Refresh token can't be refreshed more!`
            );
        }
    }

    onWebPress = () => {
        this.props.navigation.navigate('WebScreen');
    }

    renderButton(type) {
        return (
            <TouchableOpacity style={{ marginTop: 12 }}
                onPress={(type === 'logout') ? this.onLogoutPress : (type === 'check') ? this.onCheckPress : (type === 'web')? this.onWebPress : this.onRefreshPress}>
                <View style={[styles.loginView, (type === 'logout' || type === 'web') ? { width: wp('90%') } : { width: wp('40%') }]}>
                    <Text style={styles.loginText}>
                        {(type === 'logout') ? logoutText : (type === 'check') ? checkText : (type === 'web')? webText : refreshText}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    renderMain() {

        return (
            <View style={styles.container}>

                <View style={styles.textContainer}>
                    <Text style={[styles.commonEmailPasswordText]}>
                        {this.state.token}
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <View style={styles.subButtonContainer}>
                        {this.renderButton('check')}
                        {this.renderButton('refresh')}
                    </View>
                    {this.renderButton('logout')}
                    {this.renderButton('web')}
                </View>

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

    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-start'
    },

    subButtonContainer: {
        flexDirection: 'row',
        width: wp('90%'),
        alignSelf: 'center'
    },

    textContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        marginTop: hp('5%'),
        width: wp('90%'),
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 0.2
    },

    commonEmailPasswordText: {
        textAlign: 'center',
        color: 'black',
        fontSize: 18,
        padding: 2
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
    }

});

export default HomeScreen;
