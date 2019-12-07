import React from 'reactn';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  AppState,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import PubSub from 'pubsub-js';
import {
  configIOS,
  configAndriod,
  configShared,
  resetNavigation,
} from '../utils/Helper';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-community/async-storage';
import async from 'async';
import {dexit} from '../assets/sdk/dex-sdk-shim';
import uuid from 'uuid';
import DeviceInfo from 'react-native-device-info';
import ScanScreen from './scan-screen.js';
import {withNavigation} from 'react-navigation';

var selfWeb;

// import { createStackNavigator } from 'react-navigation-stack';
import {NavigationActions, StackActions} from 'react-navigation';

//const hasWebAccell = () => DeviceInfo.getApiLevel() !== 28;

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//import * from '../assets/sdk/dex-sdk-shim';
//const dd = require('../assets/sdk/dex-sdk-shim.js');
import _ from 'lodash';
//import dispatcher from "reactn/types/dispatcher";

//import DexSDK from '../assets/sdk/dex-sdk-shim';
let accessToken = '';

const html = require('./ep-home')();

class Web extends React.Component {
  constructor(props) {
    super(props);
    this.webview = React.createRef();
    this.state = {
      appState: AppState.currentState,
      viewState: 'LOADING',
      epId: '',
      args: {},
      token: '',
      tpId: '',
      email: '',
      refEp: '',
      repo: 'dexitco',
      bcType: 'Store',
      epGoToken: '',
      lastEPId: [],
      showSecondPlayer: false,
      user: {},
      sdkInitialized: false,
      loaded: false,
      key: 1,
      showCamera: false,
    };

    //TODO: should be coming from configuration
    this.proxyAddress = configShared.proxyAddress;
    //this.proxyAddress = 'http://dex-bcc-latest.dexit.co/proxy-api';

    this.args = {
      sdkRequiredServices: {
        scpUrl: this.proxyAddress + '/scp',
        sbUrl: this.proxyAddress + '/sb',
        cbUrl: this.proxyAddress + '/cb',
        ebUrl: this.proxyAddress + '/eb',
        lmUrl: this.proxyAddress + '/lm',
        tpmUrl: this.proxyAddress + '/tpm/',
        lpmUrl: this.proxyAddress + '/lpm',
        epmUrl: this.proxyAddress + '/ep',
        upmUrl: this.proxyAddress + '/upm/user/',
        presentationUrl: this.proxyAddress + '/scprm',
        dexSdkMode: 'EP',
        fetchOnLoad: false,
        epEventId: 'b9022f3f-cf28-43e5-b972-8e1e89bee208',
        epEventKey: '05fcfd31-23df-4b2d-90d5-1c7ebd51e7d3',
        monitorEventId: '0534eee1-c9b3-46fa-949e-1d4cb4cd969d',
        monitorEventKey: '72739b80-3525-4d16-bb37-c0e912de9540',
        bcType: 'Store',
      },
    };

    this.config = null;
    if (Platform.OS === 'ios') {
      this.config = configIOS;
    } else {
      this.config = configAndriod;
    }

    this.dexit = dexit;
    this.uuidsToCb = {};
    selfWeb = this;

    this.bccLib = {
      uuidsToCb: {},
      onMessage: function(str, selfRef) {
        try {
          var obj = JSON.parse(str);
          //next get the id

          let id = obj.id;

          if (id) {
            //get the callback
            let cb = this.uuidsToCb[obj.id];
            if (obj.hasError && obj.error) {
              var error = new Error(obj.error);
              cb(error);
            } else {
              cb();
              try {
                delete this.uuidsToCb[id];
              } catch (e) {
                debugger;
              }
            }
          } else {
            if (obj.op && obj.op === 'dexit.ep.show') {
              debugger;
              let data = obj.data;
              //now call pusub
              if (
                data &&
                data.element &&
                data.element.intelligence &&
                data.element.intelligence.epId &&
                data.element.intelligence.epId.startsWith('1111')
              ) {
                debugger;
                if (data.element.intelligence.epId == '111114') {
                  selfWeb.logoutPress();
                } else if (data.element.intelligence.epId == '111110') {
                  debugger;
                  selfRef.openCamera(data);

                  // selfWeb.openCamera();

                  debugger;
                }
                //alert(data.element.intelligence.epId);
              } else {
                selfWeb.dexit.PubSub.publish('dexit.ep.show', data);
              }
            } else if (obj.op && obj.op === 'dexit.ep.executeBehaviour') {
              //data: { ref:string, scId: scId, behaviourId: behaviourId, args: {args: args, inputs:inputs} } };
              var data = obj.data;
              var sc =
                dexit.scp.device.management.scmanager.smartcontent.object[
                  data.scId
                ];
              var behaviour = sc.behaviour[data.behaviourId];
              var executeArgs = data.args;
              var responseId = data.ref;
              debugger;
              behaviour.executeWithParams(
                executeArgs.args,
                executeArgs.inputs,
                (err, resp) => {

                  selfWeb.bccLib.sendBehaviourResponse(responseId, err, resp);
                },
              );
            } else if (obj.op && obj.op === 'dexit.localfn') {
              var data = obj.data;
              //todo: lookup table
              var localName = data.value;
              var args = data.args;
              var callbackRef = data.callbackRef;

              var dat = {
                callbackRef: callbackRef,
                callbackType: 'postMessage',
              };
              selfWeb[localName](dat);
            } else {
              console.warn('unknown message:' + str);
            }
          }
        } catch (e) {
          debugger;
        }
      },
      resetAll: function() {
        const run = `
            setTimeout(() => {
              bccLib.resetAll();
              console.log('bccLib.resetAll()');
            }, 100);
            true;`;
        selfWeb.sendMessage(run);
      },


      sendBehaviourResponse: function(id, err, data) {
        let obj = {
          error: err,
          data: data
        };
        let objStr = JSON.stringify(obj);
        const run = `setTimeout(function() {
              let objStr = '${objStr}';
              let id = '${id}';
              try { 
                let obj = JSON.parse(objStr);
                bccLib.handleBehaviourResponse(id, obj);
              }catch(e){}
            }, 10);
            true;`;
        selfWeb.sendMessage(run);
      },

      setDeviceId: function(id) {
        const run = `
            setTimeout(function() {
              let id = '${id}';
              try { 
                bccLib.setDeviceId(id);
              }catch(e){}
            }, 10);
            true;`;
        selfWeb.sendMessage(run);
      },

      setUser: function(obj) {
        let objStr = JSON.stringify(obj);
        const run = `
            setTimeout(function() {
              let objStr = '${objStr}';
              try { 
                let obj = JSON.parse(objStr);
                bccLib.setUser(obj);
              }catch(e){}
            }, 10);
            true;`;
        selfWeb.sendMessage(run);
      },
      setErrorStatus: function(err) {
        debugger;

        var errStr = err.message;
        const run = `
            setTimeout(() => {
              bccLib.setErrorStatus(${errStr});
            }, 100);
            true;`;
        selfWeb.sendMessage(run);
      },
      show: function(obj, callback) {
        let id = uuid.v4();
        try {
          //FIXME:  remove invalid json that is not used based on serialize/de-serialzation
          if (obj.nextElement && obj.nextElement.ds) {
            delete obj.nextElement.ds;
          }
          var objStr = JSON.stringify(obj);

          const run = `
         setTimeout(() => {
              var toShow = ${objStr};

              bccLib.show('${id}', toShow, function(err) {
                //msg back here
                //alert('showing');
              });
            }, 10);
          `;

          selfWeb.sendMessage(run);
          this.uuidsToCb[id] = callback;
        } catch (e) {
          console.log('invalid json');
        }
      },
      prepareMasterContainer: function(layoutId, container, layoutHtml) {
        const layoutHtml2 = layoutHtml.replace(/\r?\n|\r/g, '');

        const run = `
             setTimeout(() => {
                var layoutId = '${layoutId}';
                var container = '${container}';
                var layoutHtml = '${layoutHtml2}';
                bccLib.prepareMasterContainer(layoutId, container, layoutHtml);
                //alert('preparing layout');
            }, 10);
            `;
        selfWeb.sendMessage(run);
        //self.sendMessage(JSON.stringify([layoutId,container, layoutHtml]));
      },
    };
  }

