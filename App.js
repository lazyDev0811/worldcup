/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {View, Alert} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { rootNavigator } from './src/router/Router';
import React from 'reactn';

const Container = createAppContainer(rootNavigator);
import NetInfo from '@react-native-community/netinfo';
import { Dialog } from 'react-native-simple-dialogs';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dialogVisible: false
    }
  }

  componentDidMount() {
    var self = this;
    NetInfo.addEventListener(state => {
      console.log("Is connected?", state.isConnected);
      setTimeout(function () {
        if (state.isConnected) {
          self.setState({
            dialogVisible: false
          });
        } else {
          self.setState({
            dialogVisible: true
          });
        }
      }, 3000);
    });
  }

  renderDialog() {
    return (
      <Dialog
        visible={this.state.dialogVisible}
        title="Internet connection not available.  Please reconnect to continue">
      </Dialog>
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
