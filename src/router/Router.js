import { createStackNavigator } from 'react-navigation';

//import screens
import LoginScreen from '../components/LoginScreen';
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
    }
}, {
        initialRouteName: 'SplashScreen',
        headerMode: 'none',
    }
);