  // componentDidMount() {
  //   this._prepare();
  // }
  componentDidMount() {
    debugger;

    if (this.state.loaded) {
      this.state.setState({loaded: false});
    }
    // alert('loading');
    this._prepare()
      .then(loaded => {
        console.log('loading');
        // alert('loaded');
        //this._asyncLoad = null;
        //this.setState({loaded: true});
      })
      .catch(e => {
        console.log(e);
        debugger;
        alert('problem loading...please reload app');
      });
    AppState.addEventListener('change', () => this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', () => this._handleAppStateChange);
  }
  _handleAppStateChange(nextAppState) {
    debugger;
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      let key = this.state.key;
      this.setState({key: key + 1});
    }
    this.setState({appState: nextAppState});
  }

  // componentWillMount() {
  //   this._asyncLoad = this._prepare().then(loaded => {
  //     this._asyncLoad = null;
  //     this.setState({loaded: true});
  //   });
  // }
  // componentWillUnmount() {
  //   if (this._asyncLoad) {
  //     this._asyncLoad.cancel();
  //   }
  // }

  openCamera = data => {
    debugger;
    const {navigation} = this.props;


    const navigateAction = NavigationActions.navigate({
      routeName: 'QRScreen',
      params: {onCodeCapture: this.onCodeCapture, data: data, selfRef: selfWeb},
      // action: NavigationActions.navigate({ routeName: 'ScanScreen' }),
    });
    navigation.navigate(navigateAction);

    this.setState({showCamera: true});
  };

