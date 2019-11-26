import {checkTokenValid} from './Helper';
import AsyncStorage from "@react-native-community/async-storage";

function isString(myVar) {
  return typeof myVar === 'string' || myVar instanceof String;
}

export default class AuthHandler {
  isTokenValid(token) {
    return checkTokenValid(token);
  }

  scheduleRefresh(time, token) {
    setTimeout(async () => {
      // eslint-disable-next-line no-debugger
      debugger;
      if (isString(token)) {
        token = JSON.parse(token);
      }

      let resp = await this.refreshToken(token.refresh_token);

      let responseData = await resp.json();
      // eslint-disable-next-line no-console
      console.log(responseData);
      AsyncStorage.setItem('accessToken', responseData.access_token);
      AsyncStorage.setItem('refreshToken', responseData.refresh_token);

      let expires = parseInt(responseData.expires_in) - 120;
      this.scheduleRefresh(expires, responseData);
    }, time);
    // }
  }

  async getAccessToken() {
     return AsyncStorage.getItem('accessToken');
     // AsyncStorage.setItem('refreshToken', refreshToken)
    // return AsyncStorage.getItem('')
    //   window.localStorage.getItem('token');
  }

  async getRefreshToken() {
      AsyncStorage.getItem('refreshToken');
  }

  async refreshToken(token, clientId) {
    let body = {
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: token,
    };

    let formBody = this._encodeFormBody(body);

    return fetch(
      'https://sso-latest-test.dexit.co/auth/realms/dexit.co/protocol/openid-connect/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
      },
    );
  }

  _encodeFormBody(body) {
    let formBody = [];
    for (let property in body) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(body[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    return formBody;
  }

  async login(body) {
    let formBody = this._encodeFormBody(body);
    return fetch(
      'https://sso-latest-test.dexit.co/auth/realms/dexit.co/protocol/openid-connect/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
      },
    );
  }
}
