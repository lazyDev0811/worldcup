/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {View, Alert, AppState} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {rootNavigator} from './src/router/Router';
import React from 'reactn';

const Container = createAppContainer(rootNavigator);
import NetInfo from '@react-native-community/netinfo';
import {Dialog} from 'react-native-simple-dialogs';
import AsyncStorage from '@react-native-community/async-storage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false,
      appState: AppState.currentState,
    };
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async nextAppState => {
    this.setState({appState: nextAppState});

    const {navigation} = this.props;

    if (nextAppState === 'background' || nextAppState === 'inactive') {
      // Do something here on app background.
      console.log('*******APP: going to Background Mode.*****');


      // const varx = navigation.getParam('paramSaveState', null);



``
    } else {
      console.log('*******APP: nextAppState ' + nextAppState + '*****');
    }

    if (nextAppState === 'active') {
      // Do something here on app active foreground mode.
      console.log('App is in Active Foreground Mode.');
      let s = await AsyncStorage.getItem('appState')
      console.log('appState:' + s);
    }
    //
    // if (nextAppState === 'inactive') {
    //   // Do something here on app inactive mode.
    //   console.log("App is in inactive Mode.")
    // }
  };

  componentDidMount() {
    var self = this;
    NetInfo.addEventListener(state => {
      console.log('Is connected?', state.isConnected);
      setTimeout(function() {
        if (state.isConnected) {
          self.setState({
            dialogVisible: false,
          });
        } else {
          self.setState({
            dialogVisible: true,
          });
        }
      }, 3000);
    });

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  renderDialog() {
    return (
      <Dialog
        visible={this.state.dialogVisible}
        title="Internet connection not available.  Please reconnect to continue"
      />
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.renderDialog()}
        <Container />
      </View>
    );
  }
}
export default App;