  _prepare = async () => {
    //accessToken = this.props.navigation.state.params.accessToken;
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      //debugger;
      if (!accessToken) {
        alert('no access token');
        return false;
      } else {
        console.log(accessToken);
        //alert(JSON.stringify(accessToken));
        //decode the token

        let decoded = jwtDecode(accessToken);

        //email: 'jake.vauden@dexit.co', //'//decoded.email || 'jake.vauden@dexit.co',
        this.setState({
          email: decoded.email,
        });
      }
    } catch (err) {
      debugger;
      alert(err);
    }

    let self = this;
    if (!self.epGoToken) {
      self.epGoToken = PubSub.subscribe('dexit.ep.go', function(msg, data) {
        if (data && data.element && data.element.intelligence) {
          //1: unload current EP (data.element.epId), and wait
          //2: load new element
          debugger;
          self.showLoadingIndicator();
          self.goToEP(data.element.intelligence, data.element.epId);
        }
      });
    }
    //TODO: remove hardcode

    //const proxyAddress = 'http://dex-bcc.herokuapp.com/proxy-api';
    //let proxyAddress = 'https://localhost:5050/proxy-api';

    var args = this.args || {};
    let username = this.state.email.toLowerCase();
    let user = {};

    if (username && username === 'jake.vauden@dexit.co') {
      args.user = {
        id: '4371',
        role: 'default',
        user: 'jake.vauden@dexit.co',
        tenant: 'dexit.co',
        name: 'jake.vauden@dexit.co',
        attributes: {
          fullName: 'Jake Vauden',
          lastName: 'Vauden',
          firstName: 'Jake',
          role: 'subscriber,salesManager',
          location: 'Montreal',
          picture:
            'https://s3.amazonaws.com/resource.dexit.co/img/demo/profiles/profile_jake.jpg',
          discount: '0.20',
          usage: {'Minutes Remaining': 35, 'Minutes Used': 110},
          accountUsage:
            'https://s3.amazonaws.com/resource.dexit.co/img/demo/profiles/jake-account-usage.jpg',
          age: 30,
          segment: 'C',
          ageSegment: '30-60',
          incomeSegment: '50plus',
        },
        emails: [{value: 'jake.vauden@dexit.co'}],
        networks: [
          {
            id: '4901',
            network_user: 'AbyDD4XftjqYDu50',
            type: 'people',
            parent_network: null,
            description: 'facebook_business_user_network',
            dex_user: '4371',
            name: 'facebook_business_user',
            channel_instance: null,
          },
          {
            id: '4911',
            network_user: '1696498387244542',
            type: 'people',
            parent_network: null,
            description: 'facebook_network',
            dex_user: '4371',
            name: 'facebook',
            channel_instance: null,
          },
          {
            id: '6651',
            network_user: '1727579184136462',
            type: 'people',
            parent_network: null,
            description: 'facebook_network',
            dex_user: '4371',
            name: 'facebook',
            channel_instance: null,
          },
        ],
      };
    } else if (username && username === 'johnny.five@dexit.co') {
      args.user = {
        id: '10661',
        role: 'default',
        user: 'johnny.five@dexit.co',
        tenant: 'dexit.co',
        name: 'johnny.five@dexit.co',
        attributes: {
          firstName: 'Johnny',
          lastName: 'Five',
          role: 'subscriber,salesManager',
          fullName: 'Johnny Five',
          discount: '0.29',
          ageSegment: '25-34',
          accountUsage:
            'https://s3.amazonaws.com/resource.dexit.co/img/demo/profiles/johnny-account-usage.jpg',
          picture:
            'https://s3.amazonaws.com/resource.dexit.co/img/demo/profiles/profile_johnny.jpg',
          usage: {
            'Minutes Remaining': 135,
            'Minutes Used': 210,
          },
          age: 30,
          location: 'London',
          segment: 'A',
        },
      };
    } else {
      args.user = {
        id: '7201',
        role: 'default',
        user: 'dave_epa_admin@dexit.co',
        tenant: 'dexit.co',
        name: 'dave_epa_admin@dexit.co',
        attributes: {
          firstName: 'Dave',
          lastName: 'Stuart',
          role:
            'executive,subscriber,productManager,marketingManager,mom,msm,cem,retailer,salesManager',
          discount: '0.50',
          usage: {
            'Minutes Remaining': 335,
            'Minutes Used': 310,
          },
          fullName: 'Dave Thomas',
          picture:
            'https://s3.amazonaws.com/resource.dexit.co/img/demo/profiles/profile_dave.jpg',
          accountUsage:
            'https://s3.amazonaws.com/resource.dexit.co/img/demo/profiles/dave-account-usage.jpg',
          age: 45,
          location: 'Toronto',
          segment: 'C',
        },
      };
    }

