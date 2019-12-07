import { createStackNavigator } from 'react-navigation';

//import screens
// import LoginScreen from '../components/LoginScreenAuto';
import LoginScreen from '../components/LoginScreen';
import ScanScreen from '../components/scan-screen';

import SplashScreen from '../components/SplashScreen';
import HomeScreen from '../components/HomeScreen';
import Web from '../components/Web';


export const rootNavigator = createStackNavigator({
    LoginScreen: {
        screen: LoginScreen
    },
    SplashScreen: {
        screen: SplashScreen
    },
    HomeScreen: {
        screen: HomeScreen
    },
    WebScreen: {
        screen: Web
    },
    QRScreen: {
        screen: ScanScreen
    },
}, {
        initialRouteName: 'SplashScreen',
        headerMode: 'none',
    }
);
