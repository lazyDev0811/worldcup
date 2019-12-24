'use strict';

import React, {Component} from 'react';
import { withNavigation } from 'react-navigation';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera as Camera} from 'react-native-camera';
//import Web from "./Web";

let passThroughData = {};
let parentRef = null;

class ScanScreen extends Component {
  componentDidMount(): void {
    debugger;
    // access_Token = this.props.navigation.state.params.accessToken;
    // refresh_Token = this.props.navigation.state.params.refreshToken;
    //
    passThroughData = this.props.navigation.state.params.data;
    parentRef = this.props.navigation.state.params.selfRef;

  }
  onBackPress = () => {
    debugger;


    Alert.alert(
        'QR Camera',
        'Cancelling will required you to manually enter the information',
        [
          {text: 'OK', onPress: () => {
              this.props.navigation.state.params.onCodeCapture(null, passThroughData, parentRef);
              this.props.navigation.goBack();
            }
          },
          {
            text: 'Cancel',
            onPress: () => {
              //cancel called
            },
            style: 'cancel',
          }
        ],
        {cancelable: false},
    );

    // this.props.navigation.state.params.onCodeCapture(e.data, passThroughData, parentRef);
    //
    //
    // this.props.navigation.goBack();

  };

  onSuccess = e => {
    debugger;

    /**
     * e.bounds
     * e.type (should be QR_CODE)
     * e.data (in the format  service:####,amount:####
     * e.rawData (raw encoding)
     */

    this.props.navigation.state.params.onCodeCapture(e.data, passThroughData, parentRef);

    //this.props.on
    // this.props.onlogoutPress();
    // Linking
    //     .openURL(e.data)
    //     .catch(err => console.error('An error occured', err));
    this.props.navigation.goBack();
  };

  // renderBackButton() {
  //     // if (this.props.authentication.loading) {
  //     //     return <ActivityIndicator
  //     //         size='small'
  //     //     />
  //     // } else {
  //     return (
  //         <TouchableOpacity style={{marginTop: 12}}
  //                           onPress={this.onLoginPress}>
  //             <View style={styles.loginView}>
  //                 <Text style={styles.loginText}>
  //                     {loginText}
  //                 </Text>
  //             </View>
  //         </TouchableOpacity>
  //     );
  //     // }
  // }

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess}
        cameraProps={{flashMode: Camera.Constants.FlashMode.auto}}
        topContent={
          <Text style={styles.centerText}>
            Point the camera towards the QR code.
          </Text>
        }
        bottomContent={
          <TouchableOpacity
            style={styles.buttonTouchable}
            onPress={this.onBackPress}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default withNavigation(ScanScreen);
//export default ScanScreen;

//AppRegistry.registerComponent('default', () => ScanScreen);
