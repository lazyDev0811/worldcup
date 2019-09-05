# OpenID_RN

### OpenID Setup
Add Your OpenID configs to `/src/utils/Helpers.js` file as:

```
export const configIOS = {
    issuer: 'YOUR_ISSUER',
    clientId: 'CLIENT_ID',
    redirectUrl: 'REDIRECT_URI',
    scopes: [SCOPES]
};

export const configAndriod = {
    issuer: 'YOUR_ISSUER',
    clientId: 'CLIENT_ID',
    redirectUrl: 'REDIRECT_URI',
    scopes: [SCOPES]
};
```

## **IMPORTANT** : The Latest code is master branch.
