


export const resetNavigation = (navigation, NavigationActions, StackActions, route, parameters) => {
    navigation.dispatch(StackActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: route, params: parameters })
        ]
    }));
}

export const configIOS = {
    // issuer: 'https://accounts.google.com',
    // clientId: '568415197966-cjjou0c5fgipqke40imjb523cpu8cmsl.apps.googleusercontent.com',
    // redirectUrl: 'com.googleusercontent.apps.568415197966-cjjou0c5fgipqke40imjb523cpu8cmsl:/oauth2redirect/google/',
    // scopes: ['openid', 'profile']
    issuer: 'https://sso-latest-test.dexit.co/auth/realms/dexit.co',
    redirectUrl:'com.authdemo:/oauth2redirect/',
    clientId: 'mobile_latest',
    // redirectUrl: 'com.googleusercontent.apps.568415197966-u37p6um9hv8m9fsfqvm41fm381j8jvsa:/oauth2redirect/',
    scopes: ['openid', 'profile'],
    channelUrl: 'http://bcc-mobile-app.dexit.co',
    repo: 'dexitco'
};


export const configAndriod = {

    serviceConfiguration: {
        authorizationEndpoint: 'https://sso-latest-test.dexit.co/auth/realms/dexit.co/protocol/openid-connect/auth',
        tokenEndpoint: 'https://sso-latest-test.dexit.co/auth/realms/dexit.co/protocol/openid-connect/token',
        revocationEndpoint: 'https://sso-latest-test.dexit.co/auth/realms/dexit.co/protocol/openid-connect/logout'
    },
    //issuer: 'https://sso-latest-test.dexit.co/auth/realms/dexit.co',
    clientId: 'mobile_latest',
    redirectUrl:'com.authdemo:/oauth2redirect/',
    //redirectUrl: 'com.googleusercontent.apps.568415197966-u37p6um9hv8m9fsfqvm41fm381j8jvsa:/oauth2redirect/',
    scopes: ['openid', 'profile', 'offline_access'],
    channelUrl: 'http://bcc-mobile-app.dexit.co',
    repo: 'dexitco',
    //
    // additionalParameters: {
    //     prompt: 'login'
    // }
    // issuer: 'https://accounts.google.com',
    // clientId: '568415197966-u37p6um9hv8m9fsfqvm41fm381j8jvsa.apps.googleusercontent.com',
    // redirectUrl: 'com.googleusercontent.apps.568415197966-u37p6um9hv8m9fsfqvm41fm381j8jvsa:/oauth2redirect/',
    // scopes: ['openid', 'profile']
};

import jwtDecode from 'jwt-decode';

export function checkTokenValid(accessToken) {
    try {
        let decoded = jwtDecode(accessToken);
        let expires = decoded.exp * 1000;
        if (expires > Date.now()) {
            return true;
        }else {
            return false;
        }
    }catch(e) {
        return false;
    }
}
