import React from 'reactn';
import {
    View,
    StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';

class Web extends React.Component {

    render() {
        return (
            <View style={styles.container}>
               <WebView source={{ uri: 'http://sample-web1.dexit.co/' }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: 32,
        justifyContent: 'center'
    },

});

export default Web;