    this.setState({user: args.user});
    //alert('setting user:' + JSON.stringify(args.user));

    if (!self.dexit) {
      alert('warning...could not load....please restart the app');
    }

    // self.dexit.ep.lib.profile = {
    //   user: user.args,
    // };
    // this.dexit.ep.lib.profile.user = args.user;
    dexit.ep.lib.profile.user = args.user;

    try {
      //set proxy url
      self.dexit.bccProxyUrl = this.proxyAddress;
      dexit.bccProxyUrl = this.proxyAddress;
    } catch (e) {
      console.log('failed to load sdk config');
    }
    // args.ice4mBCs = '';

    this.args = args;
    // this.setState({args: args});
    //this.args = args;
    //this.user = args.user;
    this.init();
  };

  doRefresh(event) {
    this.goMain();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  async getData(token = '', url = '') {
    let result = await fetch(url, {
      method: 'get',
      //cache: 'no-cache',
      cache: 'default',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
    debugger;
    if (result.status === 200) {
      //let a = await  result.text();
      return await result.json();
      //return a;
    } else {
      throw new Error('unrecognized response content type');
    }
  }

  getToken(callback) {
    AsyncStorage.getItem('accessToken', callback);
    // .done(data => {
    //   callback(null, data);
    // })
    // .catch(error => {
    //   callback(error);
    // });
  }

  init() {
    this.getToken((err, token) => {
      if (err) {
        alert('Please login again');
        //TODO: go back, navigate to login

        return;
      }
      let self = this;

      self.setState({token: token});
      // var args = this.args;//{...this.state.args};

      self.args.authToken = token;

      // args.authToken = token;
      //self.setState({args: args});
      // this.args = args;

      //self.args.authToken = token;

      self.initializeSDK(this.config.channelUrl, err => {
        if (err) {
          console.log('error %o', err);
          return;
        }

        dexit.device.sdk.setParentRef(self);

        dexit.device.sdk.setAuthToken(token);

        dexit.device.sdk.presentationMng.multimediaHandler.setUser({
          id: self.state.user.id,
          name: self.state.user.name,
        });

        //self.channelUrl = 'http://bcc-mobile-app.dexit.co';

        //self.channelUrl = 'http://bcc-mobile.dexit.co';
        //let tpId = '16ec52c5-fd54-4613-b5be-5c604af20018';

        self.tpId = dexit.device.sdk.getTouchpoint().touchpoint;
        let tpId = dexit.device.sdk.getTouchpoint().touchpoint;

        dexit.device.sdk.unloadEngagementPatterns(err2 => {
          if (err2) {
            // eslint-disable-next-line no-debugger
            debugger;
          }

          self.loadPortal(tpId, '', function(err) {
            console.log(err);
          });
        });
      });
    });
  }

  getExpireDate(expireInMinutes) {
    const now = new Date();
    let expireTime = new Date(now);
    expireTime.setMinutes(now.getMinutes() + expireInMinutes);
    return expireTime;
  }

  async loadEPCached(token, tpId, expireInMinutes = 60) {
    //debugger;
    let url =
      configShared.dispatcherUrl +
      '/dispatch?touchpoint=' +
      encodeURIComponent(tpId);
    let data = null;
    let value = await AsyncStorage.getItem(url);

    let resp = null;
    debugger;
    try {
      resp = JSON.parse(value);
    } catch (e) {
      resp = null;
    }

    // there is data in cache && cache is expired
    if (
      resp !== null &&
      resp.data &&
      resp.expireAt &&
      new Date(resp.expireAt) < new Date()
    ) {
      //clear cache
      AsyncStorage.removeItem(url);
      //update res to be null
      data = null;
    } else {
      data = resp && resp.data ? resp.data : null;
      console.log('read data from cache ');
    }

    //update cache + set expire at date
    if (data === null) {
      debugger;

      let dataResp = await this.getData(this.state.token, url);
      debugger;
      //set expire at
      let found = _.filter(dataResp, {touchpoint: tpId});
      //FIXME:
      let ep = found.length > 0 ? found[found.length - 1].epId : null;

      if (!ep) {
        throw new Error('no valid ep found');
      }

      let toStore = {
        expireAt: this.getExpireDate(expireInMinutes),
        data: ep,
      };

      //stringify object
      const objectToStore = JSON.stringify(toStore);
      //store object
      AsyncStorage.setItem(url, objectToStore);
      return ep;
      //set in cache
    } else {
      //debugger;
      return data;
    }
  }
  showLoadingIndicator() {
    this.setState({loaded: false});
  }

  hideLoadingIndicator() {
    // if (!this.state.loaded) {
    this.setState({loaded: true});
    // }
  }
  loadPortal(tpId, bcType, callback) {
    let self = this;
    // eslint-disable-next-line
    this.lastEPId = [];
    this.showSecondPlayer = false;

    //FIXME
    this.bccLib.resetAll();
    this.bccLib.setUser({id: self.state.user.id, name: self.state.user.name});

    //this.getData(
    this.loadEPCached(this.state.token, tpId)
      .then(ep => {
        // eslint-disable-next-line no-debugger

        //console.log(data);
        // let ep = (data && data.length > 0 ? data[0].epId : null);

        // let found = _.filter(data, {touchpoint: tpId});
        //
        // //FIXME:
        // //let ep = '234223';
        //
        // if (found.length > 0) {
        //   var ep = found[found.length - 1].epId;
        // }

        if (!ep) {
          console.log('no SC could be loaded');
          self.bcloaded = true;
          callback(new Error('could not load'));
        } else {
          self.bcloaded = true;
          debugger;

          //ep = '234707';

          self._showSubscriberEP(ep, this.refEp);
          callback();
        }
      })
      .catch(err => {
        debugger;
        console.log('no SC could be loaded: ' + JSON.stringify(err));
        self.bcloaded = true;
        callback(err);
      });
  }

  initializeSDK(channelUrl, callback) {
    let self = this;
    let args = self.args; //{...this.state.args};
    /* set config */
    if (!args.sdkRequiredServices) {
      return callback(new Error('missing configuration. Cannot load sdk'));
    }

    //don't load in push mode
    var sdkConfig = _.omit(args.sdkRequiredServices, [
      'epEventId',
      'epEventKey',
    ]);
    sdkConfig.channelUrlResolutionFunction = function() {
      return channelUrl;
    };
    sdkConfig.userResolutionFunction = function() {
      return args.user.id;
    };

    if (this.state.token) {
      sdkConfig.authToken = this.state.token;
    }

    sdkConfig.repository = this.config.repo;
    //RE-4 pass mainVM in sdkConfig
    if (!sdkConfig.reportEngine) {
      sdkConfig.reportEngine = self; //TODO: should be an independent module
    }

    /**
     *FIXME: self.sdkInitialized is not persisted across screen loads so this
     * is always false.  Moved to logout to force issue for now
     */
    var sdkInitialized = this.state.sdkInitialized;

    if (sdkInitialized) {
      //unload previous SDK and initialize agian.
      dexit.device.sdk.unload(err => {
        if (err) {
          console.log('warning error unloading');
        }
        self.runInitialize(sdkConfig, callback);
      });
    } else {
      self.runInitialize(sdkConfig, callback);
    }
  }
  runInitialize(sdkConfig, callback) {
    let self = this;
    var config = _.extend({}, sdkConfig);
    config.presentationPlugin = this.bccLib;

    dexit.device.sdk.initialize(config, err => {
      if (err) {
        if (err.message && err.message === 'SDK already initialized') {
          self.setState({sdkInitialized: true});
          return callback();
        } else {
          console.log('could not init sdk');
          return callback(err);
        }
      }

      self.setState({sdkInitialized: true});

      //self.sdkInitialized = true;
      callback();
    });
  }

  _showSubscriberEP(epId, refEp = '') {
    //
    // this.tpId = dexit.device.sdk.getTouchpoint().touchpoint;
    // console.log('tpId');
    // this.loadPortal(this.tpId, this.bcType, (err) => {
    //     if (err) {
    //         console.error('error',err)
    //     }
    //     console.log('done');
    // });


    let epToUse = refEp || epId;
    dexit.device.sdk.loadEngagementPattern(epToUse, null, function(err) {
      if (err) {
        debugger;
        console.log('error loading', err);
        //TODO: show error

        alert('failed to load pattern:' + epToUse);
        alert(JSON.stringify(err));
        //self.showFlashWarning('There was a problem with the configured portal');
      }
    });
  }

  goToEP(toLoad, previousEPId) {
    //load promo player for subscriber on main dashboard
    // if (self.currPortal() === 'subscriber') {
    let self = this;
    let epId = toLoad.epId;

    // eslint-disable-next-line no-debugger
    //debugger;

    this.bccLib.resetAll();
    //reset uccVM observables
    //load engagement pattern
    //dexit.device.sdk.unloadEngagementPattern(null,function(err) {

    //make 2nd player show that will hide original while this one executes
    this.showSecondPlayer = true;

    async.auto(
      {
        unload: function(cb) {
          if (previousEPId) {
            self.lastEPId.push(previousEPId);
            dexit.device.sdk.unloadEngagementPattern(previousEPId, function(
              err,
            ) {
              if (err) {
                console.log(
                  'warning:error unloading pattern %s . It may be safe to ignore this message: %o',
                  previousEPId,
                  err,
                );
              }
              cb();
            });
          } else {
            cb();
          }
        },
        load: [
          'unload',
          function(results, cb) {
            dexit.device.sdk.loadEngagementPattern(epId, null, function(err) {
              cb(err);
            });
          },
        ],
      },
      function(err) {
        debugger;
        self._handleLastOnDone(err);
      },
    );
  }
  _handleLastOnDone(err) {
    let self = this;
    if (err) {
      //could not load engagement pattern
      //due to not found, not active etc.
      console.log('warning:error loading pattern');
      this.lastEPId = [];
      this.goMain();
      return;
    }

    var last = this.lastEPId.pop();

    if (last) {
      //reload it
      //TODO: make sure to resume execution:

      dexit.device.sdk.loadEngagementPatternParams(
        {epId: last, resume: true},
        this._handleLastOnDone,
      );
    } else {
      this.goMain();
    }
  }
  goMain() {
    var self = this;
    self.lastEPId = [];
    dexit.device.sdk.unloadEngagementPatterns(function(err) {
      if (err) {
        console.log(
          'warning:error unloading pattern. It may be safe to ignore this message',
        );
      }
      self.loadPortal(self.tpId, '', function(err) {
        console.log(err);
      });
    });
  }

  handleMessage(event) {
    if (event.nativeEvent.data) {
      this.bccLib.onMessage(event.nativeEvent.data, this);
    }
  }

  onCodeCapture(data, passThroughData, selfRef) {
    //pass in the data
    //alert('QR data:' + data);
    debugger;
    if (passThroughData && passThroughData.callbackRef) {
      if (data && _.isString(data)) {
        try {
          data = JSON.parse(data);
        } catch (e) {}
      }
      selfRef.bccLib.sendBehaviourResponse(
        passThroughData.callbackRef,
        null,
        data,
      );
    }

    console.log(data);


    debugger;

    //TODO: use passThroughData to decide next action
  }

  sendMessage(data) {
    let self = this;

    if (!self.webview.current) {
      // if (!this.webref) {
      debugger;
      // alert('no webRef');

      //enforce wait
      setTimeout(function() {
        self.sendMessage(data);
      }, 200);
    } else {
      //setTimeout(function() {
      self.webview.current.injectJavaScript(data);
      //}, 100);
    }
  }
  logError(err) {
    console.log(err);
    alert('there was an error:' + JSON.stringify(err));
  }

  logoutPress = () => {
    this.props.onlogoutPress();
  };

  render() {
    // debugger;
    // const run = `
    //       document.body.style.backgroundColor = 'blue';
    //       true;
    //     `;
    //
    // const run2 = `
    //       document.body.style.backgroundColor = 'white';
    //       true;
    //     `;
    //
    // setTimeout(() => {
    //   this.sendMessage(run);
    //   // this.webref.injectJavaScript(run);
    //
    //   setTimeout(() => {
    //     this.sendMessage(run2);
    //     //this.webref.injectJavaScript(run2);
    //   }, 3000);
    // }, 3000);

    // var html = require('./ep-home');

    // if (!this.state.loaded || this.state.viewState === 'LOADING') {
    //   // return (
    //   //   <View style={styles.container}>
    //   //     <Text style={{fontWeight: 'bold'}}>Loading</Text>
    //   //
    //   //   </View>
    //   // );
    //   return (
    //       <ActivityIndicator
    //           color='#009688'
    //           size='large'
    //           style={styles.ActivityIndicatorStyle}
    //       />
    //   );
    // } else {
    //var html = this.props.html; //this.props  require('./ep-home');
    return (
      <View style={{flex: 1}}>
        <WebView
          originWhitelist={['*']}
          //ref={r => (this.webref = r)}
          ref={this.webview}
          // source={{html: '<div id="merch-container">Hello there</div>'}}
          // source={{html: require('./ep-home')()}}
          onLoadStart={() => {
            this.showLoadingIndicator();
            this.setState({viewState: 'LOADING'});
            //this.webview.current.setState({viewState: 'LOADING'});
          }}
          mediaPlaybackRequiresUserAction={false}
          source={{html: html}}
          onLoadEnd={() => {
            //debugger;
            this.setState({viewState: 'LOADED'});
          }}
          onError={err => this.logError(err)}
          onMessage={event => {
            this.handleMessage(event);
          }}
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          key={this.state.key}
          cacheMode={'LOAD_CACHE_ELSE_NETWORK'}
          injectedJavaScript={`
          $('body').scrollTop({0});`}
          //renderLoading={this.ActivityIndicatorLoadingView}
          //startInLoadingState
        />
        {!this.state.loaded && (
          <ActivityIndicator
            color="#009688"
            size="large"
            style={styles.ActivityIndicatorStyle}
          />
        )}

        {/*{!this.state.showCamera &&*/}
        {/*<View style={styles.CameraViewIndicator}>*/}
        {/*  <ScanScreen style={{flex: 1}} onCodeCapture={this.onCodeCapture} />*/}
        {/*</View>}*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: wp('99%'),
  },
  containerWeb: {
    flex: 1,
    width: wp('99%'),
  },

  ActivityIndicatorStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF88',
  },
  CameraViewIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default withNavigation(Web);
