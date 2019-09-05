import React from 'reactn';
import {
    View,
    Image,
    StyleSheet,
    Alert
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { resetNavigation } from '../utils/Helper';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";

class SplashScreen extends React.Component {

    componentDidMount() {
        const self = this;
        setTimeout(function () { self.navigate() }, 3000);
    }

    navigate() {
        const { navigation } = this.props;
        AsyncStorage.getItem('accessToken', (err, result) => {
            if (result !== null) {
                AsyncStorage.getItem('refreshToken', (err, result1) => {
                    if (result1 !== null) {
                        const parameters = { 'accessToken': result, 'refreshToken': result1 };
                        resetNavigation(navigation, NavigationActions, StackActions, 'HomeScreen', parameters);
                    } else {
                        resetNavigation(navigation, NavigationActions, StackActions, 'LoginScreen', {});
                    }
                });
            } else {
                resetNavigation(navigation, NavigationActions, StackActions, 'LoginScreen', {});
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require('../assets/icons/ic_logo.png')}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center'
    },

    logo: {
        alignSelf: 'center',
        width: wp('40%'),
        height: wp('40%')
    }

});

export default SplashScreen;
