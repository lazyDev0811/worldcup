


export const resetNavigation = (navigation, NavigationActions, StackActions, route, parameters) => {
    navigation.dispatch(StackActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: route, params: parameters })
        ]
    }));
}

export const configIOS = {
    issuer: 'https://accounts.google.com',
    clientId: '568415197966-cjjou0c5fgipqke40imjb523cpu8cmsl.apps.googleusercontent.com',
    redirectUrl: 'com.googleusercontent.apps.568415197966-cjjou0c5fgipqke40imjb523cpu8cmsl:/oauth2redirect/google/',
    scopes: ['openid', 'profile']
};

export const configAndriod = {
    issuer: 'https://accounts.google.com',
    clientId: '568415197966-u37p6um9hv8m9fsfqvm41fm381j8jvsa.apps.googleusercontent.com',
    redirectUrl: 'com.googleusercontent.apps.568415197966-u37p6um9hv8m9fsfqvm41fm381j8jvsa:/oauth2redirect/',
    scopes: ['openid', 'profile']
};