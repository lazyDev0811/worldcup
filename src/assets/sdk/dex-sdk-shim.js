import _ from 'lodash';
import moment from 'moment';
import PubSub from 'pubsub-js';
//import $ from 'jquery';
// export for others scripts to use

import Graph from 'graph.js';
import async from 'async';
//import lscache from 'lscache';
import SockJS from 'sockjs-client'
import AsyncStorage from '@react-native-community/async-storage';
import MobileDetect from './mobile-detect';

import jquery from 'jquery';

import { Dimensions } from 'react-native'


import { getDeviceInfo } from './mobile-detect2.js'

///const cio = require("cheerio");

window.jQuery = jquery;
window.$ = jquery;


// Create Base64 Object
const Base64 = {


    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",


    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },


    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = 0;
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}




/*! Copyright Digital Engagement Xperience 2018 dex-sdk -v0.7.1-2 2018-05-17, 5:14:03 PM  Licensed Private */
/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */

var dexit = {};

/**
 * alias
 * @type {{}}
 */
dexit.PubSub = PubSub;


if (!('localStorage' in window)) {
// if (!Modernizr.localstorage) {
    window.localStorage = {
        _data       : {},
        setItem     : function(id, val) { return this._data[id] = String(val); },
        getItem     : function(id) { return this._data.hasOwnProperty(id) ? this._data[id] : undefined; },
        removeItem  : function(id) { return delete this._data[id]; },
        clear       : function() { return this._data = {}; }
    };
}

/* check for top level namespace */
// if (!dexit) {
//     var dexit = {};
// }
if(dexit.scp === undefined){
    dexit.scp={};
}

if(!dexit.scp.device){
    dexit.scp.device={};
}
dexit.scp.device.registration={};


//deault to none
dexit.bccProxyUrl = '';


/**
 * Register
 * @param config
 * @constructor
 */
dexit.scp.device.registration.Configuration = function(config) {

    // "use strict";
    //SCP Endpoint
    var tenant = config.tenant || '',
        cbUrl = config.cbUrl || '',
        authToken =config.authToken || '';

    this.getEndPoints = function () {
        var obj ={
            cb : cbUrl
        };
        return obj;
    };

    this.getTenant = function () {
        return tenant;
    };

    this.setTenant = function (t) {
        tenant = t;
    };

    this.getAuthToken = function() {
        return "Bearer " + authToken;
    }
    this.setAuthToken = function(token) {
        authToken = token;
    }

};


dexit.scp.device.registration.loadConfiguration = function(config) {
    if (!config) {
        throw new Error("Configuration is required")
    }
    dexit.scp.device.registration.config = new dexit.scp.device.registration.Configuration(config);
};

/*jslint devel: true */
/*jslint nomen: true */
if (!dexit.scp.device.registration.backend) {
    dexit.scp.device.registration.backend = {};
}
dexit.scp.device.registration.backend.Cb= function() {

    var self = this;
    this.createGuid = function ()
    {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };

    this.getAuthToken = function() {
        return dexit.scp.device.registration.config.getAuthToken();
    };

    this.registerDevice = function (device, callback) {
        var uuid =self.createGuid();
        console.log("URL:"+dexit.scp.device.registration.config.getEndPoints().cb);
        var body= {
            name : uuid,
            description:'device',
            attributes: device
        };

        let request = new Request(dexit.scp.device.registration.config.getEndPoints().cb+ '/resources/' + uuid, {
            method: 'put',
            credentials: 'same-origin',
            headers: {
                "Authorization":self.getAuthToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        fetch(request).then((res) => {
            if (res.status == 200 || res.status == 204) {
                console.log("resource:device registration, action:register device,uuid:" + uuid + "," +
                    " message:device registered");
                callback(null, uuid);
            }else {
                let error = new Error('failed to register');
                console.log("resource:device registration, action:register device, error:" + err.message);
                callback(error);
            }
        }).catch((err) => {
            console.log("resource:device registration, action:register device, error:" + JSON.stringify(err));
            callback(err);
        })

        // $.ajax({
        //     type: "PUT",
        //     //TODO: uuid should be returned from service
        //     url: dexit.scp.device.registration.config.getEndPoints().cb+ '/resources/' + uuid,
        //     data: JSON.stringify(body),
        //     crossDomain: true,
        //     contentType: 'application/json',
        //     beforeSend: function (xhr) {
        //         xhr.setRequestHeader("Authorization", self.getAuthToken());
        //     }
        // }).done(function (data) {
        //     console.log("resource:device registration, action:register device,uuid:"+uuid+"," +
        //         " message:device registered");
        //     callback(null,uuid);
        // }).fail(function (xhr, textStatus, errorThrown) {
        //     console.warn("resource:device registration, action:register device, error:" + JSON.stringify(xhr));
        //     callback(xhr);
        //
        // });

    };
};

dexit.scp.device.registration.backend.cb = new dexit.scp.device.registration.backend.Cb();
//
// // THIS FILE IS GENERATED - DO NOT EDIT!
// /*global module:false*/
//
// (function (exports, undefined) {
//     // 'use strict';
//
//     var mobileDetectRules = {
//         "phones": {
//             "iPhone": "\\biPhone.*Mobile|\\biPod",
//             "BlackBerry": "BlackBerry|\\bBB10\\b|rim[0-9]+",
//             "HTC": "HTC|HTC.*(Sensation|Evo|Vision|Explorer|6800|8100|8900|A7272|S510e|C110e|Legend|Desire|T8282)|APX515CKT|Qtek9090|APA9292KT|HD_mini|Sensation.*Z710e|PG86100|Z715e|Desire.*(A8181|HD)|ADR6200|ADR6400L|ADR6425|001HT|Inspire 4G|Android.*\\bEVO\\b|T-Mobile G1",
//             "Nexus": "Nexus One|Nexus S|Galaxy.*Nexus|Android.*Nexus.*Mobile",
//             "Dell": "Dell.*Streak|Dell.*Aero|Dell.*Venue|DELL.*Venue Pro|Dell Flash|Dell Smoke|Dell Mini 3iX|XCD28|XCD35|\\b001DL\\b|\\b101DL\\b|\\bGS01\\b",
//             "Motorola": "Motorola|\\bDroid\\b.*Build|DROIDX|Android.*Xoom|HRI39|MOT-|A1260|A1680|A555|A853|A855|A953|A955|A956|Motorola.*ELECTRIFY|Motorola.*i1|i867|i940|MB200|MB300|MB501|MB502|MB508|MB511|MB520|MB525|MB526|MB611|MB612|MB632|MB810|MB855|MB860|MB861|MB865|MB870|ME501|ME502|ME511|ME525|ME600|ME632|ME722|ME811|ME860|ME863|ME865|MT620|MT710|MT716|MT720|MT810|MT870|MT917|Motorola.*TITANIUM|WX435|WX445|XT300|XT301|XT311|XT316|XT317|XT319|XT320|XT390|XT502|XT530|XT531|XT532|XT535|XT603|XT610|XT611|XT615|XT681|XT701|XT702|XT711|XT720|XT800|XT806|XT860|XT862|XT875|XT882|XT883|XT894|XT901|XT907|XT909|XT910|XT912|XT928|XT926|XT915|XT919|XT925",
//             "Samsung": "Samsung|SGH-I337|BGT-S5230|GT-B2100|GT-B2700|GT-B2710|GT-B3210|GT-B3310|GT-B3410|GT-B3730|GT-B3740|GT-B5510|GT-B5512|GT-B5722|GT-B6520|GT-B7300|GT-B7320|GT-B7330|GT-B7350|GT-B7510|GT-B7722|GT-B7800|GT-C3010|GT-C3011|GT-C3060|GT-C3200|GT-C3212|GT-C3212I|GT-C3262|GT-C3222|GT-C3300|GT-C3300K|GT-C3303|GT-C3303K|GT-C3310|GT-C3322|GT-C3330|GT-C3350|GT-C3500|GT-C3510|GT-C3530|GT-C3630|GT-C3780|GT-C5010|GT-C5212|GT-C6620|GT-C6625|GT-C6712|GT-E1050|GT-E1070|GT-E1075|GT-E1080|GT-E1081|GT-E1085|GT-E1087|GT-E1100|GT-E1107|GT-E1110|GT-E1120|GT-E1125|GT-E1130|GT-E1160|GT-E1170|GT-E1175|GT-E1180|GT-E1182|GT-E1200|GT-E1210|GT-E1225|GT-E1230|GT-E1390|GT-E2100|GT-E2120|GT-E2121|GT-E2152|GT-E2220|GT-E2222|GT-E2230|GT-E2232|GT-E2250|GT-E2370|GT-E2550|GT-E2652|GT-E3210|GT-E3213|GT-I5500|GT-I5503|GT-I5700|GT-I5800|GT-I5801|GT-I6410|GT-I6420|GT-I7110|GT-I7410|GT-I7500|GT-I8000|GT-I8150|GT-I8160|GT-I8190|GT-I8320|GT-I8330|GT-I8350|GT-I8530|GT-I8700|GT-I8703|GT-I8910|GT-I9000|GT-I9001|GT-I9003|GT-I9010|GT-I9020|GT-I9023|GT-I9070|GT-I9082|GT-I9100|GT-I9103|GT-I9220|GT-I9250|GT-I9300|GT-I9305|GT-I9500|GT-I9505|GT-M3510|GT-M5650|GT-M7500|GT-M7600|GT-M7603|GT-M8800|GT-M8910|GT-N7000|GT-S3110|GT-S3310|GT-S3350|GT-S3353|GT-S3370|GT-S3650|GT-S3653|GT-S3770|GT-S3850|GT-S5210|GT-S5220|GT-S5229|GT-S5230|GT-S5233|GT-S5250|GT-S5253|GT-S5260|GT-S5263|GT-S5270|GT-S5300|GT-S5330|GT-S5350|GT-S5360|GT-S5363|GT-S5369|GT-S5380|GT-S5380D|GT-S5560|GT-S5570|GT-S5600|GT-S5603|GT-S5610|GT-S5620|GT-S5660|GT-S5670|GT-S5690|GT-S5750|GT-S5780|GT-S5830|GT-S5839|GT-S6102|GT-S6500|GT-S7070|GT-S7200|GT-S7220|GT-S7230|GT-S7233|GT-S7250|GT-S7500|GT-S7530|GT-S7550|GT-S7562|GT-S7710|GT-S8000|GT-S8003|GT-S8500|GT-S8530|GT-S8600|SCH-A310|SCH-A530|SCH-A570|SCH-A610|SCH-A630|SCH-A650|SCH-A790|SCH-A795|SCH-A850|SCH-A870|SCH-A890|SCH-A930|SCH-A950|SCH-A970|SCH-A990|SCH-I100|SCH-I110|SCH-I400|SCH-I405|SCH-I500|SCH-I510|SCH-I515|SCH-I600|SCH-I730|SCH-I760|SCH-I770|SCH-I830|SCH-I910|SCH-I920|SCH-I959|SCH-LC11|SCH-N150|SCH-N300|SCH-R100|SCH-R300|SCH-R351|SCH-R400|SCH-R410|SCH-T300|SCH-U310|SCH-U320|SCH-U350|SCH-U360|SCH-U365|SCH-U370|SCH-U380|SCH-U410|SCH-U430|SCH-U450|SCH-U460|SCH-U470|SCH-U490|SCH-U540|SCH-U550|SCH-U620|SCH-U640|SCH-U650|SCH-U660|SCH-U700|SCH-U740|SCH-U750|SCH-U810|SCH-U820|SCH-U900|SCH-U940|SCH-U960|SCS-26UC|SGH-A107|SGH-A117|SGH-A127|SGH-A137|SGH-A157|SGH-A167|SGH-A177|SGH-A187|SGH-A197|SGH-A227|SGH-A237|SGH-A257|SGH-A437|SGH-A517|SGH-A597|SGH-A637|SGH-A657|SGH-A667|SGH-A687|SGH-A697|SGH-A707|SGH-A717|SGH-A727|SGH-A737|SGH-A747|SGH-A767|SGH-A777|SGH-A797|SGH-A817|SGH-A827|SGH-A837|SGH-A847|SGH-A867|SGH-A877|SGH-A887|SGH-A897|SGH-A927|SGH-B100|SGH-B130|SGH-B200|SGH-B220|SGH-C100|SGH-C110|SGH-C120|SGH-C130|SGH-C140|SGH-C160|SGH-C170|SGH-C180|SGH-C200|SGH-C207|SGH-C210|SGH-C225|SGH-C230|SGH-C417|SGH-C450|SGH-D307|SGH-D347|SGH-D357|SGH-D407|SGH-D415|SGH-D780|SGH-D807|SGH-D980|SGH-E105|SGH-E200|SGH-E315|SGH-E316|SGH-E317|SGH-E335|SGH-E590|SGH-E635|SGH-E715|SGH-E890|SGH-F300|SGH-F480|SGH-I200|SGH-I300|SGH-I320|SGH-I550|SGH-I577|SGH-I600|SGH-I607|SGH-I617|SGH-I627|SGH-I637|SGH-I677|SGH-I700|SGH-I717|SGH-I727|SGH-i747M|SGH-I777|SGH-I780|SGH-I827|SGH-I847|SGH-I857|SGH-I896|SGH-I897|SGH-I900|SGH-I907|SGH-I917|SGH-I927|SGH-I937|SGH-I997|SGH-J150|SGH-J200|SGH-L170|SGH-L700|SGH-M110|SGH-M150|SGH-M200|SGH-N105|SGH-N500|SGH-N600|SGH-N620|SGH-N625|SGH-N700|SGH-N710|SGH-P107|SGH-P207|SGH-P300|SGH-P310|SGH-P520|SGH-P735|SGH-P777|SGH-Q105|SGH-R210|SGH-R220|SGH-R225|SGH-S105|SGH-S307|SGH-T109|SGH-T119|SGH-T139|SGH-T209|SGH-T219|SGH-T229|SGH-T239|SGH-T249|SGH-T259|SGH-T309|SGH-T319|SGH-T329|SGH-T339|SGH-T349|SGH-T359|SGH-T369|SGH-T379|SGH-T409|SGH-T429|SGH-T439|SGH-T459|SGH-T469|SGH-T479|SGH-T499|SGH-T509|SGH-T519|SGH-T539|SGH-T559|SGH-T589|SGH-T609|SGH-T619|SGH-T629|SGH-T639|SGH-T659|SGH-T669|SGH-T679|SGH-T709|SGH-T719|SGH-T729|SGH-T739|SGH-T746|SGH-T749|SGH-T759|SGH-T769|SGH-T809|SGH-T819|SGH-T839|SGH-T919|SGH-T929|SGH-T939|SGH-T959|SGH-T989|SGH-U100|SGH-U200|SGH-U800|SGH-V205|SGH-V206|SGH-X100|SGH-X105|SGH-X120|SGH-X140|SGH-X426|SGH-X427|SGH-X475|SGH-X495|SGH-X497|SGH-X507|SGH-X600|SGH-X610|SGH-X620|SGH-X630|SGH-X700|SGH-X820|SGH-X890|SGH-Z130|SGH-Z150|SGH-Z170|SGH-ZX10|SGH-ZX20|SHW-M110|SPH-A120|SPH-A400|SPH-A420|SPH-A460|SPH-A500|SPH-A560|SPH-A600|SPH-A620|SPH-A660|SPH-A700|SPH-A740|SPH-A760|SPH-A790|SPH-A800|SPH-A820|SPH-A840|SPH-A880|SPH-A900|SPH-A940|SPH-A960|SPH-D600|SPH-D700|SPH-D710|SPH-D720|SPH-I300|SPH-I325|SPH-I330|SPH-I350|SPH-I500|SPH-I600|SPH-I700|SPH-L700|SPH-M100|SPH-M220|SPH-M240|SPH-M300|SPH-M305|SPH-M320|SPH-M330|SPH-M350|SPH-M360|SPH-M370|SPH-M380|SPH-M510|SPH-M540|SPH-M550|SPH-M560|SPH-M570|SPH-M580|SPH-M610|SPH-M620|SPH-M630|SPH-M800|SPH-M810|SPH-M850|SPH-M900|SPH-M910|SPH-M920|SPH-M930|SPH-N100|SPH-N200|SPH-N240|SPH-N300|SPH-N400|SPH-Z400|SWC-E100|SCH-i909|GT-N7100|GT-N7105|SCH-I535",
//             "LG": "\\bLG\\b;|LG[- ]?(C800|C900|E400|E610|E900|E-900|F160|F180K|F180L|F180S|730|855|L160|LS840|LS970|LU6200|MS690|MS695|MS770|MS840|MS870|MS910|P500|P700|P705|VM696|AS680|AS695|AX840|C729|E970|GS505|272|C395|E739BK|E960|L55C|L75C|LS696|LS860|P769BK|P350|P500|P509|P870|UN272|US730|VS840|VS950|LN272|LN510|LS670|LS855|LW690|MN270|MN510|P509|P769|P930|UN200|UN270|UN510|UN610|US670|US740|US760|UX265|UX840|VN271|VN530|VS660|VS700|VS740|VS750|VS910|VS920|VS930|VX9200|VX11000|AX840A|LW770|P506|P925|P999)",
//             "Sony": "SonyST|SonyLT|SonyEricsson|SonyEricssonLT15iv|LT18i|E10i|LT28h|LT26w|SonyEricssonMT27i",
//             "Asus": "Asus.*Galaxy|PadFone.*Mobile",
//             "Micromax": "Micromax.*\\b(A210|A92|A88|A72|A111|A110Q|A115|A116|A110|A90S|A26|A51|A35|A54|A25|A27|A89|A68|A65|A57|A90)\\b",
//             "Palm": "PalmSource|Palm",
//             "Vertu": "Vertu|Vertu.*Ltd|Vertu.*Ascent|Vertu.*Ayxta|Vertu.*Constellation(F|Quest)?|Vertu.*Monika|Vertu.*Signature",
//             "Pantech": "PANTECH|IM-A850S|IM-A840S|IM-A830L|IM-A830K|IM-A830S|IM-A820L|IM-A810K|IM-A810S|IM-A800S|IM-T100K|IM-A725L|IM-A780L|IM-A775C|IM-A770K|IM-A760S|IM-A750K|IM-A740S|IM-A730S|IM-A720L|IM-A710K|IM-A690L|IM-A690S|IM-A650S|IM-A630K|IM-A600S|VEGA PTL21|PT003|P8010|ADR910L|P6030|P6020|P9070|P4100|P9060|P5000|CDM8992|TXT8045|ADR8995|IS11PT|P2030|P6010|P8000|PT002|IS06|CDM8999|P9050|PT001|TXT8040|P2020|P9020|P2000|P7040|P7000|C790",
//             "Fly": "IQ230|IQ444|IQ450|IQ440|IQ442|IQ441|IQ245|IQ256|IQ236|IQ255|IQ235|IQ245|IQ275|IQ240|IQ285|IQ280|IQ270|IQ260|IQ250",
//             "SimValley": "\\b(SP-80|XT-930|SX-340|XT-930|SX-310|SP-360|SP60|SPT-800|SP-120|SPT-800|SP-140|SPX-5|SPX-8|SP-100|SPX-8|SPX-12)\\b",
//             "GenericPhone": "Tapatalk|PDA;|SAGEM|\\bmmp\\b|pocket|\\bpsp\\b|symbian|Smartphone|smartfon|treo|up.browser|up.link|vodafone|\\bwap\\b|nokia|Series40|Series60|S60|SonyEricsson|N900|MAUI.*WAP.*Browser"
//         },
//         "tablets": {
//             "iPad": "iPad|iPad.*Mobile",
//             "NexusTablet": "^.*Android.*Nexus(((?:(?!Mobile))|(?:(\\s(7|10).+))).)*$",
//             "SamsungTablet": "SAMSUNG.*Tablet|Galaxy.*Tab|SC-01C|GT-P1000|GT-P1003|GT-P1010|GT-P3105|GT-P6210|GT-P6800|GT-P6810|GT-P7100|GT-P7300|GT-P7310|GT-P7500|GT-P7510|SCH-I800|SCH-I815|SCH-I905|SGH-I957|SGH-I987|SGH-T849|SGH-T859|SGH-T869|SPH-P100|GT-P3100|GT-P3108|GT-P3110|GT-P5100|GT-P5110|GT-P6200|GT-P7320|GT-P7511|GT-N8000|GT-P8510|SGH-I497|SPH-P500|SGH-T779|SCH-I705|SCH-I915|GT-N8013|GT-P3113|GT-P5113|GT-P8110|GT-N8010|GT-N8005|GT-N8020|GT-P1013|GT-P6201|GT-P7501|GT-N5100|GT-N5110|SHV-E140K|SHV-E140L|SHV-E140S|SHV-E150S|SHV-E230K|SHV-E230L|SHV-E230S|SHW-M180K|SHW-M180L|SHW-M180S|SHW-M180W|SHW-M300W|SHW-M305W|SHW-M380K|SHW-M380S|SHW-M380W|SHW-M430W|SHW-M480K|SHW-M480S|SHW-M480W|SHW-M485W|SHW-M486W|SHW-M500W|GT-I9228|SCH-P739|SCH-I925|GT-I9200|GT-I9205|GT-P5200|GT-P5210|SM-T311|SM-T310|SM-T210|SM-T211|SM-P900",
//             "Kindle": "Kindle|Silk.*Accelerated|Android.*\\b(KFTT|KFOTE|WFJWAE)\\b",
//             "SurfaceTablet": "Windows NT [0-9.]+; ARM;",
//             "HPTablet": "HP Slate 7|HP ElitePad 900|hp-tablet|EliteBook.*Touch",
//             "AsusTablet": "^.*PadFone((?!Mobile).)*$|Transformer|TF101|TF101G|TF300T|TF300TG|TF300TL|TF700T|TF700KL|TF701T|TF810C|ME171|ME301T|ME371MG|ME370T|ME372MG|ME172V|ME173X|ME400C|Slider SL101",
//             "BlackBerryTablet": "PlayBook|RIM Tablet",
//             "HTCtablet": "HTC Flyer|HTC Jetstream|HTC-P715a|HTC EVO View 4G|PG41200",
//             "MotorolaTablet": "xoom|sholest|MZ615|MZ605|MZ505|MZ601|MZ602|MZ603|MZ604|MZ606|MZ607|MZ608|MZ609|MZ615|MZ616|MZ617",
//             "NookTablet": "Android.*Nook|NookColor|nook browser|BNRV200|BNRV200A|BNTV250|BNTV250A|BNTV400|BNTV600|LogicPD Zoom2",
//             "AcerTablet": "Android.*; \\b(A100|A101|A110|A200|A210|A211|A500|A501|A510|A511|A700|A701|W500|W500P|W501|W501P|W510|W511|W700|G100|G100W|B1-A71|B1-710|B1-711|A1-810)\\b|W3-810",
//             "ToshibaTablet": "Android.*(AT100|AT105|AT200|AT205|AT270|AT275|AT300|AT305|AT1S5|AT500|AT570|AT700|AT830)|TOSHIBA.*FOLIO",
//             "LGTablet": "\\bL-06C|LG-V900|LG-V909\\b",
//             "FujitsuTablet": "Android.*\\b(F-01D|F-05E|F-10D|M532|Q572)\\b",
//             "PrestigioTablet": "PMP3170B|PMP3270B|PMP3470B|PMP7170B|PMP3370B|PMP3570C|PMP5870C|PMP3670B|PMP5570C|PMP5770D|PMP3970B|PMP3870C|PMP5580C|PMP5880D|PMP5780D|PMP5588C|PMP7280C|PMP7280|PMP7880D|PMP5597D|PMP5597|PMP7100D|PER3464|PER3274|PER3574|PER3884|PER5274|PER5474|PMP5097CPRO|PMP5097|PMP7380D",
//             "LenovoTablet": "IdeaTab|S2110|S6000|K3011|A3000|A1000|A2107|A2109|A1107",
//             "YarvikTablet": "Android.*(TAB210|TAB211|TAB224|TAB250|TAB260|TAB264|TAB310|TAB360|TAB364|TAB410|TAB411|TAB420|TAB424|TAB450|TAB460|TAB461|TAB464|TAB465|TAB467|TAB468)",
//             "MedionTablet": "Android.*\\bOYO\\b|LIFE.*(P9212|P9514|P9516|S9512)|LIFETAB",
//             "ArnovaTablet": "AN10G2|AN7bG3|AN7fG3|AN8G3|AN8cG3|AN7G3|AN9G3|AN7dG3|AN7dG3ST|AN7dG3ChildPad|AN10bG3|AN10bG3DT",
//             "IRUTablet": "M702pro",
//             "MegafonTablet": "MegaFon V9|ZTE V9",
//             "EbodaTablet": "E-Boda (Supreme|Impresspeed|Izzycomm|Essential)",
//             "AllViewTablet": "Allview.*(Viva|Alldro|City|Speed|All TV|Frenzy|Quasar|Shine|TX1|AX1|AX2)",
//             "ArchosTablet": "\\b(101G9|80G9|A101IT)\\b",
//             "AinolTablet": "NOVO7|NOVO8|NOVO10|Novo7Aurora|Novo7Basic|NOVO7PALADIN|novo9-Spark",
//             "SonyTablet": "Sony.*Tablet|Xperia Tablet|Sony Tablet S|SO-03E|SGPT12|SGPT121|SGPT122|SGPT123|SGPT111|SGPT112|SGPT113|SGPT211|SGPT213|SGP311|SGP312|SGP321|EBRD1101|EBRD1102|EBRD1201",
//             "CubeTablet": "Android.*(K8GT|U9GT|U10GT|U16GT|U17GT|U18GT|U19GT|U20GT|U23GT|U30GT)|CUBE U8GT",
//             "CobyTablet": "MID1042|MID1045|MID1125|MID1126|MID7012|MID7014|MID7015|MID7034|MID7035|MID7036|MID7042|MID7048|MID7127|MID8042|MID8048|MID8127|MID9042|MID9740|MID9742|MID7022|MID7010",
//             "MIDTablet": "M9701|M9000|M9100|M806|M1052|M806|T703|MID701|MID713|MID710|MID727|MID760|MID830|MID728|MID933|MID125|MID810|MID732|MID120|MID930|MID800|MID731|MID900|MID100|MID820|MID735|MID980|MID130|MID833|MID737|MID960|MID135|MID860|MID736|MID140|MID930|MID835|MID733",
//             "SMiTTablet": "Android.*(\\bMID\\b|MID-560|MTV-T1200|MTV-PND531|MTV-P1101|MTV-PND530)",
//             "RockChipTablet": "Android.*(RK2818|RK2808A|RK2918|RK3066)|RK2738|RK2808A",
//             "FlyTablet": "IQ310|Fly Vision",
//             "bqTablet": "bq.*(Elcano|Curie|Edison|Maxwell|Kepler|Pascal|Tesla|Hypatia|Platon|Newton|Livingstone|Cervantes|Avant)|Maxwell.*Lite|Maxwell.*Plus",
//             "HuaweiTablet": "MediaPad|IDEOS S7|S7-201c|S7-202u|S7-101|S7-103|S7-104|S7-105|S7-106|S7-201|S7-Slim",
//             "NecTablet": "\\bN-06D|\\bN-08D",
//             "PantechTablet": "Pantech.*P4100",
//             "BronchoTablet": "Broncho.*(N701|N708|N802|a710)",
//             "VersusTablet": "TOUCHPAD.*[78910]|\\bTOUCHTAB\\b",
//             "ZyncTablet": "z1000|Z99 2G|z99|z930|z999|z990|z909|Z919|z900",
//             "PositivoTablet": "TB07STA|TB10STA|TB07FTA|TB10FTA",
//             "NabiTablet": "Android.*\\bNabi",
//             "KoboTablet": "Kobo Touch|\\bK080\\b|\\bVox\\b Build|\\bArc\\b Build",
//             "DanewTablet": "DSlide.*\\b(700|701R|702|703R|704|802|970|971|972|973|974|1010|1012)\\b",
//             "TexetTablet": "NaviPad|TB-772A|TM-7045|TM-7055|TM-9750|TM-7016|TM-7024|TM-7026|TM-7041|TM-7043|TM-7047|TM-8041|TM-9741|TM-9747|TM-9748|TM-9751|TM-7022|TM-7021|TM-7020|TM-7011|TM-7010|TM-7023|TM-7025|TM-7037W|TM-7038W|TM-7027W|TM-9720|TM-9725|TM-9737W|TM-1020|TM-9738W|TM-9740|TM-9743W|TB-807A|TB-771A|TB-727A|TB-725A|TB-719A|TB-823A|TB-805A|TB-723A|TB-715A|TB-707A|TB-705A|TB-709A|TB-711A|TB-890HD|TB-880HD|TB-790HD|TB-780HD|TB-770HD|TB-721HD|TB-710HD|TB-434HD|TB-860HD|TB-840HD|TB-760HD|TB-750HD|TB-740HD|TB-730HD|TB-722HD|TB-720HD|TB-700HD|TB-500HD|TB-470HD|TB-431HD|TB-430HD|TB-506|TB-504|TB-446|TB-436|TB-416|TB-146SE|TB-126SE",
//             "PlaystationTablet": "Playstation.*(Portable|Vita)",
//             "GalapadTablet": "Android.*\\bG1\\b",
//             "MicromaxTablet": "Funbook|Micromax.*\\b(P250|P560|P360|P362|P600|P300|P350|P500|P275)\\b",
//             "KarbonnTablet": "Android.*\\b(A39|A37|A34|ST8|ST10|ST7|Smart Tab3|Smart Tab2)\\b",
//             "AllFineTablet": "Fine7 Genius|Fine7 Shine|Fine7 Air|Fine8 Style|Fine9 More|Fine10 Joy|Fine11 Wide",
//             "PROSCANTablet": "\\b(PEM63|PLT1023G|PLT1041|PLT1044|PLT1044G|PLT1091|PLT4311|PLT4311PL|PLT4315|PLT7030|PLT7033|PLT7033D|PLT7035|PLT7035D|PLT7044K|PLT7045K|PLT7045KB|PLT7071KG|PLT7072|PLT7223G|PLT7225G|PLT7777G|PLT7810K|PLT7849G|PLT7851G|PLT7852G|PLT8015|PLT8031|PLT8034|PLT8036|PLT8080K|PLT8082|PLT8088|PLT8223G|PLT8234G|PLT8235G|PLT8816K|PLT9011|PLT9045K|PLT9233G|PLT9735|PLT9760G|PLT9770G)\\b",
//             "YONESTablet": "BQ1078|BC1003|BC1077|RK9702|BC9730|BC9001|IT9001|BC7008|BC7010|BC708|BC728|BC7012|BC7030|BC7027|BC7026",
//             "ChangJiaTablet": "TPC7102|TPC7103|TPC7105|TPC7106|TPC7107|TPC7201|TPC7203|TPC7205|TPC7210|TPC7708|TPC7709|TPC7712|TPC7110|TPC8101|TPC8103|TPC8105|TPC8106|TPC8203|TPC8205|TPC8503|TPC9106|TPC9701|TPC97101|TPC97103|TPC97105|TPC97106|TPC97111|TPC97113|TPC97203|TPC97603|TPC97809|TPC97205|TPC10101|TPC10103|TPC10106|TPC10111|TPC10203|TPC10205|TPC10503",
//             "GUTablet": "TX-A1301|TX-M9002|Q702",
//             "PointOfViewTablet": "TAB-P506|TAB-navi-7-3G-M|TAB-P517|TAB-P-527|TAB-P701|TAB-P703|TAB-P721|TAB-P731N|TAB-P741|TAB-P825|TAB-P905|TAB-P925|TAB-PR945|TAB-PL1015|TAB-P1025|TAB-PI1045|TAB-P1325|TAB-PROTAB[0-9]+|TAB-PROTAB25|TAB-PROTAB26|TAB-PROTAB27|TAB-PROTAB26XL|TAB-PROTAB2-IPS9|TAB-PROTAB30-IPS9|TAB-PROTAB25XXL|TAB-PROTAB26-IPS10|TAB-PROTAB30-IPS10",
//             "OvermaxTablet": "OV-(SteelCore|NewBase|Basecore|Baseone|Exellen|Quattor|EduTab|Solution|ACTION|BasicTab|TeddyTab|MagicTab|Stream|TB-08|TB-09)",
//             "HCLTablet": "HCL.*Tablet|Connect-3G-2.0|Connect-2G-2.0|ME Tablet U1|ME Tablet U2|ME Tablet G1|ME Tablet X1|ME Tablet Y2|ME Tablet Sync",
//             "DPSTablet": "DPS Dream 9|DPS Dual 7",
//             "TelstraTablet": "T-Hub2",
//             "GenericTablet": "Android.*\\b97D\\b|Tablet(?!.*PC)|ViewPad7|BNTV250A|MID-WCDMA|LogicPD Zoom2|\\bA7EB\\b|CatNova8|A1_07|CT704|CT1002|\\bM721\\b|rk30sdk|\\bEVOTAB\\b|SmartTabII10"
//         },
//         "oss": {
//             "AndroidOS": "Android",
//             "BlackBerryOS": "blackberry|\\bBB10\\b|rim tablet os",
//             "PalmOS": "PalmOS|avantgo|blazer|elaine|hiptop|palm|plucker|xiino",
//             "SymbianOS": "Symbian|SymbOS|Series60|Series40|SYB-[0-9]+|\\bS60\\b",
//             "WindowsMobileOS": "Windows CE.*(PPC|Smartphone|Mobile|[0-9]{3}x[0-9]{3})|Window Mobile|Windows Phone [0-9.]+|WCE;",
//             "WindowsPhoneOS": "Windows Phone 8.0|Windows Phone OS|XBLWP7|ZuneWP7",
//             "iOS": "\\biPhone.*Mobile|\\biPod|\\biPad",
//             "MeeGoOS": "MeeGo",
//             "MaemoOS": "Maemo",
//             "JavaOS": "J2ME\/|\\bMIDP\\b|\\bCLDC\\b",
//             "webOS": "webOS|hpwOS",
//             "badaOS": "\\bBada\\b",
//             "BREWOS": "BREW"
//         },
//         "uas": {
//             "Chrome": "\\bCrMo\\b|CriOS|Android.*Chrome\/[.0-9]* (Mobile)?",
//             "Dolfin": "\\bDolfin\\b",
//             "Opera": "Opera.*Mini|Opera.*Mobi|Android.*Opera|Mobile.*OPR\/[0-9.]+|Coast\/[0-9.]+",
//             "Skyfire": "Skyfire",
//             "IE": "IEMobile|MSIEMobile",
//             "Firefox": "fennec|firefox.*maemo|(Mobile|Tablet).*Firefox|Firefox.*Mobile",
//             "Bolt": "bolt",
//             "TeaShark": "teashark",
//             "Blazer": "Blazer",
//             "Safari": "Version.*Mobile.*Safari|Safari.*Mobile",
//             "Tizen": "Tizen",
//             "UCBrowser": "UC.*Browser|UCWEB",
//             "DiigoBrowser": "DiigoBrowser",
//             "Puffin": "Puffin",
//             "Mercury": "\\bMercury\\b",
//             "GenericBrowser": "NokiaBrowser|OviBrowser|OneBrowser|TwonkyBeamBrowser|SEMC.*Browser|FlyFlow|Minimo|NetFront|Novarra-Vision|MQQBrowser|MicroMessenger"
//         },
//         "props": {
//             "Mobile": "Mobile\/[VER]",
//             "Build": "Build\/[VER]",
//             "Version": "Version\/[VER]",
//             "VendorID": "VendorID\/[VER]",
//             "iPad": "iPad.*CPU[a-z ]+[VER]",
//             "iPhone": "iPhone.*CPU[a-z ]+[VER]",
//             "iPod": "iPod.*CPU[a-z ]+[VER]",
//             "Kindle": "Kindle\/[VER]",
//             "Chrome": [
//                 "Chrome\/[VER]",
//                 "CriOS\/[VER]",
//                 "CrMo\/[VER]"
//             ],
//             "Coast": [
//                 "Coast\/[VER]"
//             ],
//             "Dolfin": "Dolfin\/[VER]",
//             "Firefox": "Firefox\/[VER]",
//             "Fennec": "Fennec\/[VER]",
//             "IE": [
//                 "IEMobile\/[VER];",
//                 "IEMobile [VER]",
//                 "MSIE [VER];"
//             ],
//             "NetFront": "NetFront\/[VER]",
//             "NokiaBrowser": "NokiaBrowser\/[VER]",
//             "Opera": [
//                 " OPR\/[VER]",
//                 "Opera Mini\/[VER]",
//                 "Version\/[VER]"
//             ],
//             "Opera Mini": "Opera Mini\/[VER]",
//             "Opera Mobi": "Version\/[VER]",
//             "UC Browser": "UC Browser[VER]",
//             "MQQBrowser": "MQQBrowser\/[VER]",
//             "MicroMessenger": "MicroMessenger\/[VER]",
//             "Safari": [
//                 "Version\/[VER]",
//                 "Safari\/[VER]"
//             ],
//             "Skyfire": "Skyfire\/[VER]",
//             "Tizen": "Tizen\/[VER]",
//             "Webkit": "webkit[ \/][VER]",
//             "Gecko": "Gecko\/[VER]",
//             "Trident": "Trident\/[VER]",
//             "Presto": "Presto\/[VER]",
//             "iOS": " \\bOS\\b [VER] ",
//             "Android": "Android [VER]",
//             "BlackBerry": [
//                 "BlackBerry[\\w]+\/[VER]",
//                 "BlackBerry.*Version\/[VER]",
//                 "Version\/[VER]"
//             ],
//             "BREW": "BREW [VER]",
//             "Java": "Java\/[VER]",
//             "Windows Phone OS": [
//                 "Windows Phone OS [VER]",
//                 "Windows Phone [VER]"
//             ],
//             "Windows Phone": "Windows Phone [VER]",
//             "Windows CE": "Windows CE\/[VER]",
//             "Windows NT": "Windows NT [VER]",
//             "Symbian": [
//                 "SymbianOS\/[VER]",
//                 "Symbian\/[VER]"
//             ],
//             "webOS": [
//                 "webOS\/[VER]",
//                 "hpwOS\/[VER];"
//             ]
//         },
//         "utils": {
//             "DesktopMode": "WPDesktop",
//             "TV": "SonyDTV|HbbTV",
//             "WebKit": "(webkit)[ \/]([\\w.]+)",
//             "Bot": "Googlebot|DoCoMo|YandexBot|bingbot|ia_archiver|AhrefsBot|Ezooms|GSLFbot|WBSearchBot|Twitterbot|TweetmemeBot|Twikle|PaperLiBot|Wotbox|UnwindFetchor|facebookexternalhit",
//             "MobileBot": "Googlebot-Mobile|DoCoMo|YahooSeeker\/M1A1-R2D2",
//             "Console": "\\b(Nintendo|Nintendo WiiU|PLAYSTATION|Xbox)\\b",
//             "Watch": "SM-V700"
//         }
//     };
//
//     // following patterns come from http://detectmobilebrowsers.com/
//     var detectMobileBrowsers = {
//         fullPattern: /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i,
//         shortPattern: /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
//     };
//
//     var hasOwnProp = Object.prototype.hasOwnProperty,
//         isArray,
//         FALLBACK_PHONE = 'UnknownPhone',
//         FALLBACK_TABLET = 'UnknownTablet',
//         FALLBACK_MOBILE = 'UnknownMobile';
//
//     isArray = ('isArray' in Array) ?
//         Array.isArray : function (value) { return Object.prototype.toString.call(value) === '[object Array]'; };
//
//     (function init() {
//         var key, values, value, i, len, verPos;
//         for (key in mobileDetectRules.props) {
//             if (hasOwnProp.call(mobileDetectRules.props, key)) {
//                 values = mobileDetectRules.props[key];
//                 if (!isArray(values)) {
//                     values = [values];
//                 }
//                 len = values.length;
//                 for (i = 0; i < len; ++i) {
//                     value = values[i];
//                     verPos = value.indexOf('[VER]');
//                     if (verPos >= 0) {
//                         value = value.substring(0, verPos) + '([\\w._\\+]+)' + value.substring(verPos + 5);
//                     }
//                     values[i] = new RegExp(value, 'i');
//                 }
//                 mobileDetectRules.props[key] = values;
//             }
//         }
//         convertPropsToRegExp(mobileDetectRules.oss);
//         convertPropsToRegExp(mobileDetectRules.phones);
//         convertPropsToRegExp(mobileDetectRules.tablets);
//         convertPropsToRegExp(mobileDetectRules.uas);
//         convertPropsToRegExp(mobileDetectRules.utils);
//     }());
//
//     function convertPropsToRegExp(object) {
//         for (var key in object) {
//             if (hasOwnProp.call(object, key)) {
//                 object[key] = new RegExp(object[key], 'i');
//             }
//         }
//     }
//
//     /**
//      * Test userAgent string against a set of rules and find the matched key.
//      * @param {Object} rules (key is String, value is RegExp)
//      * @param {String} userAgent the navigator.userAgent (or HTTP-Header 'User-Agent').
//      * @returns {String|null} the matched key if found, otherwise <tt>null</tt>
//      * @private
//      */
//     function findMatch(rules, userAgent) {
//         for (var key in rules) {
//             if (hasOwnProp.call(rules, key)) {
//                 if (rules[key].test(userAgent)) {
//                     return key;
//                 }
//             }
//         }
//         return null;
//     }
//
//     /**
//      * Check the version of the given property in the User-Agent.
//      *
//      * @param {String} propertyName
//      * @param {String} userAgent
//      * @return {String} version or <tt>null</tt> if version not found
//      * @private
//      */
//     function getVersionStr(propertyName, userAgent) {
//         var props = mobileDetectRules.props, patterns, i, len, match;
//         if (hasOwnProp.call(props, propertyName)) {
//             patterns = props[propertyName];
//             len = patterns.length;
//             for (i = 0; i < len; ++i) {
//                 match = patterns[i].exec(userAgent);
//                 if (match !== null) {
//                     return match[1];
//                 }
//             }
//         }
//         return null;
//     }
//
//     /**
//      * Check the version of the given property in the User-Agent.
//      * Will return a float number. (eg. 2_0 will return 2.0, 4.3.1 will return 4.31)
//      *
//      * @param {String} propertyName
//      * @param {String} userAgent
//      * @return {Number} version or <tt>NaN</tt> if version not found
//      * @private
//      */
//     function getVersion(propertyName, userAgent) {
//         var version = getVersionStr(propertyName, userAgent);
//         return version ? prepareVersionNo(version) : NaN;
//     }
//
//     /**
//      * Prepare the version number.
//      *
//      * @param {String} version
//      * @return {Number} the version number as a floating number
//      * @private
//      */
//     function prepareVersionNo(version) {
//         var numbers;
//
//         numbers = version.split(/[a-z._ \/\-]/i);
//         if (numbers.length === 1) {
//             version = numbers[0];
//         }
//         if (numbers.length > 1) {
//             version = numbers[0] + '.';
//             numbers.shift();
//             version += numbers.join('');
//         }
//         return Number(version);
//     }
//
//     function equalIC(a, b) {
//         return a != null && b != null && a.toLowerCase() === b.toLowerCase();
//     }
//
//     function isMobileFallback(userAgent) {
//         return detectMobileBrowsers.fullPattern.test(userAgent) ||
//             detectMobileBrowsers.shortPattern.test(userAgent.substr(0,4));
//     }
//
//     function prepareDetectionCache(cache, userAgent, maxPhoneWidth) {
//         if (cache.mobile !== undefined) {
//             return;
//         }
//         var phone, tablet, phoneSized;
//
//         phone = findMatch(mobileDetectRules.phones, userAgent);
//         if (phone) {
//             cache.mobile = cache.phone = phone;
//             cache.tablet = null;
//             return; // unambiguously identified as phone
//         }
//
//         tablet = findMatch(mobileDetectRules.tablets, userAgent);
//         if (tablet) {
//             cache.mobile = cache.tablet = tablet;
//             cache.phone = null;
//             return; // unambiguously identified as tablet
//         }
//
//         // our rules haven't found a match -> try more general fallback rules
//         if (isMobileFallback(userAgent)) {
//             phoneSized = MobileDetect.isPhoneSized(maxPhoneWidth);
//             if (phoneSized === undefined) {
//                 cache.mobile = cache.tablet = cache.phone = FALLBACK_MOBILE;
//             } else if (phoneSized) {
//                 cache.mobile = cache.phone = FALLBACK_PHONE;
//                 cache.tablet = null;
//             } else {
//                 cache.mobile = cache.tablet = FALLBACK_TABLET;
//                 cache.phone = null;
//             }
//         } else {
//             // not mobile at all!
//             cache.mobile = cache.tablet = cache.phone = null;
//         }
//     }
//
//     /**
//      * Constructor for MobileDetect object.
//      * <br>
//      * Such an object will keep a reference to the given user-agent string and cache most of the detect queries.<br>
//      * <div style="background-color: #d9edf7; border: 1px solid #bce8f1; color: #3a87ad; padding: 14px; border-radius: 2px; margin-top: 20px">
//      *     <strong>Find information how to download and install:</strong>
//      *     <a href="https://github.com/hgoebl/mobile-detect.js/">github.com/hgoebl/mobile-detect.js/</a>
//      * </div>
//      *
//      * @example <pre>
//      *     var md = new MobileDetect(window.navigator.userAgent);
//      *     if (md.mobile()) {
//      *         location.href = (md.mobileGrade() === 'A') ? '/mobile/' : '/lynx/';
//      *     }
//      * </pre>
//      *
//      * @param {string} userAgent typically taken from window.navigator.userAgent or http_header['User-Agent']
//      * @param {number} [maxPhoneWidth=650] <strong>only for browsers</strong> specify a value for the maximum
//      *        width (in logical "CSS" pixels) until a device detected as mobile will be handled as phone.
//      *        This is only used in cases where the device cannot be classified as phone or tablet.<br>
//      *        See <a href="http://www.html5rocks.com/en/mobile/cross-device/">A non-responsive approach to
//      *        building cross-device webapps</a>.<br>
//      *        If you provide a value < 0, then this "fuzzy" check is disabled.
//      * @constructor
//      * @global
//      */
//     function MobileDetect(userAgent, maxPhoneWidth) {
//         this.ua = userAgent || '';
//         this._cache = {};
//         this.maxPhoneWidth = maxPhoneWidth || 650;
//     }
//
//     MobileDetect.prototype = {
//         constructor: MobileDetect,
//
//         /**
//          * Returns the detected phone or tablet type or <tt>null</tt> if it is not a mobile device.
//          * <br>
//          * For a list of possible return values see {@link MobileDetect#phone} and {@link MobileDetect#tablet}.<br>
//          * <br>
//          * If the device is not detected by the regular expressions from Mobile-Detect, a test is made against
//          * the patterns of <a href="http://detectmobilebrowsers.com/">detectmobilebrowsers.com</a>. If this test
//          * is positive, a value of <code>UnknownPhone</code>, <code>UnknownTablet</code> or
//          * <code>UnknownMobile</code> is returned.<br>
//          * When used in browser, the decision whether phone or tablet is made based on <code>screen.width</code>.<br>
//          * When used server-side (node.js), there is no way to tell the difference between <code>UnknownPhone</code>
//          * and <code>UnknownTablet</code>, so you will only get <code>UnknownMobile</code>.<br>
//          * <br>
//          * In most cases you will use the return value just as a boolean.
//          *
//          * @returns {String} the key for the phone family or tablet family, e.g. "Nexus".
//          * @function MobileDetect#mobile
//          */
//         mobile: function () {
//             prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth);
//             return this._cache.mobile;
//         },
//
//         /**
//          * Returns the detected phone type/family string or <tt>null</tt>.
//          * <br>
//          * The returned tablet (family or producer) is one of following keys:<br>
//          * <br><tt>iPhone, BlackBerry, HTC, Nexus, Dell, Motorola, Samsung, LG, Sony, Asus,
//          * Micromax, Palm, Vertu, Pantech, Fly, SimValley, GenericPhone</tt><br>
//          * <br>
//          * If the device is not detected by the regular expressions from Mobile-Detect, a test is made against
//          * the patterns of <a href="http://detectmobilebrowsers.com/">detectmobilebrowsers.com</a>. If this test
//          * is positive, a value of <code>UnknownPhone</code> or <code>UnknownMobile</code> is returned.<br>
//          * When used in browser, the decision whether phone or tablet is made based on <code>screen.width</code>.<br>
//          * When used server-side (node.js), there is no way to tell the difference between <code>UnknownPhone</code>
//          * and <code>UnknownMobile</code>, so you will only get <code>UnknownMobile</code>.<br>
//          * <br>
//          * In most cases you will use the return value just as a boolean.
//          *
//          * @returns {String} the key of the phone family or producer, e.g. "iPhone"
//          * @function MobileDetect#phone
//          */
//         phone: function () {
//             prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth);
//             return this._cache.phone;
//         },
//
//         /**
//          * Returns the detected tablet type/family string or <tt>null</tt>.
//          * <br>
//          * The returned tablet (family or producer) is one of following keys:<br>
//          * <br><tt>iPad, NexusTablet, SamsungTablet, Kindle, SurfaceTablet, HPTablet, AsusTablet,
//          * BlackBerryTablet, HTCtablet, MotorolaTablet, NookTablet, AcerTablet,
//          * ToshibaTablet, LGTablet, FujitsuTablet, PrestigioTablet, LenovoTablet,
//          * YarvikTablet, MedionTablet, ArnovaTablet, IRUTablet, MegafonTablet,
//          * EbodaTablet, AllViewTablet, ArchosTablet, AinolTablet, SonyTablet, CubeTablet,
//          * CobyTablet, MIDTablet, SMiTTablet, RockChipTablet, FlyTablet, bqTablet,
//          * HuaweiTablet, NecTablet, PantechTablet, BronchoTablet, VersusTablet,
//          * ZyncTablet, PositivoTablet, NabiTablet, KoboTablet, DanewTablet, TexetTablet,
//          * PlaystationTablet, GalapadTablet, MicromaxTablet, KarbonnTablet, AllFineTablet,
//          * PROSCANTablet, YONESTablet, ChangJiaTablet, GUTablet, PointOfViewTablet,
//          * OvermaxTablet, HCLTablet, DPSTablet, TelstraTablet, GenericTablet</tt><br>
//          * <br>
//          * If the device is not detected by the regular expressions from Mobile-Detect, a test is made against
//          * the patterns of <a href="http://detectmobilebrowsers.com/">detectmobilebrowsers.com</a>. If this test
//          * is positive, a value of <code>UnknownTablet</code> or <code>UnknownMobile</code> is returned.<br>
//          * When used in browser, the decision whether phone or tablet is made based on <code>screen.width</code>.<br>
//          * When used server-side (node.js), there is no way to tell the difference between <code>UnknownTablet</code>
//          * and <code>UnknownMobile</code>, so you will only get <code>UnknownMobile</code>.<br>
//          * <br>
//          * In most cases you will use the return value just as a boolean.
//          *
//          * @returns {String} the key of the tablet family or producer, e.g. "SamsungTablet"
//          * @function MobileDetect#tablet
//          */
//         tablet: function () {
//             prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth);
//             return this._cache.tablet;
//         },
//
//         /**
//          * Returns the detected user-agent string or <tt>null</tt>.
//          * <br>
//          * The returned user-agent is one of following keys:<br>
//          * <br><tt>Chrome, Dolfin, Opera, Skyfire, IE, Firefox, Bolt, TeaShark, Blazer, Safari,
//          * Tizen, UCBrowser, DiigoBrowser, Puffin, Mercury, GenericBrowser</tt><br>
//          *
//          * @returns {String} the key for the detected user-agent or <tt>null</tt>
//          * @function MobileDetect#userAgent
//          */
//         userAgent: function () {
//             if (this._cache.userAgent === undefined) {
//                 this._cache.userAgent = findMatch(mobileDetectRules.uas, this.ua);
//             }
//             return this._cache.userAgent;
//         },
//
//         /**
//          * Returns the detected operating system string or <tt>null</tt>.
//          * <br>
//          * The operating system is one of following keys:<br>
//          * <br><tt>AndroidOS, BlackBerryOS, PalmOS, SymbianOS, WindowsMobileOS, WindowsPhoneOS,
//          * iOS, MeeGoOS, MaemoOS, JavaOS, webOS, badaOS, BREWOS</tt><br>
//          *
//          * @returns {String} the key for the detected operating system.
//          * @function MobileDetect#os
//          */
//         os: function () {
//             if (this._cache.os === undefined) {
//                 this._cache.os = findMatch(mobileDetectRules.oss, this.ua);
//             }
//             return this._cache.os;
//         },
//
//         /**
//          * Get the version (as Number) of the given property in the User-Agent.
//          * <br>
//          * Will return a float number. (eg. 2_0 will return 2.0, 4.3.1 will return 4.31)
//          *
//          * @param {String} key a key defining a thing which has a version.<br>
//          *        You can use one of following keys:<br>
//          * <br><tt>Mobile, Build, Version, VendorID, iPad, iPhone, iPod, Kindle, Chrome, Coast,
//          * Dolfin, Firefox, Fennec, IE, NetFront, NokiaBrowser, Opera, Opera Mini, Opera
//          * Mobi, UC Browser, MQQBrowser, MicroMessenger, Safari, Skyfire, Tizen, Webkit,
//          * Gecko, Trident, Presto, iOS, Android, BlackBerry, BREW, Java, Windows Phone OS,
//          * Windows Phone, Windows CE, Windows NT, Symbian, webOS</tt><br>
//          *
//          * @returns {Number} the version as float or <tt>NaN</tt> if User-Agent doesn't contain this version.
//          *          Be careful when comparing this value with '==' operator!
//          * @function MobileDetect#version
//          */
//         version: function (key) {
//             return getVersion(key, this.ua);
//         },
//
//         /**
//          * Get the version (as String) of the given property in the User-Agent.
//          * <br>
//          *
//          * @param {String} key a key defining a thing which has a version.<br>
//          *        You can use one of following keys:<br>
//          * <br><tt>Mobile, Build, Version, VendorID, iPad, iPhone, iPod, Kindle, Chrome, Coast,
//          * Dolfin, Firefox, Fennec, IE, NetFront, NokiaBrowser, Opera, Opera Mini, Opera
//          * Mobi, UC Browser, MQQBrowser, MicroMessenger, Safari, Skyfire, Tizen, Webkit,
//          * Gecko, Trident, Presto, iOS, Android, BlackBerry, BREW, Java, Windows Phone OS,
//          * Windows Phone, Windows CE, Windows NT, Symbian, webOS</tt><br>
//          *
//          * @returns {String} the "raw" version as String or <tt>null</tt> if User-Agent doesn't contain this version.
//          *
//          * @function MobileDetect#versionStr
//          */
//         versionStr: function (key) {
//             return getVersionStr(key, this.ua);
//         },
//
//         /**
//          * Global test key against userAgent, os, phone, tablet and some other properties of userAgent string.
//          *
//          * @param {String} key the key (case-insensitive) of a userAgent, an operating system, phone or
//          *        tablet family.<br>
//          *        For a complete list of possible values, see {@link MobileDetect#userAgent},
//          *        {@link MobileDetect#os}, {@link MobileDetect#phone}, {@link MobileDetect#tablet}.<br>
//          *        Additionally you have following keys:<br>
//          * <br><tt>DesktopMode, TV, WebKit, Bot, MobileBot, Console, Watch</tt><br>
//          *
//          * @returns {boolean} <tt>true</tt> when the given key is one of the defined keys of userAgent, os, phone,
//          *                    tablet or one of the listed additional keys, otherwise <tt>false</tt>
//          * @function MobileDetect#is
//          */
//         is: function(key) {
//             return equalIC(key, this.userAgent()) ||
//                 equalIC(key, this.os()) ||
//                 equalIC(key, this.phone()) ||
//                 equalIC(key, this.tablet()) ||
//                 equalIC(key, findMatch(mobileDetectRules.utils, this.ua));
//         },
//
//         /**
//          * Do a quick test against navigator::userAgent.
//          *
//          * @param {String|RegExp} pattern the pattern, either as String or RegExp
//          *                        (a string will be converted to a case-insensitive RegExp).
//          * @returns {boolean} <tt>true</tt> when the pattern matches, otherwise <tt>false</tt>
//          * @function MobileDetect#match
//          */
//         match: function (pattern) {
//             if (!(pattern instanceof RegExp)) {
//                 pattern = new RegExp(pattern, 'i');
//             }
//             return pattern.test(this.ua);
//         },
//
//         /**
//          * Checks whether the mobile device can be considered as phone regarding <code>screen.width</code>.
//          * <br>
//          * Obviously this method makes sense in browser environments only (not for Node.js)!
//          * @param {number} [maxPhoneWidth] the maximum logical pixels (aka. CSS-pixels) to be considered as phone.<br>
//          *        The argument is optional and if not present or falsy, the value of the constructor is taken.
//          * @returns {boolean|undefined} <code>undefined</code> if screen size wasn't detectable, else <code>true</code>
//          *          when screen.width is less or equal to maxPhoneWidth, otherwise <code>false</code>.<br>
//          *          Will always return <code>undefined</code> server-side.
//          */
//         isPhoneSized: function (maxPhoneWidth) {
//             return MobileDetect.isPhoneSized(maxPhoneWidth || this.maxPhoneWidth);
//         },
//
//         /**
//          * Returns the mobile grade ('A', 'B', 'C').
//          *
//          * @returns {String} one of the mobile grades ('A', 'B', 'C').
//          * @function MobileDetect#mobileGrade
//          */
//         mobileGrade: function () {
//             // impl note:
//             // To keep in sync w/ Mobile_Detect.php easily, the following code is tightly aligned to the PHP version.
//             // When changes are made in Mobile_Detect.php, copy this method and replace:
//             //     $this-> / t.
//             //     self::MOBILE_GRADE_(.) / '$1'
//             //     , self::VERSION_TYPE_FLOAT / (nothing)
//             var t = this,
//                 $isMobile = this.mobile() !== null;
//
//             if (
//                 // Apple iOS 3.2-5.1 - Tested on the original iPad (4.3 / 5.0), iPad 2 (4.3), iPad 3 (5.1), original iPhone (3.1), iPhone 3 (3.2), 3GS (4.3), 4 (4.3 / 5.0), and 4S (5.1)
//                 t.version('iPad') >= 4.3 ||
//                 t.version('iPhone') >= 3.1 ||
//                 t.version('iPod') >= 3.1 ||
//
//                 // Android 2.1-2.3 - Tested on the HTC Incredible (2.2), original Droid (2.2), HTC Aria (2.1), Google Nexus S (2.3). Functional on 1.5 & 1.6 but performance may be sluggish, tested on Google G1 (1.5)
//                 // Android 3.1 (Honeycomb)  - Tested on the Samsung Galaxy Tab 10.1 and Motorola XOOM
//                 // Android 4.0 (ICS)  - Tested on a Galaxy Nexus. Note: transition performance can be poor on upgraded devices
//                 // Android 4.1 (Jelly Bean)  - Tested on a Galaxy Nexus and Galaxy 7
//                 ( t.version('Android') > 2.1 && t.is('Webkit') ) ||
//
//                 // Windows Phone 7-7.5 - Tested on the HTC Surround (7.0) HTC Trophy (7.5), LG-E900 (7.5), Nokia Lumia 800
//                 t.version('Windows Phone OS') >= 7.0 ||
//
//                 // Blackberry 7 - Tested on BlackBerry® Torch 9810
//                 // Blackberry 6.0 - Tested on the Torch 9800 and Style 9670
//                 t.is('BlackBerry') && t.version('BlackBerry') >= 6.0 ||
//                 // Blackberry Playbook (1.0-2.0) - Tested on PlayBook
//                 t.match('Playbook.*Tablet') ||
//
//                 // Palm WebOS (1.4-2.0) - Tested on the Palm Pixi (1.4), Pre (1.4), Pre 2 (2.0)
//                 ( t.version('webOS') >= 1.4 && t.match('Palm|Pre|Pixi') ) ||
//                 // Palm WebOS 3.0  - Tested on HP TouchPad
//                 t.match('hp.*TouchPad') ||
//
//                 // Firefox Mobile (12 Beta) - Tested on Android 2.3 device
//                 ( t.is('Firefox') && t.version('Firefox') >= 12 ) ||
//
//                 // Chrome for Android - Tested on Android 4.0, 4.1 device
//                 ( t.is('Chrome') && t.is('AndroidOS') && t.version('Android') >= 4.0 ) ||
//
//                 // Skyfire 4.1 - Tested on Android 2.3 device
//                 ( t.is('Skyfire') && t.version('Skyfire') >= 4.1 && t.is('AndroidOS') && t.version('Android') >= 2.3 ) ||
//
//                 // Opera Mobile 11.5-12: Tested on Android 2.3
//                 ( t.is('Opera') && t.version('Opera Mobi') > 11 && t.is('AndroidOS') ) ||
//
//                 // Meego 1.2 - Tested on Nokia 950 and N9
//                 t.is('MeeGoOS') ||
//
//                 // Tizen (pre-release) - Tested on early hardware
//                 t.is('Tizen') ||
//
//                 // Samsung Bada 2.0 - Tested on a Samsung Wave 3, Dolphin browser
//                 // @todo: more tests here!
//                 t.is('Dolfin') && t.version('Bada') >= 2.0 ||
//
//                 // UC Browser - Tested on Android 2.3 device
//                 ( (t.is('UC Browser') || t.is('Dolfin')) && t.version('Android') >= 2.3 ) ||
//
//                 // Kindle 3 and Fire  - Tested on the built-in WebKit browser for each
//                 ( t.match('Kindle Fire') ||
//                     t.is('Kindle') && t.version('Kindle') >= 3.0 ) ||
//
//                 // Nook Color 1.4.1 - Tested on original Nook Color, not Nook Tablet
//                 t.is('AndroidOS') && t.is('NookTablet') ||
//
//                 // Chrome Desktop 11-21 - Tested on OS X 10.7 and Windows 7
//                 t.version('Chrome') >= 11 && !$isMobile ||
//
//                 // Safari Desktop 4-5 - Tested on OS X 10.7 and Windows 7
//                 t.version('Safari') >= 5.0 && !$isMobile ||
//
//                 // Firefox Desktop 4-13 - Tested on OS X 10.7 and Windows 7
//                 t.version('Firefox') >= 4.0 && !$isMobile ||
//
//                 // Internet Explorer 7-9 - Tested on Windows XP, Vista and 7
//                 t.version('MSIE') >= 7.0 && !$isMobile ||
//
//                 // Opera Desktop 10-12 - Tested on OS X 10.7 and Windows 7
//                 // @reference: http://my.opera.com/community/openweb/idopera/
//                 t.version('Opera') >= 10 && !$isMobile
//             ) {
//                 return 'A';
//             }
//
//             if (
//                 t.version('iPad') < 4.3 ||
//                 t.version('iPhone') < 3.1 ||
//                 t.version('iPod') < 3.1 ||
//
//                 // Blackberry 5.0: Tested on the Storm 2 9550, Bold 9770
//                 t.is('Blackberry') && t.version('BlackBerry') >= 5 && t.version('BlackBerry') < 6 ||
//
//                 //Opera Mini (5.0-6.5) - Tested on iOS 3.2/4.3 and Android 2.3
//                 ( t.version('Opera Mini') >= 5.0 && t.version('Opera Mini') <= 6.5 &&
//                     (t.version('Android') >= 2.3 || t.is('iOS')) ) ||
//
//                 // Nokia Symbian^3 - Tested on Nokia N8 (Symbian^3), C7 (Symbian^3), also works on N97 (Symbian^1)
//                 t.match('NokiaN8|NokiaC7|N97.*Series60|Symbian/3') ||
//
//                 // @todo: report this (tested on Nokia N71)
//                 t.version('Opera Mobi') >= 11 && t.is('SymbianOS')
//             ) {
//                 return 'B';
//             }
//
//             if (
//                 // Blackberry 4.x - Tested on the Curve 8330
//                 t.version('BlackBerry') < 5.0 ||
//                 // Windows Mobile - Tested on the HTC Leo (WinMo 5.2)
//                 t.match('MSIEMobile|Windows CE.*Mobile') || t.version('Windows Mobile') <= 5.2
//             ) {
//                 return 'C';
//             }
//
//             return 'C';
//         }
//     };
//
//     exports(MobileDetect);
//
// })(function (data, undefined) {
//     if (typeof module !== 'undefined' && module.exports) {
//
//         data.isPhoneSized = function () {};
//         module.exports = data;
//
//     } else if (typeof window !== 'undefined') {
//
//         data.isPhoneSized = function (maxPhoneWidth) {
//             if (maxPhoneWidth < 0) {
//                 return undefined;
//             }
//             var physicalPixelWidth = window.screen.width,
//                 pixelRatio = window.devicePixelRatio || 1,
//                 cssPixelWidth = physicalPixelWidth / pixelRatio;
//
//             return cssPixelWidth <= maxPhoneWidth;
//         };
//
//         window.MobileDetect = data;
//     } else {
//         throw new Error('unknown environment'); // please file a bug if you get this error!
//     }
// });

/*jslint devel: true */
/*jslint nomen: true */

dexit.scp.device.registration.collectDeviceSpecs = function (callback) {

    let device = {};
    let deviceWidth = Dimensions.get('window').width;
    let deviceHeight = Dimensions.get('window').height;
    device.screenWidth = deviceWidth; //window.screen.width;
    device.screenHeight = deviceHeight;
    device.url = 'mobileapp://device';//window.location.href; (on android webview window.location does not work)

    getDeviceInfo().then((md) => {
        device = _.extend(device, md);
        callback(null, device);
    }).catch((err) => {
        console.log('unable to retrieve device info');
        device.infoHasError = true;
        callback(null, device);
    });




    // // device.screenHeight = window.screen.height;
    // device.mobile = md.mobile();
    // device.phone = md.phone();
    // device.tablet = md.tablet();
    // device.userAgent = md.userAgent();
    // device.os = md.os();
    // device.isIphone = md.is('iPhone');
    // device.isBot = md.is('bot');
    // device.webkit = md.version('Webkit');
    // device.build = md.versionStr('Build');
    // device.playStationOrXbox = md.match('playstation|xbox');

    // callback(null, device);

    // var md = new MobileDetect(window.navigator.userAgent);
    //

    //
    // var device = {};
    // let deviceWidth = Dimensions.get('window').width;
    // let deviceHeight = Dimensions.get('window').height;
    //
    // device.screenWidth = deviceWidth; //window.screen.width;
    // device.screenHeight = deviceHeight;
    //
    // // device.screenHeight = window.screen.height;
    // device.mobile = md.mobile();
    // device.phone = md.phone();
    // device.tablet = md.tablet();
    // device.userAgent = md.userAgent();
    // device.os = md.os();
    // device.isIphone = md.is('iPhone');
    // device.isBot = md.is('bot');
    // device.webkit = md.version('Webkit');
    // device.build = md.versionStr('Build');
    // device.playStationOrXbox = md.match('playstation|xbox');
    // device.url = 'mobileapp://device';//window.location.href; (on android webview window.location does not work)
    // callback(null, device);
};

/*jslint devel: true */
/*jslint nomen: true */

dexit.scp.device.registration.Registery = function () {
    'use strict';

};
/**
 * Register device with CB
 * @param data
 * @param callback
 */
dexit.scp.device.registration.Registery.prototype.register= function (data, callback){
    function isFunction(obj) {
        return Object.prototype.toString.call(obj) === "[object Function]";
    }


    if (!dexit.scp.device.registration.config) {
        console.log("Configuration was not set!");
        return callback(new Error("Configuration was not set"));
    }

    var deviceData;
    //backwards compatible check for single parameters
    if (arguments && arguments.length === 1){
        callback = data;
    }else if (arguments && arguments.length === 2) {
        deviceData = data;
    }
    async.auto({
        deviceFromCache: function(cb) {
            //check if device already registered
            AsyncStorage.getItem('device',function (err, data) {
                if (err || !data){
                    //console.warn('error getting from local storage on device');
                    return cb();
                }
                let obj = null;
                try {
                    obj = JSON.parse(data);
                }catch(e){
                }
                cb(null,obj);
            });
        },
        registerDevice: ['deviceFromCache',function(result, cb){
            if (result.deviceFromCache) {
                return cb(null, result.deviceFromCache);
            }
            console.log("resource:device registration, message:device not registered");
            dexit.scp.device.registration.collectDeviceSpecs(function(error, device){
                if(error){
                    console.log("resource:device registration, action:collect device specs, error:" + err.message);
                    return cb(error);
                }
                if (deviceData) { //if additional data is supplied then also save it.  to support mobile registration
                    device = _.extend(device, data);
                }
                console.log("resource:device registration, action:collect device specs, message:collected device specs");

                //register device
                dexit.scp.device.registration.backend.cb.registerDevice(device, function(err, uuid){
                    if(!err){
                        device.id = uuid;
                        AsyncStorage.setItem('device',JSON.stringify(device), function(err){
                            if (err) {
                                console.warn('could not save device info to device');
                            }
                            cb(null, device);
                        });

                    }else {
                        console.log("resource:device registration, message:error registering device:"+JSON.stringify(err));
                        cb(err);
                    }

                });
            });

        }]
    }, function(err, result){
        if (err) {
            console.log("resource:device registration, action:collect device specs, error:" + err.message);
            return callback(err);
        }
        let device =  result.registerDevice;

        dexit.scp.device.registration.device  = device;
        console.log("resource:device registration,uuid:" + device.id + ", message:device already registered");
        callback(null, device);
    });





    // try {
    //
    //     var device = JSON.parse(localStorage.getItem('device'));
    // }catch(e){
    //
    // }
    //
    // if(device) {
    //     dexit.scp.device.registration.device  = device;
    //     console.log("resource:device registration,uuid:" + device.id + ", message:device already registered");
    //     console.log(JSON.stringify(device));
    //     callback(null, device);
    // } else {
    //     console.log("resource:device registration, message:device not registered");
    //     dexit.scp.device.registration.collectDeviceSpecs(function(error, device){
    //         if(error){
    //             console.warn("resource:device registration, action:collect device specs, error:" + JSON.stringify(error));
    //             return callback(error);
    //         }
    //         if (deviceData) { //if additional data is supplied then also save it.  to support mobile registration
    //             device = _.extend(device, data);
    //         }
    //         console.log("resource:device registration, action:collect device specs, device specs:"
    //             +JSON.stringify(device)+", message:collected device specs");
    //         dexit.scp.device.registration.device = device;
    //
    //         //register device
    //         dexit.scp.device.registration.backend.cb.registerDevice(device, function(err, uuid){
    //             if(!err){
    //                 dexit.scp.device.registration.device.id = uuid;
    //                 localStorage.setItem('device', JSON.stringify(device));
    //                 callback(null, dexit.scp.device.registration.device);
    //             }else {
    //                 console.log("resource:device registration, message:error registering device:"+JSON.stringify(err));
    //                 callback(err);
    //             }
    //
    //         });
    //     });
    // }

};

//register the device
dexit.scp.device.registration.registery = new dexit.scp.device.registration.Registery();

/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit */
/*jshint -W079 */

/* check for top level namespace */
// if (!dexit) {
//     var dexit = {};
// }
if(!dexit.scp){
    dexit.scp={};
}
if(!dexit.scp.device){
    dexit.scp.device={};
}
dexit.scp.device.resolution={};



/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit */

/**
 *
 * @param config {object}
 * @constructor
 */
dexit.scp.device.resolution.Configuration = function(config) {
    "use strict";
    //SCP Endpoint
    var tpmUrl = config.tpmUrl || '',
        authToken = config.authToken || '';

    this.getEndPoints  = function () {
        var endpoints = {
            tpm : tpmUrl
        };
        return endpoints;
    };

    this.getAuthToken = function() {
        return authToken;
    };
    this.setAuthToken = function(token) {
        authToken = token;
    };
    this.cacheExpiryMinutes = config.cacheExpiryMinutes;

};


dexit.scp.device.resolution.loadConfiguration = function(config) {
    if (!config) {
        throw new Error("Configuration is required")
    }
    dexit.scp.device.resolution.config = new dexit.scp.device.resolution.Configuration(config);
};




/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, $ */
/* check if namespace exists */
if (!dexit.scp.device.resolution.backend) {
    dexit.scp.device.resolution.backend = {};
}

dexit.scp.device.resolution.backend.Tpm = function() {

    var self = this;

    this.resolveTouchpoints = function (deviceId, url, callback) {
        console.log("URL:"+dexit.scp.device.resolution.config.getEndPoints().tpm);

        var auth = dexit.scp.device.resolution.config.getAuthToken();
        var headers = new Headers();
        headers.set('Content-Type','application/json');
        headers.set('Accept','application/json');
        if (auth) {
            headers.set('Authorization','Bearer ' + auth);
        }
        let request = new Request(dexit.scp.device.resolution.config.getEndPoints().tpm+'touchpoint/resolve', {
            method: 'post',
            credentials: 'same-origin',
            headers: headers,
            body: JSON.stringify({deviceId:deviceId, url:url})
        });

        fetch(request).then((data) => {
            if (data.status === 200) {

                // if (typeof data === 'string' || data instanceof String){
                return data.json();
            } else {
                throw new Error('invalid response:' + data.status);
            }
            //
        }).then(res => {
            console.log("resource:touchpoint resolution, action:resolve device touchpoint,device:" + deviceId + "," +
                "touchpoints:" + JSON.stringify(res) + ", message:touchpoint obtained");
            callback(null, res);
        }).catch((err) => {
            console.log("resource:device registration, action:register device, error:" + JSON.stringify(err));
            callback(err);
        });


        // $.ajax({
        //     type: "POST",
        //     url: dexit.scp.device.resolution.config.getEndPoints().tpm+"touchpoint/resolve",
        //     crossDomain: true,
        //     data: JSON.stringify({deviceId:deviceId, url:url}),
        //     contentType: 'application/json',
        //     beforeSend: function( xhr ) {
        //         var auth = dexit.scp.device.resolution.config.getAuthToken();
        //         if (auth) {
        //             xhr.setRequestHeader('Authorization', 'Bearer ' + auth);
        //         }
        //
        //     }
        //
        // }).done(function (data) {
        //     console.log("resource:touchpoint resolution, action:resolve device touchpoint,device:"+deviceId+"," +
        //         "touchpoints:"+JSON.stringify(data)+", message:touchpoint obtained");
        //     if (typeof data === 'string' || data instanceof String){
        //         data = JSON.parse(data);
        //     }
        //     callback(null,data);
        // }).fail(function (xhr, textStatus, errorThrown) {
        //     console.warn("resource:device resolution, action:resolve device touchpoint, error:" + JSON.stringify(xhr));
        //     callback(xhr);
        //
        // });

    };

    this.getChannel = function (channelId, callback) {

        let auth = dexit.scp.device.resolution.config.getAuthToken();
        let headers = new Headers();
        headers.set('Accept','application/json');
        if (auth) {
            headers.set('Authorization','Bearer ' + auth);
        }
        let request = new Request(dexit.scp.device.resolution.config.getEndPoints().tpm+"channel/" + channelId, {
            method: 'get',
            credentials: 'same-origin',
            headers: headers,
        });

        fetch(request).then((data) => {
            if (data.status === 200) {
                return data.json();
            } else {
                throw new Error('unexpected response:' + data.status);
            }
        }).then(res => {
            console.log("resource: channel action: get data: "+JSON.stringify(res));
            callback(null,res);
        }).catch((err) => {
            console.log("resource: channel action: get error:" + JSON.stringify(err));
            callback(err);
        });

        // $.ajax({
        //     type: "GET",
        //     url: dexit.scp.device.resolution.config.getEndPoints().tpm+"channel/" + channelId,
        //     crossDomain: true,
        //     accept: 'application/json',
        //     beforeSend: function( xhr ) {
        //         var auth = dexit.scp.device.resolution.config.getAuthToken();
        //         if (auth) {
        //             xhr.setRequestHeader('Authorization', 'Bearer ' + auth);
        //         }
        //
        //     }


        // }).done(function (data) {
        //
        //     console.log("resource: channel action: get data: "+JSON.stringify(data));
        //
        //     if (typeof data === 'string' || data instanceof String){
        //         data = JSON.parse(data);
        //     }
        //
        //     callback(null,data);
        // }).fail(function (xhr, textStatus, errorThrown) {
        //
        //     console.warn("resource: channel action: get error:" + JSON.stringify(xhr));
        //
        //     callback(xhr);
        // });
    }
};

dexit.scp.device.resolution.backend.tpm = new dexit.scp.device.resolution.backend.Tpm();

/*jslint devel: true */
/*jslint nomen: true */
/*global dexit */
/*global lscache */

dexit.scp.device.resolution.TouchPoint = function () {
};

dexit.scp.device.resolution.TouchPoint.prototype.resolve= function (url, callback){

    //replace lscache with AsyncStorage
    //lscache.setBucket(url);

    if(! dexit.scp.device.registration.device){
        console.log("can't resolve touchpoint of a device that is not registered");
        return callback("device is not registered");
    }

    //check if touchpoint is already resolved
    //var touchpoint =lscache.get('touchpoint');



    async.auto({
        tpFromCache: function(cb) {
            AsyncStorage.getItem('touchpoint', function (err, data) {
                if (err || !data) {
                    cb();
                }else {
                    let obj = null;
                    try {
                        obj = JSON.parse(data);
                    }catch(e){
                    }
                    cb(null,obj);
                }

            });
        },
        resolveTP: ['tpFromCache',function(result, cb) {
            if (result.tpFromCache && result.tpFromCache.touchpoint) {
                return cb(null, result.tpFromCache);
            }
            dexit.scp.device.resolution.backend.tpm.resolveTouchpoints(dexit.scp.device.registration.device.id, url, function(err, data){
                if(err){
                    return cb(err);
                }

                /* check if channel instance is registered */
                if ( data.channel_id ) {

                    /* get channel details */
                    dexit.scp.device.resolution.backend.tpm.getChannel(data.channel_id, function(error, channelData) {
                        if (error) {
                            console.log("resource: touchpoint action: resolve channel data: {error: " + error.statusText + "}");
                            return cb(error);
                        } else {

                            /* assign channel details to TP data */
                            data.channel = channelData;

                            /* store reference in dexit namespace */
                            dexit.scp.device.resolution.touchpoint = data;
                            //var cacheExpiryMinutes = dexit.scp.device.resolution.config.cacheExpiryMinutes || (60*24);
                            AsyncStorage.setItem('touchpoint', JSON.stringify(data), function(err) {
                                if (err) {
                                    console.log('warning cannot store touchpoint in local storage');
                                }
                                return cb(null, data);
                            });
                        }
                    });
                } else {

                    console.warn("resource: touchpoint action: resolve error: message=no channel instance");
                    cb(new Error("No channel instance found."));
                }

            });



        }]
    }, function (err, results) {
        if (err) {
            console.log('resource: touchpoint action: resolve data:' +err.message);
            return callback(err);
        }
        let touchpoint = results.resolveTP;
        dexit.scp.device.resolution.touchpoint  = touchpoint;
        console.log("resource: touchpoint action: resolved local storage data: {device: " + dexit.scp.device.registration.device.id  + "}");
        //console.log(JSON.stringify(touchpoint));
        callback(null, touchpoint);
    });





    // if(touchpoint && touchpoint.touchpoint) {
    //
    //     dexit.scp.device.resolution.touchpoint  = touchpoint;
    //
    //
    // } else {
    //
    //     console.log("resource: touchpoint action: resolve data: {device: " + dexit.scp.device.registration.device.id + "}");
    //
    //     dexit.scp.device.resolution.backend.tpm.resolveTouchpoints(dexit.scp.device.registration.device.id, url, function(err, data){
    //
    //         if(!err){
    //
    //             console.log("resource: touchpoint action: resolved data: {device: " + dexit.scp.device.registration.device.id  + "}");
    //             console.log(JSON.stringify(data));
    //
    //             /* check if channel instance is registered */
    //             if ( data.channel_id ) {
    //
    //                 /* get channel details */
    //                 dexit.scp.device.resolution.backend.tpm.getChannel(data.channel_id, function(error, channelData) {
    //
    //                     if (error) {
    //
    //                         console.log("resource: touchpoint action: resolve channel data: {error: " + error.statusText + "}");
    //
    //                         return callback(error);
    //                     } else {
    //
    //                         /* assign channel details to TP data */
    //                         data.channel = channelData;
    //
    //                         /* store reference in dexit namespace */
    //                         dexit.scp.device.resolution.touchpoint = data;
    //                         var cacheExpiryMinutes = dexit.scp.device.resolution.config.cacheExpiryMinutes || (60*24);
    //                         lscache.set('touchpoint', data, cacheExpiryMinutes);
    //                         return callback(null, data);
    //                     }
    //                 });
    //             } else {
    //
    //                 console.warn("resource: touchpoint action: resolve error: message=no channel instance");
    //                 callback({message:"No channel instance found."});
    //             }
    //         } else {
    //
    //             console.log("resource: touchpoint action: resolve data: {error: " + err.message + "}");
    //
    //             callback(err);
    //         }
    //     });
    // }
};

//Touchpoint
dexit.scp.device.resolution.tpr = new dexit.scp.device.resolution.TouchPoint();

/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*jslint -W117 */
/* check for top level namespace */
// if (!dexit) {
//     dexit = {};
// }

/* create namespace for this project */
dexit.ep = {};

/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, toString */
/*jshint -W116 */
/* initialize this namespace */
if (!dexit.util) {
    dexit.util = {};
}

dexit.util.getURL = function () {

    this.URL = window.location;
    console.log("URL: " + this.URL);
    return this.URL;
};

dexit.util.isArray = function(o) {
    return toString.call(o) == "[object Array]";
};

/** borrowed from dojo/io-query.js */
dexit.util.queryToObject =  function (/*String*/ str){
    'use strict';

    // summary:
    //      Create an object representing a de-serialized query section of a
    //      URL. Query keys with multiple values are returned in an array.
    //
    // example:
    //      This string:
    //
    //  |       "foo=bar&foo=baz&thinger=%20spaces%20=blah&zonk=blarg&"
    //
    //      results in this object structure:
    //
    //  |       {
    //  |           foo: [ "bar", "baz" ],
    //  |           thinger: " spaces =blah",
    //  |           zonk: "blarg"
    //  |       }
    //
    //      Note that spaces and other urlencoded entities are correctly
    //      handled.

    // FIXME: should we grab the URL string if we're not passed one?
    var dec = decodeURIComponent, qp = str.split("&"), ret = {}, name, val;
    for(var i = 0, l = qp.length, item; i < l; ++i){
        item = qp[i];
        if(item.length){
            var s = item.indexOf("=");
            if(s < 0){
                name = dec(item);
                val = "";
            }else{
                name = dec(item.slice(0, s));
                val  = dec(item.slice(s + 1));
            }
            if(typeof ret[name] == "string"){ // inline'd type check
                ret[name] = [ret[name]];
            }

            if(dexit.util.isArray(ret[name])){
                ret[name].push(val);
            }else{
                ret[name] = val;
            }
        }
    }
    return ret; // Object
};

dexit.util.parseURL = function (url) {
    'use strict';

    var queryStr;

    queryStr = url.substring(url.indexOf('?') + 1, url.length);

    return dexit.util.queryToObject(queryStr);
};

/*global dexit:false */

dexit.ep.Configuration = function(config) {
    var authToken = config.authToken || '',
        upmUrl = config.upmUrl || '',
        scpUrl = config.scpUrl || '',
        lpmUrl = config.lpmUrl || '';

    this.getEndpoints = function() {
        var endpoints = {
            upm: upmUrl,
            scp: scpUrl,
            lpm: lpmUrl
        };
        return endpoints;
    };

    this.getAuthToken = function() {
        return authToken;
    };
    this.setAuthToken = function(token) {
        authToken = token;
    };
};


dexit.ep.loadConfiguration = function(config) {
    if (!config) {
        throw new Error("Configuration is required")
    }
    dexit.ep.config = new dexit.ep.Configuration(config);


};

/*jslint browser: true */
/*global $, dexit */
if (!dexit.ep.integration) {
    dexit.ep.integration = {};
}
dexit.ep.integration.rest = {};
dexit.ep.integration.rest.Strategy = {};

dexit.ep.integration.rest.Strategy = function (endpoint, resource) {
    "use strict";

    var self = this,
        url_base = endpoint,
        url_resource = resource,
        url = url_base + url_resource;

    self.retrieve = function (callback) {


        let auth = dexit.ep.config.getAuthToken();
        let headers = new Headers();
        headers.set('Accept','application/json');
        if (auth) {
            headers.set('Authorization','Bearer ' + auth);
        }
        let request = new Request(url, {
            method: 'get',
            credentials: 'same-origin',
            headers: headers,
        });

        fetch(request).then((data) => {
            if (data.status === 200) {
                return data.json();
            } else {
                throw new Error('unexpected response:' + data.status);
            }
        }).then(res => {
            callback(null,res);
        }).catch((err) => {
            console.log("resource: get error:" + JSON.stringify(err));
            callback(err);
        });
    };
};

//Create a new instance/class of the ICE-P Configuration
dexit.ep.integration.userprofile = {};

dexit.ep.integration.userprofile.retrieve = function (uuid, callback) {
    var url = dexit.ep.config.getEndpoints().upm,
        resource = uuid,
        Strategy = new dexit.ep.integration.rest.Strategy(url,resource);

    Strategy.retrieve(callback);
};

/*jslint browser: true */
/*global $, dexit */

dexit.ep.integration.locationprofile = {};

dexit.ep.integration.locationprofile.retrieve = function (id, callback) {

    //compatability
    if (!callback) {

        callback = id;

    }


    var url = dexit.ep.config.getEndpoints().lpm+'/profiles/location/' + id;

    let auth = dexit.ep.config.getAuthToken();
    let headers = new Headers();
    headers.set('Accept','application/json');
    if (auth) {
        headers.set('Authorization','Bearer ' + auth);
    }
    let request = new Request(url, {
        method: 'get',
        credentials: 'same-origin',
        headers: headers,
    });

    fetch(request).then((data) => {
        if (data.status === 200) {
            return data.json();
        } else {
            throw new Error('unexpected response:' + data.status);
        }
    }).then(res => {
        callback(null,res);
    }).catch((err) => {
        console.warn("resource: get error:" + JSON.stringify(err));
        callback(err);
    });


    // $.ajax(
    //     {
    //         url: url,
    //         type: 'GET',
    //         dataType: 'json',
    //         headers: {
    //             'Accept': 'application/json'
    //         },
    //         beforeSend: function( xhr ) {
    //             var auth = dexit.ep.config.getAuthToken();
    //             if (auth) {
    //                 xhr.setRequestHeader('Authorization', 'Bearer '+auth);
    //             }
    //
    //         },
    //         success: function (result) {
    //             callback(undefined, result);
    //         },
    //         error: function (XHR, textStatus, errorThrown) {
    //             //Create an Error Object
    //             var error = { responseText: XHR.responseText, status: XHR.status, statusText: XHR.statusText };
    //             //Pass back the Error
    //             callback(error);
    //         }
    //     }
    // );
};


/*jslint node: true */
/*jslint browser: true */
/*global dexit */
/*global $, _, async */

/**
 * Engagement Platform APIs
 */
function EPLib(underscore, asyncDependency, locationProfileLib, scc) {
    'use strict';

    var self = this;

    /* store different profile information used by EP */
    self.profile = {};

    /* external libs; browser & node compatible */
    if (typeof _ !== 'undefined' && _) {
        self._ = _;
    } else if (underscore) {
        self._ = underscore;
    }
    if (!self._) {
        console.log("WARNING: No unserscore dependency found");
    }

    if (typeof async !== 'undefined' && async) {
        self.async = async;
    } else if (asyncDependency) {
        self.async = asyncDependency;
    }
    if (!self.async) {
        console.log("WARNING: No async dependency found");
    }

    if (typeof dexit !== 'undefined' && dexit) {
        self.locationProfileLib = dexit.ep.integration.locationprofile;
    } else if (locationProfileLib) {
        self.locationProfileLib = locationProfileLib;
    }

    if (!self.locationProfileLib) {
        console.warn("WARNING: locationProfileLib dependency found");
    }

    if (typeof dexit !== 'undefined' && dexit) {
        self.scc = dexit.scd;
    } else if (scc) {
        self.scc = scc;
    }



    /* TODO: more generic approach for caching */
    self.location = [];
}

/**
 * Set user Id to update/load user profile
 */
EPLib.prototype.setUserProfile = function (profile) {

    this.profile.user = profile;
};

/**
 * Set location to update/load location profile
 */
EPLib.prototype.setLocationProfile = function (profile) {

    this.profile.location = profile;
};

/**
 * Method to personalize multimedia text.
 *
 * Uses self.profile objects, and iterates through text to look for all availbe profile references.
 */
EPLib.prototype.personalize = function (mm) {

    var self = this;

    for (var profile in self.profile) {

        //add support for new user profile structure (ie.
        // user:{
        //  attributes:{
        //                name:"username"
        //             }
        //  }

        /* async.forEach(mm)*/
        self.async.each(mm, function (mmItem, asyncEachCB) {

            if(self.profile[profile].attributes){
                for (var attribute in self.profile[profile].attributes){
                    self.profile[profile][attribute] = self.profile[profile].attributes[attribute];
                }

            }
            /* check what text to localize */
            var mmType = mmItem.kind;
            var mmElement;
            if (mmType === 'multimediabody#text') {

                /* assign part of multimedia needed for EP */
                mmElement = mmItem.property.content;

            }else { //mmType === 'multimedia#video' || mmType === 'multimedia#image' || mmType === 'multimedia#audio'

                /* assign part of multimedia needed for EP */
                mmElement = mmItem.property.location;
            }
            /* parse all variables to substitute */
            var variables = self.variables(profile, mmElement);

            for (var i = 0; i < variables.length; i++) {
                var element = variables[i];

                /* get value from profile object */
                var value = eval("self.profile." + element[2]);
                /* substitue variable in text */
                if (value) {
                    /* check if there is a modifier. eg. * sympbol */
                    var modifier = element[1];
                    if (modifier) {
                        value = modifier + value;
                    }
                    mmElement = mmElement.replace(element[0], value);
                }
            }
            if (mmType === 'multimediabody#text') {

                /* assign part of multimedia needed for EP */
                mmItem.property.content = mmElement;

            }else { //mmType === 'multimedia#video' || mmType === 'multimedia#image' || mmType === 'multimedia#audio'

                /* assign part of multimedia needed for EP */
                mmItem.property.location = mmElement;
            }

            asyncEachCB();
        });
    }

    /* pass back the mm array */
    return mm;
};

/**
 * Method to localize smart content
 */
EPLib.prototype.localize = function (mm, locationId, callback) {

    if (!locationId) {
        console.info('resource:smart content action: localize, message:undefined locationId, ignoring localization');
        return callback();
    }

    /* this function extracts all the variable parts and
     * adds the custom location to the multimedia object if found */
    function extractLocationandVars(str) {

        /* regex to match all dynamic text */
        var re= /{{(.*?)[\|\|.*?]?}}/g;

        /* store results */
        var results = [];
        /* find next match */
        var text = re.exec(str);
        do {
            var result = {
                text: text
            };

            //if a location is specified in the text then extract that
            var index = text[1].indexOf(":");
            if (index !== -1 ){
                result.location = text[1].substring(0,index);
            }

            /* text is the matched array
             * 0: {{element.\w}}
             * 2: element.\w
             */
            results.push(result);

            /* move to next item */
            text = re.exec(str);
        } while (text);

        return results;
    }

    /* keep a reference to self */
    var self = this;

    var datastoreBackwardCompatiblity;

    /* itereate through each multimedia */
    self.async.each(mm, function (mmItem, asyncEachCB) {

            /* check what text to localize */
            var mmType = mmItem.kind;
            var mmElement;
            if (mmType === 'multimediabody#text') {

                /* assign part of multimedia needed for EP */
                mmElement = mmItem.property.content;

            }else { //mmType === 'multimedia#video' || mmType === 'multimedia#image' || mmType === 'multimedia#audio'

                /* assign part of multimedia needed for EP */
                mmElement = mmItem.property.location;
            }

            /* extract location from dynamic parts of multimedia */
            var variables = extractLocationandVars(mmElement);

            /* add runtime properties of multimedia */
            if (!mmItem.property.runtime) {
                mmItem.property.runtime = {};
            }
            mmItem.property.runtime.variables = variables;

            /*TODO: only support one location at the moment */
            var name = variables[0].location || locationId;
            if (!name) {
                return callback(); //no localization required
            }

            /* check if we already retrieved this location */
            var thisLocation = self._.find(self.location, function(obj) {
                return obj.id === name;
            });

            if (!thisLocation) {

                /* add to the array */
                self.location.push({
                    id: name,
                    state: "pending"
                });

                self.locationProfileLib.retrieve(name, function (err, profile) {

                    if (err) {
                        console.warn('resource: location profile action:retrieve, error: ' +
                            JSON.stringify({id: locationId, error: err}) );
                        return callback();
                    }

                    var localDataStore;
                    if (!profile || !profile.datastore) {
                        console.log("resource:location profile action:retrieve locationId:" + locationId + ",profile:" + JSON.stringify(profile) +
                            ", message: missing or invalid location profile, ignoring localization");
                        return callback();
                    }else {
                        localDataStore = profile.datastore;
                    }
                    console.log("resource:location profile action:retrieve locationId:" + locationId + ",profile:" + JSON.stringify(profile) +
                        ", message: retrieved location profile");

                    /* find the location in local cache */
                    var thisLocation = self._.find(self.location, function(obj) {
                        return obj.id === name;
                    });
                    /* update retrieved location to our local cache */
                    datastoreBackwardCompatiblity= localDataStore;
                    thisLocation.datastore = localDataStore;
                    thisLocation.state= "ok";
                    asyncEachCB(err);
                });
            } else if (thisLocation.state === "ok") {

                asyncEachCB();
            } else {
                asyncEachCB();
            }
        },
        function (err) {

            callback(err,datastoreBackwardCompatiblity);
        }
    );
};

/**
 * Method to contexualize multimedia text
 *
 * TODO: only does substitution of variables from intelligence
 */
EPLib.prototype.resolve = function (mm, scObject, key, datastore,callback) {

    var self = this;

    /* if key not provided; return */
    if (!key) {
        return callback(undefined, mm);
    }

    var concept = {};

    self.async.series({
        resolveIntelligence: function(cb) {

            /* get all the values into the array */
            var intelligence = Object.keys(scObject.intelligence).map(function (key) {
                return scObject.intelligence[key];
            });
            /* iterate over the values */
            self.async.each(intelligence, function (ci, asyncEachCB) {

                /* check if we already have this intelligence */
                if (concept[ci.property.name]) {
                    return asyncEachCB();
                }

                /* store the ID */
                concept[ci.property.name] = {
                    id: ci.id
                };

                /* for each information of the concept */
                for (var infoId in ci.information) {
                    var ii = ci.information[infoId];
                    if (ii.property.isKey && ii.property.isKey.toLowerCase() === 'true') {
                        concept[ci.property.name].key = ii.property.name;

                    }
                }

                /* user filter to pass parameters to getData API */
                var filter = {
                    key: concept[ci.property.name].key,
                    id: key.value,
                    ds_location: datastore
                }
                if (datastore) {
                    filter["ds_location"] = datastore.split(':')[1];
                }
                if (!filter.key) {
                    console.log("no key in the intelligence...skipping");
                    asyncEachCB();

                }else {
                    // a workaround for different implementation of node SCObject
                    if (scObject.constructor.name === 'ScObjectWrapper') {

                        scObject.getData(filter, handleGetDataResults);
                    } else if (scObject.intelligence && scObject.intelligence[concept[ci.property.name].id]) {

                        scObject.intelligence[concept[ci.property.name].id].getData(filter, handleGetDataResults);
                    }else {
                        console.log("system intell...skipping");
                        asyncEachCB();

                    }
                }
                /* get the data for the concept */
                function handleGetDataResults(error, data) {
                    /* flatten instance data @ the concept level */
                    if (data) {
                        for (var d in data[0]) {
                            concept[ci.property.name][d] = data[0][d];
                        }
                    }

                    /* log any errors, don't pass error back to caller,
                     * this will result in dynamic text to be sanitized
                     * and removed from presenation.
                     */
                    if (error) {
                        console.warn("resource: intelligence action: retrieve data error: "+JSON.stringify(error));
                    }
                    asyncEachCB();
                }
            }, function (error) {

                /* send back text to caller */
                cb(error);
            });
        },
        resolveDynamicFields: function(cb) {

            self.async.each(mm, function (mmItem, asyncEachCB) {

                /* check what text to localize */
                var mmType = mmItem.kind;
                var mmElement;
                if (mmType === 'multimediabody#text') {

                    /* assign part of multimedia needed for EP */
                    mmElement = mmItem.property.content;

                }else { //mmType === 'multimedia#video' || mmType === 'multimedia#image' || mmType === 'multimedia#audio'

                    /* assign part of multimedia needed for EP */
                    mmElement = mmItem.property.location;
                }

                /* get all variables to be resolved */
                var variables = self.variables("\\w+", mmElement);
                /* itereate through each mmItem variables */
                for (var idx in variables) {
                    var value = variables[idx];
                    try {
                        //removed curly brackets value[2], and resolving against the concept object
                        var dataValue = eval("concept." + value[2]);
                        if (dataValue) {
                            mmElement = mmElement.replace(value[0], dataValue);
                            var regex = new RegExp("\{([\\*\\-\\+\\/]*?)\{" + value[2] + "\}([\\+\\-\\*\\/]*?)\}", 'g');
                            var replaceWith = "$1" + dataValue + "$2";
                            mmElement = mmElement.replace(regex, replaceWith);
                        }
                    }
                        /* ignore */
                    catch (e) {
                    }
                }
                /* update the specific multimedia element */
                if (mmType === 'multimediabody#text') {
                    mmItem.property.content = mmElement;
                }else { //mmType === 'multimedia#video' || mmType === 'multimedia#image' || mmType === 'multimedia#audio'
                    mmItem.property.location = mmElement;
                }

                asyncEachCB();
            }, function(err) {
                cb(err);
            });
        }
    },function (err) {
        callback(err,mm);
    });
};

/**
 * Remove any non-personalized, or non-localized text that is in the control structure {{something}}
 *
 * @param text The text to sanatize
 * @returns {XML|string|void}
 */
EPLib.prototype.sanitize = function (mm) {

    for (var idx in mm) {

        var mmItem = mm[idx];

        /* match any ' {(math operator){word.word.word}(math operator)}'
         * with one or more leading spaces
         */
        var regex = new RegExp(" *\\{{1}([\\*\\-\\+\\/]*?)\\{{1}([\\.\\w]+)\\}([\\+\\-\\*\\/]*?)\\}", 'g');

        /* check what text to localize */
        var mmType = mmItem.kind;
        var mmElement;
        if (mmType === 'multimediabody#text') {

            /* assign part of multimedia needed for EP */
            mmElement = mmItem.property.content;
            mmItem.property.content = mmElement.replace(regex, "").trim();

        }else { //mmType === 'multimedia#video' || mmType === 'multimedia#image' || mmType === 'multimedia#audio'

            /* assign part of multimedia needed for EP */
            mmElement = mmItem.property.location;
            mmItem.property.location = mmElement.replace(regex, "").trim();
        }
    }

    return mm;
};

EPLib.prototype.evaluate = function (mm) {

    for (var idx in mm) {

        var mmItem = mm[idx];

        /* check what text to localize */
        var mmType = mmItem.kind;
        var mmElement;
        if (mmType === 'multimediabody#text') {

            /* assign part of multimedia needed for EP */
            mmElement = mmItem.property.content;

        }else { //mmType === 'multimedia#video' || mmType === 'multimedia#image' || mmType === 'multimedia#audio'

            /* assign part of multimedia needed for EP */
            mmElement = mmItem.property.location;
        }

        var evaluatedText = mmElement.trim();

        var regex = new RegExp("({+(.*?}{2})+)", "g")
            , matchedText
            , result = [];

        while (matchedText = regex.exec(evaluatedText)) {

            result.push(matchedText);
        }

        var evaluateExpression = function (element) {

            /* drop the brackets */
            var regex = new RegExp("[\\{\\}\]*", "g");
            var evaluate = element[0].replace(regex, "");
            /* evaluate */
            var value;
            try {
                value = eval(evaluate);
            }
            catch (e) {
            }
            /* ignore */

            /* substitue variable in text */
            evaluatedText = evaluatedText.replace(element[0], value ? value : "");
        };

        result.forEach(evaluateExpression);
    }

    return mm
};

EPLib.prototype.variables = function (element, str) {

    var self = this;

    /* find matches for {{*.}} */
    function getWordsBetweenCurlies(str) {

        /*
         * tested @ regex101.com/#javascript
         /*       regex: \{(.*?)\{(\w[\.\w+]+)\}\}
         * test string: This is price {{product.price{*{user.discount}}
         * */
        var pattern = '\\{([\*]*?)\\{(' + element + '[\\.\\w]+)\\}\\}';
        var results = []
            , re = new RegExp(pattern, "g")
            , text;

        /* find next match */

        while (text = re.exec(str)) {

            /* text is the matched array
             * 0: {{element.\w}}
             * 1: <operator str> eg. *
             * 2: element.\w
             */
            results.push(text);
        }

        return results;
    }

    return getWordsBetweenCurlies(str);
};

EPLib.prototype.apply = function (mm, scObject, key, locationId, callback) {

    var self = this;

    /* assign mm list for local scope */
    var mmArray = mm;

    /* apply localization of intelligence and override location if specified */
    self.localize(mm, locationId, function (err, datastore) {
        if (err) {
            console.log('resource: location action: retrieve error: '+err.message);
            return callback(err);
        }

        /* run personalize algorithim on the multimedia text */
        var personalizedMM = self.personalize(mmArray);


        /* apply contextualization of intelligence */
        self.resolve(personalizedMM, scObject, key, datastore,function (error, resolvedMM) {

            /* santitize the final data */
            var sanitizedMM = self.sanitize(resolvedMM);

            /* apply evaluate to all variables */
            var evaluatedMM = self.evaluate(sanitizedMM);

            callback(error, evaluatedMM);
        });
    });
};

//check if it is running on client side
/* instantiate the EP object */
if (typeof dexit !== 'undefined' && dexit) {
    dexit.ep.lib = new EPLib();
} else {
    //it is running on the server side so use node js module exports
    module.exports = EPLib;
}

/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit */
/*global $, _ */

/**
 * Engagement Platform APIs
 * @param {object} args - initialization arguments
 * @param {string} [args.authToken] - access token
 * @param {string} [args.upmUrl] - user profile service URL
 * @param {string} [args.scpUrl] - sc-platform-cloud service URL
 * @param {string} [args.lpmUrl] - location profile service URL
 * @param {boolean} [args.skipLoadFromUrl=false] - flag to set, so not to load user from query parameters
 *
 * @constructor
 */
dexit.EP = function (args) {
    'use strict';

    var self = this;

    //load configuration

    /* store different profile information used by EP */
    self.profile = {};


    self._loadConfig(args);

    /**
     * constructor method
     */
    (function () {
        /* loading state */
        self.state = "ready";
        if (!args.skipLoadFromUrl) {
            return;
        }

        //if userId is in args get it from there

        //FIX: comment out for device

        // /* parse the url for query parameters */
        // var query = dexit.util.parseURL(window.location.href);
        //
        // var userId = query.user;
        //
        // /* retrieve user profile */
        // if (userId) {
        //     self.state = "loading#user";
        //     self.setUserId(userId);
        // }
    }());
};


dexit.EP.prototype._loadConfig = function(config) {
    if (!config) {
        throw new Error("Configuration is required")
    }
    dexit.ep.loadConfiguration(config);
};


/**
 * Set user Id to update/load user profile
 */
dexit.EP.prototype.setUserId = function(userId, callback) {

    var self = this;

    //make sure atleast no-op callback
    self.callback = self.callback || function () {};

    //optionally user callback directly
    callback = callback || self.callback;

    /**
     * Handle Application Profile
     */
    function handleUserProfile(error, data) {

        var userId;

        if (error) {

            console.log("resource: user profile action: handle response error: " + JSON.stringify(error));
        } else {

            console.log("resource: user profile action: handle response data: " + JSON.stringify(data));
            dexit.ep.lib.setUserProfile(data);
        }

        /* set the state to ready */
        self.state = "ready";

        callback(error);
    }


    //FIXME: skip is user is loaded
    if (dexit.ep.lib.profile.user) {
        self.state = "ready";
        callback();
    }else {

        self.state = "loading#user";
        console.log("ep:state: " + self.state);
        dexit.ep.integration.userprofile.retrieve(userId, handleUserProfile);
    }
};


/**
 * Set Location Id to update/load location profile
 * @param locationId
 */
dexit.EP.prototype.setLocationId = function(locationId, callback) {
    var self = this;

    /**
     * Handle Location Profile
     */
    function handleLocationProfile(error, data) {
        if (error) {

            console.log("resource: location profile action: handle response error:" + JSON.stringify(error));
        } else {

            console.log("resource: location profile action: handle response data: " + JSON.stringify(data));
            dexit.ep.lib.setLocationProfile(data);
        }
        callback(error);
    }
    console.log("ep:state: " + self.state);
    dexit.ep.integration.locationprofile.retrieve(locationId, handleLocationProfile);
};


/**
 * Method to personalize multimedia text.
 *
 * Uses self.profile objects, and iterates through text to look for all availbe profile references.
 */
dexit.EP.prototype.personalize = function(text) {

    return dexit.ep.lib.personalize(text);
};

/**
 * Method to localize multimedia text
 */
dexit.EP.prototype.localize = function(text,locationId, callback) {
    dexit.ep.lib.localize(text,locationId,callback);
};

/**
 * Method to resolve dynamic data, by substitution of variables from intelligence
 */
dexit.EP.prototype.resolve = function(text, scObject, key, datastore,callback) {

    return dexit.ep.lib.resolve(text,scObject,key, datastore,callback);
};

/**
 * Remove any non-personalized, or non-localized text that is in the control structure {{something}}
 *
 * @param text The text to sanatize
 * @returns {XML|string|void}
 */
dexit.EP.prototype.sanitize = function(text) {

    return dexit.ep.lib.sanitize(text);
};

dexit.EP.prototype.evaluate = function(text) {

    return dexit.ep.lib.evaluate(text);
};


dexit.EP.prototype.apply = function(text, scObject, key, locationId, callback) {

    return dexit.ep.lib.apply(text,scObject, key, locationId, callback);
};

/**
 * Check ready state
 */
dexit.EP.prototype.ready = function(callback) {

    var self = this;

    self.callback = callback;

    /* expecting user profile, initiate callback */
    if (self.state === "ready") {
        setTimeout( self.callback(), 10);
    }


};
/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global _ , dexit */
/*jshint -W079 */

////var dexit = dexit || {};
dexit.rtsc = dexit.rtsc || {};
dexit.rtsc.kb = dexit.rtsc.kb || {};
dexit.rtsc.kb.monitor = dexit.rtsc.kb.monitor || {};

/**
 * Config
 * @param {object} options - Paramd
 * @returns {object}
 * @constructor
 */
dexit.rtsc.kb.monitor.Configuration = function(options) {
    'use strict';

    var conf = {};
    conf.ebEndpoint = options.ebEndpoint || 'http://eb.dexit.co/';
    conf.ebKey = options.ebKey;
    conf.eventId = options.eventId;
    conf.accessToken = options.accessToken;
    conf.interval = options.interval;
    return conf;
};

/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global _, dexit, localforage */

/**
 * Enable processing if internet disconnnects
 * @param {string} id - The Id for the queue (ie. for queue for SCa then id would be 'a')
 * @constructor
 */
dexit.rtsc.kb.monitor.OfflineQueue = function(id, processInterval){
    'use strict';
    var interval = processInterval || 10000,
        keyspace = 'dexit.rtsc.web.monitor.queue' + id;
    this.processQueueCallback;

    /**
     * Retrieve underlying queue storage (which is local storage)
     * @param {function} callback - Callback fn(err,data) with values from queue
     * @private
     */
    var _getQueue = function(callback) {
        var value = localStorage.getItem(keyspace);
        if (value) {
            callback(null,JSON.parse(value));
        }else {
            callback(null,[]);
        }
    };

    /**
     * Save array to underlying queue storage (which is local storage)
     * @param {object[]} queueData - Array of data.
     * @param {function} callback - Callback fn(err)
     * @private
     */
    var _saveQueue = function(queueData, callback) {
        if (queueData) {
            localStorage.setItem(keyspace, JSON.stringify(queueData));
            callback();
        }else {
            callback(new Error('no queue data specified'));
        }
    };

    /**
     * Updates an existing item's value in the queue
     * @param {object} element
     * @param {object} keyValues
     * @param callback
     */
    this.replaceInQueue = function(filter, keyValues, callback) {
        if (keyValues){

            _getQueue(function (err, value) {
                if (err) {
                    return callback(err);
                }
                var itemIndex = _.findIndex(value,filter);
                if (itemIndex === -1) {
                    //not found return false
                    return callback(null, false);
                }
                console.log('found queue item to update at index:%n with values:%o',itemIndex,keyValues)

                //replace keyValues
                var item = value[itemIndex];
                if (!item.params) {
                    item.params = {};
                }
                item.params = _.extend(item.params,keyValues);

                value[itemIndex] = item;
                //re-save
                _saveQueue(value,callback);

            });

        }else {
            callback(null, false);
        }
    };


    /**
     * Queue up new data item
     * @param {object} dataItem - Json Data
     * @param {function} callback - Callback fn(err)
     */
    this.enqueue = function(dataItem, callback) {
        if (dataItem){
            _getQueue(function(err,value) {
                value.push(dataItem);
                _saveQueue(value, callback);
            });
        }
    };

    /**
     * Process the queue by passing the items to the provided function (fn)
     * @param {function} fn The function to process the queue item.  it is required to have the following signature: fn(item, function(err){})
     * @param {function} callback - Callback function fn(err)
     */
    this.processQueue = function(fn,callback) {
        var self = this;
        self.processQueueCallback = callback;
        setTimeout(function() {self._processQueue(fn);},interval);
    };


    /**
     * Process the queue
     * @param {function} fn - the passed callback to call when processing value (single item) is completed from queue
     * @private
     */
    this._processQueue = function(fn) {
        var self = this;
        _getQueue(function(err,value) {
            if (value.length < 1) {
                // clearTimeout(self._processQueue);
                console.log('nothing left to process on the queue:'+keyspace);
                //wait additional 10 seconds before checking again
                setTimeout(function() {self._processQueue(fn); },interval + 10000);
            } else {
                //process
                var toPrcess= value.slice()
                fn(value, function (err) {
                    if (err) {
                        console.log('error processing queue items:' + err.message);
                    }
                    //save
                    _saveQueue([], function (err) {
                        if (err) {
                            console.log('error saving to queue:' + keyspace);
                        }
                        setTimeout(function() {self._processQueue(fn);},interval);
                    });
                });
            }
        });

    };


    /**
     * Stop processing Queue.  Calls processQueueCallback to invoke callback used to signal that all processing is done
     */
    this.stopProcessQueue = function() {
        var self = this;
        clearTimeout(self._processQueue);
        console.log('queue processing was stopped');
        self.processQueueCallback();
    };


    /**
     * Number of items on the queue
     * @param {function} callback - Callback with fn(err,LengthOfQueue)
     */
    this.count = function(callback) {
        _getQueue(function(err,value) {
            if (value) {
                callback(null,value.length);
            }else {
                callback(null,0);
            }
        });
    };


    /**
     * Clear the local queue
     * @param {function} callback - Callback
     */
    this.clear = function(callback) {
        localStorage.removeItem(keyspace);
        callback();
    };


};

/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global $ */
/*global dexit */

/**
 * REST strategy based on jQuery for EB
 * @param {string} resource - The URL
 */
dexit.rtsc.kb.monitor.ebStrategy = function (resource) {
    'use strict';
    var self = this;

    self.send = function (ebKey, data, token, callback) {


        let request = new Request(resource, {
            method: 'post',
            credentials: 'same-origin',
            headers: {
                'X-Auth-Key': ebKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? 'Bearer ' + token : undefined
            },
            body:  JSON.stringify(data)
        });

        fetch(request).then((data) => {
            if (data.status === 200) {
                return data.json();
            } else {
                throw new Error('unexpected response:' + data.status);
            }
        }).then(res => {
            console.log("resource:ebStrategy registration, action:send");
            callback(null,res);
        }).catch((err) => {
            console.log("resource:eb-send , action:post device, error:" + JSON.stringify(err));
            callback(err);
        })


        // var request = $.ajax(
        //     {
        //         url: resource,
        //         type: 'POST',
        //         data: JSON.stringify(data),
        //         headers: {
        //             'X-Auth-Key': ebKey,
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json',
        //             'Authorization': token ? 'Bearer ' + token : undefined
        //         },
        //         success: function(result, status) {
        //             return callback(undefined, result);
        //         },
        //         error :function(XHR, textStatus, errorThrown) {
        //             console.log("Error! " + textStatus + ':' + errorThrown);
        //             //Create an Error Object
        //             var error = new Error(XHR.statusText);
        //             callback(error);
        //         }
        //     });
    };
};


/**
 *  Send the event and its data
 * @param {string} endpoint - The endpoint for EB
 * @param {string} eventId -  The event identifier
 * @param {string} ebKey - The entity key
 * @param {object[]} data - Data to send
 * @param {string} token - The access token
 * @param {function} callback - The callback that returns error code if problem sending data  fn(err)
 */
dexit.rtsc.kb.monitor.sendEvent = function (endpoint,eventId,ebKey,data,token,callback) {
    'use strict';
    var app_resource = endpoint + '/' + 'events/'+ eventId + '/trigger',
        ScpRestStrategy = new dexit.rtsc.kb.monitor.ebStrategy(app_resource);

    ScpRestStrategy.send(ebKey,data,token,callback);
};

/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global _, dexit, OfflineQueue */

/**
 *  init.  Ie. { id: 'monitorId', prefix: 'data prefix' };
 * @param {object} config - Configuration object
 * @param {string} config.id - Monitor Id
 */
dexit.rtsc.kb.monitor.WebMonitor = function(config){
    'use strict';
    this.config = config;
    this.queue = new dexit.rtsc.kb.monitor.OfflineQueue(config.id, config.interval);
};


/**
 * Add data item to be collected
 * @param {object} item - Data item for collection
 * @param {function} callback - Callback on status of addition fn(err)
 */
dexit.rtsc.kb.monitor.WebMonitor.prototype.add = function(item, callback){
    this.queue.enqueue(item,callback);
};


/**
 * Start monitoring and processing of queue
 * @param {function} callback - Callback for completion fn(err)
 * @private
 */
dexit.rtsc.kb.monitor.WebMonitor.prototype._monitor = function(callback){
    this.queue.processQueue(this._send.bind(this),callback);
};

/**
 * Process the current queue of items and batch any to be sent together
 * @param {object} data - send data //TODO: update for batching
 * @param {function} callback - Callback on status of send fn(err)
 * @private
 */
dexit.rtsc.kb.monitor.WebMonitor.prototype._send  = function(data, callback){
    //check for data
    if (data && data.length > 0) {
        dexit.rtsc.kb.monitor.sendEvent(this.config.ebEndpoint, this.config.eventId, this.config.ebKey, data, this.config.accessToken, callback);
    }else {
        callback();
    }
};

/**
 * Stop processing (including queue)
 */
dexit.rtsc.kb.monitor.WebMonitor.prototype.stop  = function(){
    this.queue.stopProcessQueue();
};






/*! Copyright Digital Engagement Xperience 2015 sb-web -v0.1.3 2015-06-27, 8:08:38 AM Licensed Private */
/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, external_auth */
/*jshint -W079 */

// if (!dexit) {
//     var dexit = {};
// }
if (!dexit.rtsc) {
    dexit.rtsc = {};
}
if (!dexit.rtsc.sb) {
    dexit.rtsc.sb = {};
}

//consist of json objects indexed by service Id with "data" namespace
dexit.rtsc.sb.loaded_services = {};

if (!dexit.rtsc.sb.manager) {
    dexit.rtsc.sb.manager = {};
}

dexit.rtsc.sb.manager.Configuration = function(options) {
    'use strict';

    var conf = {};

    conf.sbEndpoint = options.sbUrl || 'http://sb.daily.dexit.co';
    conf.authToken = options.authToken;
    return conf;
};



dexit.rtsc.sb.manager.setConfig= function(config) {
    'use strict';
    dexit.rtsc.sb.manager._config = new dexit.rtsc.sb.manager.Configuration(config);
}

/**
 * Set auth token
 * @param authToken
 */
dexit.rtsc.sb.manager.setAuthToken = function(authToken) {
    if (dexit.rtsc.sb.manager._config) {
        dexit.rtsc.sb.manager._config.authToken = authToken;
    }
}


/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, $, _ */
/*jshint -W061 */

/**
 *
 * @param callback  error: 500
 *
 */
dexit.rtsc.sb.manager.loadServiceResource = function (serviceId,callback) {
    'use strict';
    dexit.rtsc.sb._retrieveServiceResource(serviceId, function(err, resource) {
        if (err) {
            return callback(err);
        }
        var loaded;
        var conflict;
        //check for conflict or if it is already loaded
        var keys =Object.keys(dexit.rtsc.sb.loaded_services);
        for (var key in keys) {
            var obj = keys[key];
            //for (var prop in obj) {
            if(dexit.rtsc.sb.loaded_services.hasOwnProperty(obj)){
                if (dexit.rtsc.sb.loaded_services[obj] === serviceId){
                    loaded = true;
                }else if (dexit.rtsc.sb.loaded_services[obj] === serviceId && dexit.rtsc.sb.loaded_services[obj]=== resource.namespace) {
                    conflict = obj;
                }
            }
            //}

        }
        //service already loaded
        if (loaded) {
            return callback();
        }
        //service not loaded but conflicts with another loaded service
        if (conflict){
            var error = new Error('Cannot load service:'+serviceId + 'due to conflct with loaded service:', conflict);
            return callback(error);
        }


        $.getScript(resource.location)
            .done(function(script, textStatus) {
                console.log('loaded service:'+serviceId);
                //set loaded
                dexit.rtsc.sb.loaded_services[serviceId] = resource.namespace;
                callback();
            })
            .fail(function( jqxhr, settings, exception) {
                console.log('error retrieving script for service:'+serviceId);
                var error = new Error(exception);
                callback(error);
            })
    });

};

/**
 *
 * @param callback  error: 500
 *
 */
dexit.rtsc.sb._retrieveServiceResource = function (serviceId,callback) {
    'use strict';
    dexit.rtsc.sb.manager.integration.retrieveService(dexit.rtsc.sb.manager._config, serviceId, function(err, service) {
        if (err) {
            return callback(err);
        }
        if (!service.resource || service.type !== 'local') {
            return callback(new Error('Not a local service type or no location information defined'));
        }
        callback(null, service.resource);
    });
};


dexit.rtsc.sb._isLoaded = function(serviceId) {
    if (dexit.rtsc.sb.loaded_services && dexit.rtsc.sb.loaded_services[serviceId]) {
        return true;
    }
    return;
}

dexit.rtsc.sb._getNamespace = function(serviceId) {
    return dexit.rtsc.sb.loaded_services[serviceId];
}

/**
 * Executes the service locally with the parameters
 * @param serviceId  {string} The service name
 * @param args {object} The arguments include : operation, parameters, executionContext
 * @param callback {function} err
 * @returns {*}
 */
dexit.rtsc.sb.manager.executeService = function (serviceId, args,callback) {
    function execute(namespace,args, callback) {
        var method = args.operation;
        var params = args.parameters;
        var executionContext = args.executionContext;

        var callbackOnce = _.once(callback); // wrap so it only gets called once
        var result;
        var err;

        var operation = '';
        if (namespace) {
            operation = namespace + '.' + method;
        } else {
            operation = method;
        }
        try {
            //TODO: ST can a better way be found instead of using eval or supporting callback
            if( !executionContext) {
                result = eval(operation)(params, callbackOnce);
            } else {
                executionContext = eval(executionContext);
                result = eval(operation).call(executionContext, params, callbackOnce);
            }
        } catch (ex) {
            console.log('problem running function:' + operation + ' it probably does not exist or is invalid:' + ex.message);
            err = new Error('failed to run function: ' + operation, ex);
        }
        // will only invoke callback if it wasn't already called by behaviour
        callbackOnce(err, result);
    }

    if (!args.operation) {
        return callback(new Error('Must supply operation for service'));
    }
    //check if loaded
    if (!dexit.rtsc.sb._isLoaded(serviceId)) {
        dexit.rtsc.sb.manager.loadServiceResource(serviceId, function(err) {
            if (err) {
                console.log('failed to load service for execution:'+err.message);
                callback(err);
            }else {
                execute(dexit.rtsc.sb._getNamespace(serviceId),args, callback);
            }
        });
    }else {
        execute(dexit.rtsc.sb._getNamespace(serviceId),args, callback);
    }
    /*jshint +W061 */



};

/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global $ */
/*global dexit */

dexit.rtsc.sb.manager.integration = {};

dexit.rtsc.sb.manager.integration.sbStrategy = function (config) {
    'use strict';
    var self = this;


    self.retrieve = function(resource,callback) {

        let headers = new Headers();
        headers.set('Accept','application/json');
        var auth = config.authToken;
        if (auth) {
            headers.set('Authorization','Bearer ' + auth);
        }
        let request = new Request(config.sbEndpoint + resource, {
            method: 'get',
            credentials: 'same-origin',
            headers: headers,
        });

        fetch(request).then((data) => {
            if (data.status === 200) {
                return data.json();
            } else {
                throw new Error('unexpected response:' + data.status);
            }
        }).then(res => {
            console.log("resource: sbStrategy action: retrieve data: "+JSON.stringify(res));
            callback(null,res);
        }).catch((err) => {
            console.log("resource: sbStrategy: retrieve error:" + JSON.stringify(err));
            callback(err);
        });


        // var options = {
        //     url: config.sbEndpoint + resource,
        //     type: 'GET',
        //     beforeSend: function( xhr ) {
        //         var auth = config.authToken;
        //         if (auth) {
        //             xhr.setRequestHeader('Authorization', 'Bearer '+ auth);
        //         }
        //     },
        //     dataType: 'json',
        //     headers: {
        //         'Accept': 'application/json'
        //     },
        //
        //     success: function(result, status) {
        //         //console.log("Created SCO: " + JSON.stringify(result) );
        //         return callback(undefined, result);
        //     },
        //     error :function(XHR, textStatus, errorThrown) {
        //         console.log("Error! " + textStatus + ':' + errorThrown);
        //         //Create an Error Object
        //         var error = new Error(XHR.statusText);
        //         return callback(error);
        //     }
        // };
        //
        // var request = $.ajax(options);
    };
};


/**
 *
 * @param callback  error: 500
 *
 */
dexit.rtsc.sb.manager.integration.retrieveService = function (config,serviceId,callback) {
    'use strict';
    var SBRestStrategy = new dexit.rtsc.sb.manager.integration.sbStrategy(config);
    SBRestStrategy.retrieve('/services/'+serviceId, callback);
};


/*! Copyright Digital Engagement Xperience 2018 smart-content-platform-device -v1.21.2-9 2018-05-11, 9:45:08 AM  Licensed Private */
/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global DEBUG, external_auth */
/*jshint -W020, -W003 */
if (typeof DEBUG === 'undefined') { DEBUG = true; }

var noop = function(){};
//var dexit = dexit === undefined ? {} : dexit;
// if (!dexit) {
//     var dexit = {};
// }
//Declare the basic namespace for SCD (SCP)
if (!dexit.scp) {
    dexit.scp = {};
}
if (!dexit.scp.device){
    dexit.scp.device = {};
}

if (!dexit.scp.device) {
    dexit.scp.device= {};
}


if (!dexit.scp.device.resolution) {
    dexit.scp.device.resolution = {};
}

if (!dexit.scp.device.resolution.touchpoint){
    dexit.scp.device.resolution.touchpoint = {};
}

dexit.scp.device.ENVIRONMENT = 'latest';

/**
 * The configuration object used by dexit.scp.device.  Added the api key/secret.  the getAPIKeyAuth will get the key ready to be inserted into the Authorization header
 *
 * @param args - Arguments required in-order to utilize the dexConfiguration:  scpUrl,kbUrl,ebUrl,sbUrl,repository,updateEventId,entityEventKey,smUrl
 */
dexit.scp.device.Configuration = function(args) {
    "use strict";
    args = args || {};
    //SCP Endpoint
    var scpurl = args.scpUrl || 'http://scc.latest.dexit.co',
        //RTS Cloud Endpoint(s)
        rtsckburl = args.kbUrl || 'http://kb.latest.dexit.co',
        rtsceburl = args.ebUrl || 'https://ebprod-dextert.dotcloud.com',
        rtscsburl = args.sbUrl || 'http://sb.latest.dexit.co',
        rtscebws = rtsceburl + '/ss',
        repository =  args.repository || '',
        update_event_id =  args.eventId || args.updateEventId || '',
        entity_event_key= args.eventKey  || args.updateEventKey || '',
        sc_scheduler_url= args.scpUrl || 'http://scc.latest.dexit.co',
        touchpoint='',
        data_monitor_event_id = args.monitorEventId || '',
        data_monitor_event_key = args.monitorEventKey || '',
        data_monitor_interval = args.monitorInterval || 8000,
        monitor_config,
        token= args.authToken || '',
        epmurl = args.epmUrl || '/proxy-ep/epm';



    this.getUpdateEventId = function() {
        return update_event_id;
    };

    this.setUpdateEventId = function(id) {
        update_event_id =id;
    };
    this.getEventEntityKey= function() {
        return entity_event_key;
    };
    this.setEventEntityKey= function(id) {
        entity_event_key = id;
    };

    this.getEndPoints  = function() {
        var endpoints =
            {
                scp :
                    {
                        cloud :scpurl,
                        sm: sc_scheduler_url
                    },
                rts : {
                    kb : rtsckburl,
                    eb : rtsceburl,
                    ebws : rtscebws,
                    sb : rtscsburl
                },
                ep: epmurl
            };

        return endpoints;
    };

    this.getRepository = function() {
        return repository;
    };

    this.setRepository = function(repo) {
        repository = repo;
    };

    this.setTouchpoint = function(id) {
        touchpoint = id;
    };

    this.getTouchpoint = function() {
        return touchpoint;
    };

//    this.setMonitorConfig = function(id) {
//        monitor_config = id;
//    };

    this.setDataMonitorEventId = function(id) {
        data_monitor_event_id = id;
    };

    this.setDataMonitorInterval = function(val) {
        data_monitor_interval =val;
    };

    this.getMonitorConfig = function() {
        return {
            ebEndpoint:rtsceburl,
            ebKey: data_monitor_event_key,
            eventId: data_monitor_event_id,
            accessToken: token,
            interval: data_monitor_interval
        };
    };
    this.setToken = function(t) {
        token = t;
    };

    this.getToken = function() {
        return token;
    };

};

//load default configuration
dexit.scp.device.config =  new dexit.scp.device.Configuration();

/**
 * Create an instance of the configuration under dexit.scp.device.config and specifify
 * @param args the configuration parameters with the following:
 * @returns {dexit.scp.device.Configuration|*}
 */
dexit.scp.device.loadConfig = function(args) {

    dexit.scp.device.config =  new dexit.scp.device.Configuration(args);
    return dexit.scp.device.config;
};
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*jshint supernew:true */
/*global dexit, _ */

dexit.scp.device.util = {};

/*jshint -W116 */
dexit.scp.device.util.setSize = function() {
    var myWidth;
    var myHeight;

    if( typeof( window.innerWidth ) == 'number' ) {

        //Non-IE

        myWidth = window.innerWidth;
        myHeight = window.innerHeight;

    } else if( document.documentElement &&

        ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {

        //IE 6+ in 'standards compliant mode'

        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;

    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {

        //IE 4 compatible

        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }

    //Tweaking margins
    myHeight -= 10;
    myWidth -= 10;
    document.getElementById("bg").style.height = myHeight+'px';
    document.getElementById("bg").style.width = myWidth+'px';
};

/*jshint -W116 */
dexit.scp.device.util.setElementSize = function(id, scale) {
    var myWidth;
    var myHeight;

    if( _.isUndefined(scale) ) {
        scale =
            {
                height : 1 ,
                width : 1
            };
    }

    if( typeof( window.innerWidth ) == 'number' ) {

        //Non-IE

        myWidth = window.innerWidth;
        myHeight = window.innerHeight;

    } else if( document.documentElement &&

        ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {

        //IE 6+ in 'standards compliant mode'

        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;

    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {

        //IE 4 compatible

        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }

    myHeight = (myHeight - 5) * scale.height;
    myWidth = (myWidth - 5) * scale.width;
    document.getElementById(id).style.height = myHeight+'px';
    document.getElementById(id).style.width = myWidth+'px';
};

dexit.scp.device.util.inherit = function(parentPrototype) {
    function F() {}
    F.prototype = parentPrototype;
    return new F;
};

dexit.scp.device.util.subclassOf = function(base) {
    dexit.scp.device.util._subclassOf .prototype = base.prototype;
    return new dexit.scp.device.util._subclassOf();
};

dexit.scp.device.util._subclassOf = function() {};

dexit.scp.device.util.getURLParameter = function(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
};
/**
 * Used in http retry and websocket retry. If a numRetry is provided then the backoff is increased beyond the initial interval + random time
 * @param {number} maxTime - max milleseconds to wait.  Used to calculate a random value to add (ie.
 * @param {number} numRetries - Optional (defaults to 0) and if provided, the current retry
 * @returns {number} num - Time to wait in
 */
dexit.scp.device.util.getRandomBackoffTime = function(intervalTime,numRetries) {
    //back-off in intervalTIme ms increments plus a random number between 0 and intervalTime
    if (!numRetries || numRetries < 0) {
        numRetries = 0;
    }
    return ( (Math.pow(2, numRetries) * (intervalTime) ) + (Math.round(Math.random() * (intervalTime) )) );
};

/**
 * Refresh page
 */
dexit.scp.device.util.refreshPage = function() {
    window.location.reload(true);
};

/***************************************************************
 * Helper functions for older browsers
 ***************************************************************/
if (!Object.hasOwnProperty('create')) {
    Object.create = function (parentObj) {
        function TmpObj() {}
        TmpObj.prototype = parentObj;
        return new TmpObj();
    };
}
if (!Object.hasOwnProperty('defineProperties')) {
    Object.defineProperties = function (obj, props) {
        for (var prop in props) {
            Object.defineProperty(obj, prop, props[prop]);
        }
    };
}

//polyfill for isNumber
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
};

/*************************************************************/
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*jshint supernew:true */
/*global dexit, _ */

/**
 * Parses a string and returns an object describing the intelligence elements
 * @param value
 * @returns { smartcontentId: SC object, conceptualIntelligenceId: CI, informationalId: II Id, intelligenceKeyValue: value of the key }
 */
dexit.scp.device.util.parseIntelligenceString = function(smartContentId, stringToParse) {
    'use strict';
    var intelligenceElements =  stringToParse.split(':');

    var items, conceptualId, informationalId,key ='';
    if (intelligenceElements[0].toLowerCase() === 'sc' || intelligenceElements[0].toLowerCase() === 'smartcontent'){
        items =  stringToParse.split('/');
        if (!items) {
            return;
        }

        var scId = items[0].split(':')[1];
        conceptualId = items[1].split(':')[1];
        informationalId = items[2];
        if (items.length > 3) {
            key = items[3];
        }

        return { smartContentId: scId , conceptualIntelligenceId: conceptualId, informationalIntelligenceId: informationalId, intelligenceKeyValue: key };

    }else if  (intelligenceElements[0].toLowerCase() === 'intelligence' || intelligenceElements[0].toLowerCase() === 'int'){
        items =  stringToParse.split('/');
        if (!items) {
            return;
        }
        conceptualId = items[0].split(':')[1];
        informationalId = items[1];
        key = '';
        if (items.length > 2) {
            key = items[2];
        }

        return { smartContentId: smartContentId, conceptualIntelligenceId: conceptualId, informationalIntelligenceId: informationalId, intelligenceKeyValue: key };
    }else {
        return;
    }


}

/**
 * Resolves the intelligence object speified to a value
 * note: currently only supports conceptual intelligence
 * @param def The definition to resolve. This is an object of
 * {smartcontentId: scId, conceptualIntelligenceId: ciId, informationalIntelligenceId: iId, intelligenceKeyValue: value }
 * @callback callback A callback which will return the specific data.  ie. function(erdexit.scp.devicedata)
 */
dexit.scp.device.util.resolveIntelligence = function(def, callback) {
    'use strict';
    function findKeyName(element) {
        /*jshint -W116*/
        //want the weaker comparison here
        if (element.property && element.property.isKey && element.property.isKey == 'true') {
            return element.property.name;
        }
    }



    var informationalId = def.informationalIntelligenceId;

    if (!informationalId || !def.intelligenceKeyValue) {
        return callback(new Error('Cannot resolve the informationalId or keyvalue for the specified smart content intelligence'));
    }

    var scId = def.smartContentId;
    var conceptualId = def.conceptualIntelligenceId;
    var scObj = dexit.scp.device.management.scmanager.smartcontent.object[scId];
    if (!scObj) {
        return callback(new Error('Cannot find smart content:'+scId));
    }

    var conceptualObj = dexit.scp.device.management.scmanager.smartcontent.object[scId].intelligence[conceptualId];
    if (!conceptualObj) {
        return callback(new Error('Cannot find conceptual intelligence: '+conceptualId+' for the smart content:'+scId));
    }
    var information = conceptualObj.information;
    //find name of key which is used for the query
    var keyIntelligence = _.find(information, findKeyName);
    if (!keyIntelligence) {
        return callback(new Error('Conceptual intelligence:'+conceptualId+' does not have a valid key within its informational intelligence children'))
    }
    var keyName = keyIntelligence.property.name;


    conceptualObj.getData({key: keyName, id:def.intelligenceKeyValue}, callback);


}


dexit.scp.device.util.resolveIntelligenceValue = function(def, callback) {
    'use strict';


    dexit.scp.device.util.resolveIntelligence(def, function(err, data) {
        function findIIName(element) {
            /*jshint -W116*/
            //want the weaker comparison here
            if (element.id === informationalId) {
                return element.property.name;
            }
        }

        if (err) {

            return callback(err);
        }
        var scId = def.smartContentId;
        var conceptualId = def.conceptualIntelligenceId;
        var informationalId = def.informationalIntelligenceId;
        var conceptualObj = dexit.scp.device.management.scmanager.smartcontent.object[scId].intelligence[conceptualId]
        //get informational Name
        var informationalObj = _.find(conceptualObj.information, findIIName);
        if (!informationalObj) {
            return callback(new Error('No data matching the informational intelligence is found for the conceptual intelligence:'+conceptualId));
        }

        var val = '';
        if (_.isArray(data) && data.length > 0) {
            val = data[0][informationalObj.property.name];
        }else {
            val = data[informationalObj.property.name];
        }
        callback(null,val);
    });

}
dexit.scp.device.util.parseIntelligenceConditionString = function(condition) {

    var conditions2= condition.replace(/\s+/g,'');

    var comparatorIndex = 0;
    var compareLength = 1;
    var compareLeft = 0;

    if (conditions2.indexOf('!=') !== -1)  {
        comparatorIndex =  conditions2.indexOf('!=');
        compareLength = 1;
        compareLeft =1;
    } else if (conditions2.indexOf('<') !== -1){
        comparatorIndex =  conditions2.indexOf('<');
    }else if (conditions2.indexOf('>') !== -1){
        comparatorIndex =  conditions2.indexOf('>');
    }else if (conditions2.indexOf('==') !== -1) {
        compareLeft =1;
        comparatorIndex =  conditions2.indexOf('==');
    }

    var leftSide = conditions2.substring(0,comparatorIndex);
    var comparator = conditions2.substring(comparatorIndex, comparatorIndex+1+compareLeft).trim();
    var rightSide =  conditions2.substring(comparatorIndex+1+compareLeft);

    return {leftSide: leftSide, comparator: comparator, rightSide: rightSide};
};/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, _, smartcontentobject, noop, dexit, PubSub */

dexit.scp.device.monitor = {};
dexit.scp.device.monitor.list = {};
dexit.scp.device.monitor._external = {};

/**
 * Add/remove external monitor plugins initiated from sdk
 * @param msg {string} The message name
 * @param data {object} the data that specifies following fields: added,pluginName
 */
PubSub.subscribe('dexit.sdk.xkb.plugins', function(msg,data){
    if (data.action && data.action === 'added' && data.pluginName) {
        //store reference
        dexit.scp.device.monitor._external[data.pluginName] = true;
    }else if (data.action && data.action === 'removed' && data.pluginName) {
        if (dexit.scp.device.monitor._external[data.pluginName]) {
            delete dexit.scp.device.monitor._external[data.pluginName];
        }
    }
});

dexit.scp.device.monitor.createMonitor = function(sc) {



    var wrap = function (functionToWrap, data, sc, defaultCallback, thisObject) {

        return function () {
            var args = Array.prototype.slice.call(arguments);
            var result;

            // wrap callback function
            var callback = (_.isFunction(_.last(args))) ? args.pop() : defaultCallback;
            if (callback) {
                var wrappedCallback = function (err, result) {
                    if (data) {
                        data.err = err;
                        data.result = result;
                        send(sc, data);
                    }
                    callback(err, result);
                };
                args.push(wrappedCallback);

            } else if (data) {
                send(sc, data);
            }

            result = functionToWrap.apply(thisObject || this, args);
            return result;
        };
    };

    var config = new dexit.rtsc.kb.monitor.Configuration(dexit.scp.device.config.getMonitorConfig());
    config.id  = sc.id;
    var monitor = new dexit.rtsc.kb.monitor.WebMonitor(config);

    function addForMonitor(id, data) {
        monitor.add({sc:id, data:data}, function(err) {
            if (err) {

            }
        });
    }

    function send(sc,data) {
        var time = Date.now();
        var id = sc.id + ':'+ sc._channelInstance  +':' + sc._deviceInstance + ":" + time;


        //if there are external monitor plugins then call them to also get data
        var count = Object.keys(dexit.scp.device.monitor._external).length;
        if (count > 0) {
            var external = {};
            var externalExtract = _.after(count, function () {
                data.external = {};
                _.extend(data.external,external);
                addForMonitor(id, data);
            });
            //add data from external monitors

            _.each(dexit.scp.device.monitor._external, function (value, pluginName) {

                //grab data
                dexit.scp.device.monitor._getExternalMonitorPluginData(pluginName, function (err, dat) {
                    if (dat) {
                        _.extend(external, dat);
                    }
                    externalExtract();
                });
            });
        }else {
            addForMonitor(id,data)
        }
    }

    //bind monitor to smart content

    //wrap behaviour calls
    _.each(sc.behaviour, function (value, key) {
        var id = value.id;
        var fn = value.execute;
        var data = {'behaviour': id, action: 'execute'};

        sc.behaviour[key].execute = wrap(fn, data, sc, function (err, result) {
            if (err) {

            } else {

            }
        });

    });

    //wrap decision calls
    _.each(sc.decision, function (value, key) {
        var id = value.id;
        var fn = value.evaluate;
        var data = {'decision': id, action: 'evaluate'};

        sc.decision[key].evaluate = wrap(fn, data, sc);

    });

    _.each(sc.intelligence, function (value, key) {
        var id = value.id;
        var fn = value.getData;
        var data = {'intelligence': id, action: 'getData'};

        sc.intelligence[key].getData = wrap(fn, data, sc);

    });



    monitor._monitor(function() {

    });

    dexit.scp.device.monitor.list[sc.id] = monitor;
    return monitor;
};


dexit.scp.device.monitor.listMonitors = function() {
    return dexit.scp.device.monitor.list;
};

/**
 * Get data from external sdk plugin
 * @param name {string} name of plugin
 * @param callback
 * @private
 */
dexit.scp.device.monitor._getExternalMonitorPluginData =  function(name,callback) {

    //make sure sdk is loaded with xKbPluginManager, otherwise will ignore
    if (dexit.device.sdk && dexit.device.sdk.xKbPluginManager) {
        dexit.device.sdk.xKbPluginManager._getDataFromPlugin(name, callback);
    }

};;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, $, _ */
dexit.scp.device.request = {};
/**
 * The DEX XMLHttpRequest Object - Tailored to invoke SCC Service using the jQuery framework
 * @param type
 * @param resource
 * @param headers   Note:  if you want to use security then make sure the header 'Authorization' is set in here and populates the value from config (scd.config)
 * @param query
 * @param data
 * @param callback - The function to call on completion. Returns the data from the
 *                  service call.
 * @constructor
 */
dexit.scp.device.request.DEXRequest = function(type, resource, headers, query, data, callback) {
    dexit.scp.device.request.XHRRequest(type, resource, headers, query, data, callback);
};


dexit.scp.device.request.cacheableDEXRequest = function(cacheParams, type, resource, headers, query, data, callback) {


    let prefix = (cacheParams && cacheParams.cachePrefix ? cacheParams.cachePrefix : '');
    let key = prefix + ':' + type + ':' + resource;
    AsyncStorage.getItem(key, (err, data) => {
        if (data) {
            try {
                console.log('cache hit for key:'+key);
                let res = JSON.parse(data);
                callback(null, res);
            } catch (e) {
                console.log('warning bad data');
                callback(new Error('invalid data in cache for resource:' + resource));
            }
        } else {
            dexit.scp.device.request.DEXRequest(type, resource, headers, query, data, (err1, retrieved) => {
                if (!err1 && retrieved) {
                    AsyncStorage.setItem(key, JSON.stringify(retrieved), (errSet) => {
                        if (errSet) {
                            console.log('warning could not set:' + key + ' in cacheableDEXRequest');
                        }
                    });
                }
                callback(err, retrieved);

            });

        }
    });
};


dexit.scp.device.request.executeRetry = function(statusCode, error, retryAfter, fn, url_base, type,resource,headers,query,data,numRetries,maxRetries,callback) {


    if (numRetries < maxRetries) {

        //var retryAfter = res.get('retry-after');
        //use
        var interval =  100;

        var num = parseInt(retryAfter,10);
        if (_.isNaN(num)){
            //back-off in 30 ms increments plus a random number between 0 and 30
            interval = dexit.scp.device.util.getRandomBackoffTime(30,numRetries);
        }else {
            interval = num * 1000; //convert seconds to ms
        }

        numRetries++;
        return setTimeout(fn(url_base,type,resource,headers,query,data,numRetries,maxRetries,callback),interval);
    }else {

        //invoke the callback (last item in the array
        var args = fn.slice(1);
        var index =args.length-1;
        return args[index](error);
    }
};

dexit.scp.device.request.SchedulerXHRRequest = function(type, resource, headers, query, data, callback) {
    var numRetries = 0,
        maxRetries= 3,
        endpoints = dexit.scp.device.config.getEndPoints(),
        url_base = endpoints.scp.sm,
        repository = dexit.scp.device.config.getRepository();

    dexit.scp.device.request.XHRRequestWithRetry(url_base,type, resource, headers, query, data, numRetries, maxRetries, callback);
};

/**
 * XMLHttpRequest Object
 * @param {string} type - HTTP method to use
 * @param {string} resource - resource path
 * @param {object} headers - headers
 * @param {object} [query] - query string parameters
 * @param {*} [data] - data to send with require
 * @param callback - The function to call on completion. Returns the data from the
 *                  service call.
 * @constructor
 */
dexit.scp.device.request.XHRRequest = function(type, resource, headers, query, data, callback) {
    var numRetries = 0,
        maxRetries= 3,
        endpoints = dexit.scp.device.config.getEndPoints(),
        repository = dexit.scp.device.config.getRepository(),
        url_base = endpoints.scp.cloud + '/repos/' + repository;
    dexit.scp.device.request.XHRRequestWithRetry(url_base,type, resource, headers, query, data, numRetries, maxRetries, callback);
};

/**
 *
 * @param {string} url_base - a base url (would go before the resource in the path of the outgoing request)
 * @param {string} type - HTTP method to use
 * @param {string} resource - resource path
 * @param {object} headers - headers
 * @param {object} [query] - query string parameters
 * @param {*} [data] - data to send with require
 * @param {number} [numRetries=0] - number of times the request has been tried already
 * @param {number} [maxRetries=3] - maximum number of times to retry the request
 * @param callback - returns the data from the response
 * @constructor
 */
dexit.scp.device.request.XHRRequestWithRetry = function(url_base, type, resource, headers, query, data, numRetries, maxRetries, callback) {

    function queryObjectToQueryString(queryObject) {
        if (!queryObject){
            return '';
        }
        let serialize = function(obj) {
            var str = [];
            for (let p in obj)
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            return str.join("&");
        };

        //var str = $.param( queryObject );
        var str = serialize( queryObject );
        if (str){
            return '?' + str;
        }else {
            return '';
        }
    }

    headers = headers || {};
    var ME = this;
    numRetries =  numRetries || 0;
    maxRetries= maxRetries || 3;




    var url = url_base + resource + queryObjectToQueryString(query);
    var auth = dexit.scp.device.config.getToken();

    if (auth) {
        headers['Authorization'] = 'Bearer '+auth;
        //xhr.setRequestHeader('Authorization', 'Bearer '+auth);
    }
    headers['Accept'] = 'application/json';
    let opts = {
        method: type.toUpperCase(),
        headers: headers,

    };
    if( data ) {
        //opts.headers['Content-Type'] = 'application/json; charset=utf-8';
        opts.headers['Content-Type'] = 'application/json';
        if ( _.isObject(data) ) {
            data = JSON.stringify(data);
        }
        //Set the data
        opts.body = data;
    }

    let request = new Request(url, opts);

    console.log('request made:' + url);

    fetch(request).then((data) => {
        if (data.status === 200) {
            var contentType = data.headers.get("content-type");
            return data.json();
        } else if (data.status === 204) {
            return true; //return true
        } else {
            throw new Error('unexpected response:' + data.status);
        }
    }).then(res => {
        if (res) {
            console.log('resource: ' + resource + ' action: ' + type + ' data: ' + JSON.stringify(res));
        }else {
            console.log('resource: ' + resource + ' action: ' + type + ' data: <empty>');
        }
        callback(null,res);
    }).catch((err) => {
        //TODO: error handling for 401, 500,504. 503 etc
        debugger;
        console.log('resource: '+resource+' action: '+type+' error:' ,err);
        callback(err);
    });


    //
    // var options =
    //         {
    //             url : url + queryObjectToQueryString(query),
    //             type : type,
    //             beforeSend: function( xhr ) {
    //                 var auth = dexit.scp.device.config.getToken();
    //                 if (auth) {
    //                     xhr.setRequestHeader('Authorization', 'Bearer '+auth);
    //                 }
    //
    //             },
    //             dataType : 'json',
    //             headers : {
    //                 'Accept' : 'application/json'
    //             },
    //             success: function(result, status) {
    //                 //
    //                 return callback(undefined, result);
    //             },
    //             error :function(XHR, textStatus, errorThrown) {
    //
    //                 //Create an Error Object
    //                 var error = new Error(XHR.statusText);
    //                 error.responseText = XHR.responseText;
    //                 error.status = XHR.status;
    //                 error.statusText = XHR.statusText;
    //                 var code = error.status;
    //                 if (code === 504 || code === 503 || code === 500) {
    //                     //grab Retry-After header (if available)
    //                     var retryAfter = XHR.getResponseHeader('Retry-After');
    //                     return dexit.scp.device.request.executeRetry(code,error, retryAfter, dexit.scp.device.request.XHRRequest,url_base,type,resource,headers,query,data,numRetries,maxRetries,callback);
    //                 }else if (code === 401) {
    //                     var errText401 = "Bad credentials...will not retry! " + textStatus + ':' + errorThrown;
    //                     console.log(errText401);/*RemoveLogging:skip*/
    //                     callback(error);
    //                 }else {
    //                     var errText ="Non recoverable error! " + textStatus + ':' + errorThrown;
    //                     console.log(errText);/*RemoveLogging:skip*/
    //                     callback(error);
    //                 }
    //             }
    //         },
    //     original;


    //Set the approprate headers if data is being sent
    // if( data ) {
    //     options.contentType = 'application/json; charset=utf-8';
    //     if ( _.isObject(data) ) {
    //         data = JSON.stringify(data);
    //     }
    //     //Set the data
    //     options.data = data;
    // }
    //
    // $.ajax(options);
};
/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, _, noop, $ */

dexit.scp.device.em = {};
dexit.scp.device.em.intelligence = {};

dexit.scp.device.em.intelligence.tpIntel =  {
    currentTpId:'',
    currentTp:{},
    config:dexit.scp.device.config,
    init: function() {
        var self = this;
        'use strict';
        self.currentTpId = dexit.scp.device.management.sm.manager.touchpoint;
        self.getCurrentTpData(function(err, touchpoint) {
            if (err) {

            }else {
                self.currentTp = touchpoint;
            }
        });

    },
    getCurrentTpData: function(callback) {
        'use strict';
        if (dexit.scp.device && dexit.scp.device.resolution && dexit.scp.device.resolution.touchpoint) {
            callback(null,dexit.scp.device.resolution.touchpoint);
        }else if (this.currentTpId) {
            this.getTouchpointData(this.currentTpId,callback);
        }else {
            var error = new Error('No touchpoint data available');
            callback(error);
        }
    },
    getTouchpointData: function(id,callback) {
        'use strict';
        var endpoint = this.config.getEndPoints().tpm;

        let headers = new Headers();
        headers.set('Accept','application/json');
        var auth = config.authToken;
        if (auth) {
            headers.set('Authorization','Bearer ' + auth);
        }
        let request = new Request(endpoint+"/touchpoint/"+id, {
            method: 'get',
            credentials: 'same-origin',
            headers: headers,
        });

        fetch(request).then((data) => {
            // if (typeof data === 'string' || data instanceof String){
            if (data.status === 200) {
                return data.json();
            } else {
                throw new Error('unexpected response:' + data.status);
            }
        }).then(res => {
            console.log("resource: TP-data action: retrieve data: "+JSON.stringify(res));
            callback(null,res);
        }).catch((err) => {
            console.log("resource: TP-data action: retrieve error:" + JSON.stringify(err));
            callback(err);
        });


        // $.ajax({
        //     type: "GET",
        //     url: endpoint+"/touchpoint/"+id,
        //     crossDomain: true,
        //     dataType: 'json'
        // }).done(function (data) {
        //     if (typeof data === 'string' || data instanceof String){
        //
        //         data = JSON.parse(data);
        //     }
        //     callback(null,data);
        // }).fail(function (xhr, textStatus, errorThrown) {
        //
        //     callback(xhr);
        //
        // });
    },
    getData: function(smartContentId, ci, filter,callback) {
        'use strict';
        if (!this.currentTp) {
            var error = new Error('Cannot resolve touchpoint instance');
            return callback(error);
        }
        var name  =ci.property.name;
        var loc = ci.property.location;
        if (ci.name.toLowerCase() === 'tpm') {
            callback(null,this.currentTp);
        }else {
            var err = new Error("no touchpoint intelligence supplied");
            callback(err);
        }

    }
};

dexit.scp.device.em.intelligence.epIntel =  {
    profile:'',
    init: function() {
        this.profile = dexit.ep.lib.profile;
    },



    getData: function(smartContentId, ci, filter,callback) {
        'use strict';
        if (!this.profile) {
            var error = new Error('Cannot resolve profile');
            return callback(error);
        }
        var name = ci.property.name;

        if (this.profile[name]) {
            callback(null, this.profile[name]);
        } else {
            var err = new Error('Cannot resolve profile:' + name);
            callback(err);

        }
    }
};

dexit.scp.device.em.resolveIntelligence = function(intelligence) {

    function startsWith(check, str) {
        return check.indexOf(str) === 0;
    }

    var loc = intelligence.property.location;
    var locOptions = loc.split(':');

    if( locOptions.length > 1 && locOptions[0] && locOptions[0].toLowerCase() === 'datastore' ) {
        var intelCi = dexit.scp.device.em.intelligence.ciResolver;
        intelCi.init(intelligence.property);
        return intelCi;

    }else if (locOptions.length > 1 && locOptions[0] && locOptions[0].toLowerCase() === 'ep'){
        var intelEp= dexit.scp.device.em.intelligence.plugins['ep'];
        intelEp.init();
        return intelEp;

    }else if (locOptions.length > 1 && locOptions[0] && locOptions[0].toLowerCase() === 'tp'){
        var intelTp = dexit.scp.device.em.intelligence.plugins['tp'];
        intelTp.init();
        return intelTp;
    }else {
        //invalid definition to retrieve, return error
        var error = new Error('Conceptual Intelligence:'+this.id + ' does not contain a valid data location');
        return error;
    }

}


dexit.scp.device.em._getAllData = function(smartContentId,ci,callback) {
    'use strict';
    var intel = dexit.scp.device.em.resolveIntelligence(ci);
    if (intel instanceof Error) {
        return callback(intel);
    }
    intel.getAllData(smartContentId,ci,callback);
};


dexit.scp.device.em._getData = function(smartContentId,ci,filter,callback) {
    'use strict';

    var intel = dexit.scp.device.em.resolveIntelligence(ci);
    if (intel instanceof Error) {
        return callback(intel)
    }
    intel.getData(smartContentId, ci, filter, callback);

};

dexit.scp.device.em._updateData = function(smartContentId, ci, data, key, value, callback) {
    'use strict';
    var intel = dexit.scp.device.em.resolveIntelligence(ci);
    if (intel instanceof Error) {
        return callback(intel)
    }
    intel.updateData(smartContentId, ci, data, key, value, callback);

};


dexit.scp.device.em._deleteData = function(smartContentId, ci,data, key, value, callback) {
    'use strict';
    var intel = dexit.scp.device.em.resolveIntelligence(ci);
    if (intel instanceof Error) {
        return callback(intel)
    }
    intel.deleteData(smartContentId, ci,key, value, callback);

};

dexit.scp.device.em.intelligence.ciResolver = {
    init: function(properties) {
        if (properties.location_context) {
            this.location = properties.location_context;
        }

    },


    resolveLocalization: function(filter) {

        //if ds_location is already set ignore
        if (!filter.ds_location && dexit.ep.lib.profile && dexit.ep.lib.profile.location) { //if ep and location are loaded
            filter.ds_location = dexit.ep.lib.profile.location.datastore;
        }
    },



    getData: function(smartContentId,ci,filter, callback) {
        'use strict';
        if (!filter || !filter.key) {
            return callback(new Error("Must specify key"));
        }

        this.resolveLocalization(filter);

        //Retrieve the data
        var keyName = filter.key + '[eq]';
        var query = {};
        query[keyName] = filter.id;
        if (filter.ds_location) {
            query.ds_location = filter.ds_location;
        }
        var resource = '/management/smartcontent/' + smartContentId + '/intelligence/' + ci.id+ '/';

        new dexit.scp.device.request.XHRRequest('GET', resource, undefined, query, undefined, callback);
    },
    getAllData: function(smartContentId,ci, callback) {
        'use strict';
        //Retrieve the data
        var headers =
                {
                    Accept : 'application/json'
                },
            query,data;
        var resource ='/management/smartcontent/'+smartContentId +'/intelligence/' + ci.id + '/';
        new dexit.scp.device.request.XHRRequest('GET', resource, headers, query, data, callback);
    },
    addData: function(smartContentId, ci,data, key, value,callback) {
        'use strict';
        var headers = {'Content-Type':'application/json'};
        var q;
        if (key) {
            q = {};
            q.key = value;
        }

        var location = '/management/smartcontent/' + smartContentId + '/intelligence/' + ci.id+ "/";
        new dexit.scp.device.request.XHRRequest('POST', location, headers, q, data, callback);
    },
    updateData: function(smartContentId, ci,data, key, value, callback) {
        'use strict';
        if (!key) {
            return callback(new Error("Must specify key"));
        }

        var headers = {'Content-Type':'application/json'};
        var location = '/management/smartcontent/' + smartContentId + '/intelligence/' + ci.id + "/";
        var q = {};
        q[key] = value;
        new dexit.scp.device.request.XHRRequest('PUT', location, headers, q, data, callback);
    },
    deleteData: function(smartContentId, ci, key, value, callback) {
        'use strict';
        if (!key) {
            return callback(new Error("Must specify key"));
        }

        var location = '/management/smartcontent/' + smartContentId + '/intelligence/' + ci.id + "/";
        var headers = {'Content-Type':'application/json'},
            query = {};
        query[key] = value;
        new dexit.scp.device.request.XHRRequest('DELETE', location, headers, query, undefined, callback);
    }
};


dexit.scp.device.em.intelligence.plugins = {
    tpm : dexit.scp.device.em.intelligence.tpIntel,
    ep: dexit.scp.device.em.intelligence.epIntel
};;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global, dexit, PubSub, _ */


/**
 * @typedef {object} EBHandler
 * @property {function} fireEvent
 * @property {function} onReceiveEvent - required to call dexit.EBIntegration.onReceiveEvent(event)
 * @property {function} authorize
 */

/**
 *
 * @param [object=window.console] logger
 * @constructor
 */
dexit.EBIntegration = function(logger){
    //Private variables and functions
    logger = logger || window.console;
    var handler;
    var counter = 0;

    var ebIntegrationImpl;

    var eventHandlers = {};

    this.setEbModule = function (val) {
        ebIntegrationImpl = val;
        ebIntegrationImpl.setHandleEventFn(this.onReceiveEvent);
    };

    /**
     * find function bound to particular event
     * @param {string} eventId - event identifier
     * @param {object} [data] - optional data
     */
    function handleEventById(eventId, data) {
        var handler = eventHandlers[eventId] || [];
        handler.forEach(function (item) {
            item.fn.call(item.context,data);
        });
    }

    /**
     *
     * @param {string} eventId - event identifier
     * @param {function} fn - function to execute
     * @param [context] - support specifying context (ie. this)
     */
    this.addHandlerByEventId = function(eventId, fn, context) {
        //create for event if it does not exist
        if (!eventHandlers[eventId]) {
            eventHandlers[eventId] = [];
        }
        //context = context || window;
        fn = (typeof fn === 'function' ? fn : context[fn]);

        eventHandlers[eventId].push({fn:fn, context: context});
    };

    /**
     * Authorize connection
     * @param authParams
     * @param {object} authParams - authorization parameters
     * @param {string} authParams.authKey - authorization key for entity
     * @param {string} [authParams.token=dexit.scp.device.config.getToken()] - access token
     */
    this.authorize = function (authParams) {
        ebIntegrationImpl.authorize(authParams);
    };

    /**
     * Setu
     * @function
     */
    function init(supplied) {
        if (!supplied) {
            throw new Error("Must supply event handler");
        }
        handler = supplied;
    }

    /**
     * IEvent received from ebMessageHandler
     * @param {object} event - IEvent
     * @param {string} event.id - identifier
     * @param {object} [event.body] - data body included
     * @param {object} [event.body.attributes] - commonly included
     */
    this.onReceiveEvent = function(event) {
        handleEventById(event.id, event.body);
    };

    //NOTE: should also add registerEvent, fireEvent list, register producer, register consumer for more features SDK

    // this.fireEvent = function(eventId, body) {
    //     ebIntegrationImpl.fireEvent(eventId,body);
    // };


};;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, _, DEBUG, SockJS */

/**
 * @param websocketLogger - can be overridden to log events
 * @param sockJSLib - can be overridden for testing
 * @constructor
 */
dexit.EBWebSocketModule= function (webSocketLogger, sockJSLib) {

    // can be overridden to log events
    var wsLogger = webSocketLogger || function(msg, obj) {};

    //can override SOCKJS library for testing
    var SockJSLib = sockJSLib || SockJS;

    var connection;
    //default true
    var connected = true;
    var exitMode = false;
    var fallback = 1;
    // array of functions to call on reconnection
    var reopenActions = [];

    var handleEventFn =  function (event) { };


    /**
     *
     * @param {object} val - function that will be called after processing received event
     */
    this.setHandleEventFn = function (val) {
        handleEventFn = val;
        createWS();
    };


    /**
     *
     * @return {*}
     */
    this.getConnection = function() {
        return connection;
    };
    /**
     *
     * @param {string} id - event identifier
     * @param {object} data - event data
     */
    this.fireEvent = function (id, data) {
        var dat = {
            op: 'trigger',
            body: {
                event_id: id,
                data: data
            }
        };
        connection.send(JSON.stringify(dat));
    };

    //hold references to timeoutIds
    var timeoutAuthWS;
    var timeoutKeepAlive;
    var timeoutIsOnline;
    var timeoutCreateWS;

    var createWS = function () {
        //bind handlers
        var sock = new SockJSLib(dexit.scp.device.config.getEndPoints().rts.ebws);
        connection = sock;
        connection.onopen =handler.onopen;
        connection.onclose =handler.onclose;
        connection.onmessage = handler.onmessage;
        connection.onerror = handler.onerror;
        timeoutKeepAlive = setTimeout(keepAlive, 5000);
        setTimeout(isOnline,1000);
    };



    this.authorize = function(authParams) {
        function authWS(data) {
            if( connection.readyState !== SockJSLib.OPEN ) {
                timeoutAuthWS = setTimeout(authWS.bind(null,data),  100);
                return;
            } else {
                connection.send(JSON.stringify(data));
                return;
            }
        }

        var data = {
            op: 'auth',
            body: {
                auth_key: authParams.authKey

            }
        };
        //need to make sure empty string is not passed in for token value
        var token = (dexit.scp.device.config ? dexit.scp.device.config.getToken() : undefined);
        if (authParams.token) {
            token = authParams.token;
        }
        if (token) {
            data.body.token = token
        }


        authWS(data);
        //also add to re-open actions (may be a better spot to do this but handling of ws specific is here)
        reopenActions.push(function (authParams) {
            this.authorize(authParams);
        }.bind(this,authParams));


    };

    var keepAlive = function () {
        try {
            clearTimeout(timeoutKeepAlive);
            if (exitMode) {

                return;
            }
            timeoutKeepAlive = setTimeout(keepAlive, 60000);

            if (connection.readyState === SockJSLib.CONNECTING) {

            } else if (connection.readyState === SockJSLib.OPEN) {
                if (DEBUG) {

                }
                fallback = 1;

                //Create a timestamp
                var now = new Date().toJSON();
                //now.format("dd/M/yy h:mm tt");
                //Create the keep-alive message
                var msg = JSON.stringify({ poke: now });

                connection.send(msg);
            } else if (connection.readyState === SockJSLib.CLOSING) {

            } else if (connection.readyState === SockJSLib.CLOSED) {

            }
        } catch (e) {

        }
    };



    var isOnline = function () {
        if (exitMode) {
            clearTimeout(isOnline);

            return;
        }
        timeoutIsOnline = setTimeout(isOnline, 5000);

        //if connected to network
        if (navigator.onLine) {
            if (DEBUG) {

            }

            //Check to see if it was disconnected
            if (connected === false) {
                //Restart the application (connection may auto resume)
                connection.close();
                return;
            }

            connected = true;

        } else {

            connected = false;
        }
    };

    var handleReconnect = function() {
        function forEachAEvent(aeventobject, id) {
            aeventobject.authorize(function (err, data) {

            });//END forEachAEvent
        }
        function forEachAEventContainer(aec) {
            //TODO: in future container could receive event or search in child containers
            _.each(aec.object, forEachAEvent);
        }
        function forEachSmartContentObject(sco) {
            _.each(sco.aevent, forEachAEventContainer);
        }

        //TODO: need to make sure the token is valid here (as this fires when the socket reconnects)

        // if this is not the first time, perform any reopen actions
        if (fallback > 1) {

            _.each(reopenActions, function (action, i) {
                action();
            });

            //going through from SCO -> aevent containers -> aevent object
            //TODO: for now only look at smartcontent object but in future will also require to go through smartcontent containers
            _.each(dexit.scp.device.management.scmanager.smartcontent.object, forEachSmartContentObject);
        }
    };

    var parseMessage = function (op, data) {

        //Parse for Authorization Response
        if (op === 'authresponse') {

            if (data && data.body && data.body.error_code === 401) { //unathorized token
                //TODO: should be better way than to refresh page
                dexit.scp.device.util.refreshPage();
            }

        } else if (op === 'subscribeResponse') { //Parse for Subscription Response
            //ignored for now
        } else if (op === 'unsubscribeResponse') { //Parse for Unsubscription Response
            //ignored for now
        } else if (op === 'getmyeventsResponse') { //Parse for getMeEvents Response
            //ignored for now
        } else if (op === 'receive') { //Parse for Receive (invoked event)

            var dat = {
                id: data.body.event_id,
                body: _.omit(data.body,'event_id')
            };

            handleEventFn(dat);

        } else if (op === 'pokeResponse') {
            if (DEBUG) {

            }
        }


    };

    var exit = function() {

        exitMode =true;
        clearTimeout(timeoutIsOnline);
        clearTimeout(timeoutCreateWS);
        clearTimeout(timeoutKeepAlive);
        if (connection && !_.isEmpty(connection)) {
            connection.close();
        }
    };

    var handler = {
        onopen: function () {

            wsLogger('[*] WS onOpen!');

            handleReconnect();

        },
        onmessage: function (e) {
            if (DEBUG) {

                wsLogger('[.] onMessage ', e.data);
            }
            var data = '',
                op = '';
            //Parse the message into a JSON object
            if (e) {
                if (_.isString(e.data)) {
                    data = JSON.parse(e.data);
                }

                op = data.op;
            }
            if (DEBUG) {

            }

            //Parse for message
            parseMessage(op, data);
        },
        onclose: function () {

            wsLogger('[] onClose');

            if (exitMode) {
                clearTimeout(keepAlive);

                clearTimeout(createWS);

                return;
            }

            fallback++;
            //setTimeout of random interval

            //will wait an random time between 0 to 15 milliseconds on increasing intervals on failure
            var timeoutCreateWS = setTimeout(function () {
                createWS();
            }, dexit.scp.device.util.getRandomBackoffTime(15, fallback - 1));
        },
        onerror: function (e) {

            wsLogger('[.] onError!', e.message);
        }
    };





};



;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, _, smartcontentobject, noop, dexit */

dexit.scp.device.management = {};
dexit.scp.device.management._initLocation= false;
dexit.scp.device.management.scmanager =
    {
        //Variable to store the smart content objects & containers in use
        smartcontent: {
            container: {},
            object: {}
        },
        aevent: {
            object: {}
        },
        behaviour: {},

        _ensureConfigurationIsLoaded: function() {
            'use strict';
            if (!dexit.scp.device.config){
                dexit.scp.device.loadConfig();
            }
        },
        /**
         * Make sure the location information is initialized at the device.
         * For now the location is only based on the channel
         */
        _initLocation: function(callback) {
            'use strict';
            this._ensureConfigurationIsLoaded();

            if (dexit.scp.device.management._initLocation){
                callback();
                //FIX: only set if channel.location is set
            }else if (dexit.ep.lib.profile && !dexit.ep.lib.profile.location &&  dexit.scp.device.resolution.touchpoint && dexit.scp.device.resolution.touchpoint.channel && dexit.scp.device.resolution.touchpoint.channel.location){
                dexit.ep.module.setLocationId(dexit.scp.device.resolution.touchpoint.channel.location, function(err) {
                    if (err){

                        callback(err);
                    }else {
                        dexit.scp.device.management._initLocation = true;
                        callback();
                    }
                });
            }else {

                callback();
            }
        },

        /**
         * A request object for loading a smart content object.  Useful to enable caching and prefix for cache key
         * @typedef SCObjectRequest
         * @type {object}
         * @property {string} id - Smart Content Identifer
         * @property {boolean} [cacheable] - if the result can be cached
         * @property {boolean} [cachePrefix=''] - if cacheable is set, then the prefix an be optionally appended
         *
         */

        /**
         * Populate the respective SC Objects or Container
         * @param container - Identities of SC Containers to Populate.
         * @param {string[]|SCObjectRequest[]} object - Identities of SC Objects to Populate (if object is an object then it contains scId and prefix, and if its cacheable)
         * @param callback - Function to call on completion.
         */
        init: function (container, object, callback) {
            'use strict';
            var self = this;

            self._ensureConfigurationIsLoaded();

            function initSCContainer() {
                //TODO Initialize the SCD from SC Container instead of only Objects
                callback(new Error('unsupported operation'));
            }

            function initSCObject() {
                function commonCallback(err, data) {
                    counter--;

                    if (counter <= 0) {
                        callback(undefined, true);
                    }
                }//END commonCallback



                //Set the counter
                counter = _.size(object);
                /*jshint -W117*/
                _.each(object, function(objectId) {
                    this.loadSmartContentObject(objectId,commonCallback.bind(this));
                }.bind(this));

            }//END initSCObject
            callback = callback || noop;
            var counter = 0;

            self._initLocation(function(err) {
                if (container && !_.isEmpty(container)) {
                    //Container ids passed in
                    initSCContainer.bind(self)();
                }
                else if (object && !_.isEmpty(object)) {
                    //Object ids passed in
                    initSCObject.bind(self)();
                } else {
                    //Object ids missing
                    var e = new Error('Ids must be provided for either SC Container or Object(S)!', 'dexmanager.js');
                    callback(e);
                }
            });
        },
        /**
         * Loads the SmartContent object
         * @param {string|SCObjectRequest} scReq
         * @param callback
         */
        loadSmartContentObject: function (scReq, callback) {
            'use strict';
            function commonCallback(err, data) {
                if (err) {

                    return callback(err);
                }

                //add instance to SC
                if(dexit.scp.device.resolution && dexit.scp.device.resolution.touchpoint) {
                    scobject._channelInstance = dexit.scp.device.resolution.touchpoint.channel_id;
                    scobject._deviceInstance = dexit.scp.device.resolution.touchpoint.deviceId;
                }
                else{

                }
                scobject._monitor = dexit.scp.device.monitor.createMonitor(scobject);

                callback(undefined, true);
            }

            function handleInitResponse(err, data) {
                this.smartcontent.object[scobject.id] = scobject;
                //Go off and execute/render each SC Object
                scobject.execute(commonCallback.bind(this));
            }//END handleInitResponse

            function handleRetrieved(err, data) {
                //SC Object Created, now initialize
                scobject.init(handleInitResponse.bind(this));
                //this.smartcontent.object[scobject.id] = scobject;
            }//END handleRetrieve



            let scId = (_.isObject(scReq) ? scReq.id : scReq);


            //if it exists then reload
            if (this.smartcontent.object[scId]) {
                //run update
                this.updateSmartContentObject(scReq, callback);
            } else {
                //initialize from scratch
                var scobject = Object.create(smartcontentobject, { id: { value: scId } });



                if (_.isObject(scReq) && scReq.cacheable) {
                    //TODO: want to make sure the EP -> SC are cached (so any new EP deployed will save a fresh SC object(s))
                    scobject.retrieveWithCache(scReq, handleRetrieved.bind(this));

                }else {
                    scobject.retrieve(handleRetrieved.bind(this));
                }


            }

        },
        //TODO: bind change in SC definition with the notification here for change


        /**
         * @param {string|SCObjectRequest} scReq
         * @param callback
         */
        updateSmartContentObject: function (scReq, callback) {
            'use strict';

            var self = this;
            function handleUnload(err, response) {
                if (err && err.code !== 404) {
                    return callback(err);
                }
                self.loadSmartContentObject(scReq, callback);
            }

            this.unloadSmartContentObject(scReq, handleUnload)

        },

        /**
         *
         * @param {string|SCObjectRequest} scReq
         * @param callback
         */
        unloadSmartContentObject: function (scReq, callback) {
            'use strict';

            let scId = (_.isObject(scReq) ? scReq.id : scReq);

            if (scId && this.smartcontent.object[scId]) {
                if (this.smartcontent.object[scId]._monitor) {
                    this.smartcontent.object[scId]._monitor.stop();
                }
                //TODO: unload resources nicely
                delete this.smartcontent.object[scId];
                callback();
            } else {
                var error = new Error('Cannot find the smart content object with the specified id:' + scId);
                error.code = 404;
                callback(error);
            }
        }
    };
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, _, PubSub */



/**
 * Manage the handling of local events and dispatching them to the appropriate aevent
 *
 */
dexit.scp.device.management.Aemanager = function() {
};

dexit.scp.device.management.Aemanager.prototype.receiveLocalEvent = function(msg,data) {
    "use strict";

    function forEachAEvent(aeo) {
        if (aeo.id === aeventId) {
            //TODO: remove passing of client-side event information for now as we are not doing anything with it and it can override the arguments
            aeo.receive();
        }
    }


    function forEachAEventContainer(aec) {
        //TODO: in future container could receive event or search in child containers
        _.each(aec.object, forEachAEvent);
    }

    //retrieve scId bound and pass the event to the relevant aevent object
    var aeventId = data.aeventObjectId;
    var smartContentId = data.smartContentId;
    var eventData = data.data || {};

    //TODO: for now only look at smartcontent object but in future will also require to go through smartcontent containers
    _.each(dexit.scp.device.management.scmanager.smartcontent.object[smartContentId].aevent, forEachAEventContainer);

};


dexit.scp.device.management.aemanager = new dexit.scp.device.management.Aemanager();
PubSub.subscribe('scp.device.sc.localEvent',dexit.scp.device.management.aemanager.receiveLocalEvent);



;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, DEBUG, _ */
dexit.scp.device.smartcontent = {};


function handleDEXObjectXHRResponse(err, data) {
    if( err ) {
        throw new Error(err);
    } else {
        if( _.isObject(data) ) {
            //Populate the concept with properties

            //Populate the concept with properties
            if( !_.isUndefined(data.property) ) {
                this.property = data.property;
                delete data.property;
            }
//                if( !_.isUndefined(data.kind) ) {
//                    this.kind = data.kind;
//                    delete data.kind;
//                }
            if( !_.isUndefined(data.id) && ( _.isUndefined(this.id) || this.id === '' ) ) {
                this.id = data.id;
                delete data.id;
            } else {
                delete data.id;
            }
            for(var obj in data) {
                if (DEBUG) {

                }
                this[obj] = data[obj];
            }

            this.callback(undefined, this);

        } else {
            //Deal with a 204 - No Data
            this.callback(undefined, this);
        }
    }
}//END handleDEXObjectXHRReponse


/**
 * Create a new DEX Object. Holds the shared methods for SC Concepts.
 * @param args - The arguments required in-order create a new DEX Object.
 *          repository - The SC repository that the concepts are located in.
 *          id - Optional. The identity of an existing concept. Used to populate data from
 *              a SCC DEX Object.
 *          resource - The resource for the particular SC Concept.
 * @constructor
 */
var dexobject = {
    endpoints: dexit.scp.device.config.getEndPoints(),
    repository : dexit.scp.device.config.getRepository(),
    resource : '',
    property : '',
    id : '',
    kind : '',
    url : '',
    callback : '',
    parent : '',
    create : function(callback) {
        var headers =
                {
                    Accept : 'application/json'
                },
            query,
            data = this.property;

        this.callback = callback;

        new dexit.scp.device.request.DEXRequest('POST', this.resource, headers, query, data, handleDEXObjectXHRResponse.bind(this));
    },
    retrieve : function(callback) {
        var headers =
                {
                    Accept : 'application/json'
                },
            query, data;

        this.callback = callback;

        new dexit.scp.device.request.DEXRequest('GET', this.resource + this.id, headers, query, data, handleDEXObjectXHRResponse.bind(this));
    },

    /**
     *
     * Allows retrievable of object and enable caching it
     * TODO: allow caching with time expiry
     * @param {object} cacheParams
     * @param {string} [cacheParams.cachePrefix] - prefix for cache key
     * @param callback
     */
    retrieveWithCache : function(cacheParams, callback) {
        //check the cache

        var headers =
                {
                    Accept : 'application/json'
                },
            query, data;

        this.callback = callback;
        dexit.scp.device.request.cacheableDEXRequest(cacheParams,'get', this.resource + this.id, headers, query, data, handleDEXObjectXHRResponse.bind(this));
    },
    update : function(callback) {
        var headers =
                {
                    Accept : 'application/json'
                },
            query, data;

        this.callback = callback;

        new dexit.scp.device.request.DEXRequest('PUT', this.resource + this.id, headers, query, data, handleDEXObjectXHRResponse.bind(this));
    },
    destroy : function(callback) {
        var headers =
                {
                    Accept : 'application/json'
                },
            query, data;

        this.callback = callback;

        new dexit.scp.device.request.DEXRequest('delete', this.resource + this.id, headers, query, data, handleDEXObjectXHRResponse.bind(this));
    },
    assign : function(type, id, callback) {
        var headers =
                {
                    Accept : 'application/json'
                },
            query =
                {
                    id : id,
                    type : type
                },
            data;

        this.callback = callback;

        new dexit.scp.device.request.DEXRequest('POST', this.resource + this.id+'/assign', headers, query, data, handleDEXObjectXHRResponse.bind(this));
    },
    unassign : function(type, id, callback) {
        var headers =
                {
                    Accept : 'application/json'
                },
            query =
                {
                    id : id,
                    type : type
                },
            data;

        this.callback = callback;

        new dexit.scp.device.request.DEXRequest('delete', this.resource + this.id+'/assign', headers, query, data, handleDEXObjectXHRResponse.bind(this));
    },
    populate : function(data, callback) {
        function forEachProp(v, n) {
            this[n] = v;
        }

        if( _.isUndefined(data) ) {
            var err = new Error('You must provide data in-order to populate the object.');
            callback(err);
            return;
        }

        if( _.isObject(data) ) {
            _.each(data, forEachProp.bind(this));

            if( callback ) {
                callback(undefined, true);
            } else {
                return true;
            }
        }


    },
    setParent: function(obj) {
        if (obj && obj.id) {
            this.parentObj = obj;
        }
    },
    getParent: function() {
        return this.parentObj;
    }
};

var scobjects =
    {
        aevent :
            {
                container : {},
                object :
                    {}
            },
        behaviour :
            {},
        decision :
            {
                production : {}
            },
        intelligence :
            {
                concept : {},
                information : {}
            },
        multimediabody :
            {
                animation : {},
                audio : {},
                image :
                    {},
                text :
                    {},
                textinput : {},
                video : {}
            },
        layout :
            {},
        smartcontent :
            {
                container : {},
                object : {}
            }
    };
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject, _, aeventobject */
var aeventcontainer = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/aevent/container/'}
    }
);

aeventcontainer.populate = function(data, callback) {
    "use strict";
    function forEachProp(v, n) {
        this[n] = v;
    }//END forEachProperty

    function forEachObject(v, n) {
        function handlePopulatedObject(err, data) {
            objectcount--;

            //Add it to this concept
            this.object[o.id] = o;
            //Add the Application Event Object to the SCD Manager
            //TODO: remove at later date after testing
            // dexit.scp.device.management.scmanager.aevent.object[o.id] = o;

            commonCallback();
        }//END handlePopulatedObject
        //Create each information object
        var o = Object.create(aeventobject);
        this.parent  =
            //Populate the information
            o.populate(v, handlePopulatedObject.bind(this));
    }//END forEachInformation

    function forEachContainer(v, n) {
//        //Create each information object
//        var o = Object.create(scconcept);
//        //Populate the information
//        o.populate(v);
//        //Add it to this concept
//        this.container[o.id] = o;
    }//END forEachConcept

    function commonCallback() {
        if( objectcount <= 0 && containercount <= 0 ) {
            if( callback ) {
                callback(undefined, true);
            } else {
                return true;
            }
        }
    }//END commonCallback

    //Check to make sure data was passed to the function
    if( _.isUndefined(data) ) {
        var err = new Error('You must provide data in-order to populate the object.');
        if (callback) {
            return callback(err);
        }
        throw err;
    }

    var containers = [],
        objects = [],
        objectcount = 0,
        containercount = 0;

    if( _.isObject(data) ) {
        containers = data.container;
        objects = data.object;

        //Set the properties for the Concept
        _.each(data, forEachProp.bind(this));
        //Prepare variables to hold the sub-concepts & information
        this.container = {};
        this.object = {};

        //Check to see if there is any information - create related concepts
        if( objects && !_.isEmpty(objects) ) {
            objectcount = _.size(objects);
            _.each(objects, forEachObject.bind(this));
        }

        //Check to see if there are any sub-containers - recursive call
        if( containers && !_.isEmpty(containers) ) {
//            containercount = _.size(containers);
            //Create each concept - then call populate (recursive)
            _.each(containers, forEachContainer.bind(this));
        }

        if (!objects || _.isEmpty(objects)) {
            //To fix empty aeventcontainer load
            objectcount--;
            commonCallback();
        }

    }
};

/**
 * Run through all the AEvent Objects and authorize them against EB. Check for sub-containers
 * and execute them as well.
 */
aeventcontainer.execute = function(callback) {
    "use strict";

    function forEachObject(object) {
        if( object.kind === 'applicationevent#object' ) {
            object.setParent(this);
            if( object.authorize ) {
                //Bind the respective behaviour for the event
                object.bind(commonCallback.bind(this));
                //Authorize each AEvent Object
                object.authorize(commonCallback.bind(this));
            }
        }
    }

    function forEachContainer(container) {
        if( container.kind === 'applicationevent#container' ) {
            container.setParent(this);
            if( container.authorize ) {
                //Execute the container in-order to authorize all contained AEvent Objects
                container.execute(commonCallback.bind(this));
            }
        }
    }

    function commonCallback(err, data) {
        count--;

        if( count <= 0 ) {
            callback(undefined);
        }
    }

    try {
        var count = 0;

        if( !_.isEmpty(this.container) ) {
            count += _.size(this.container);
        }
        if( !_.isEmpty(this.object) ) {
            count += (_.size(this.object) * 2);
        }
        //Run through all the AEvent Objects and Execute them (Authorize)
        _.each(this.object, forEachObject.bind(this));
        //Run through all the AEvent Containers and Execute them
        _.each(this.container, forEachContainer.bind(this));

        //Check to make sure if both are empty by chance and call the callback
        if( _.isEmpty(this.object) && _.isEmpty(this.container) ) {
            callback(undefined);
        }
    } catch(e) {

        callback(e, undefined);
    }
};
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject, _, SockJS, noop  */
/**
 * Create a new Application Event Object. Child of dexobject.
 * Setup the endpoint and the resource for accessing the SCC service.
 * @type {*}
 */
var aeventobject = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/aevent/object/'}
    }
);

aeventobject.uri = {};
aeventobject.uri.behaviour = 'http://dexit.co/smartcontent/behaviour/';

//AEventObject Authorization Behaviour
aeventobject.authorize = function(callback) {
    "use strict";

    try {
        //Check to make sure the AEvent Object has an entitykey before trying to authorize
        if( _.isEmpty(this.property.entitykey) ) {

            //there is no key so we need to register!
            callback(undefined);
        } else {


            //Authorize the connection/to receive update(s) for event
            var authParams = {
                authKey : this.property.entitykey
            };
            dexit.scp.device.ebIntegration.authorize(authParams);
            callback();
        }
    } catch (err) {

        callback(err);
    }
};

//Bind the appropriate Behaviour to the Document Event via AEvent
aeventobject.bind = function(callback) {
    "use strict";

    function forEachConsumer(consumer, index) {
        consumer = consumer.split(aeventobject.uri.behaviour)[1];

        //See if it is an EB type (eb:<type>)
        if( this.property.type.substr(0,2) === 'eb' ) {
            //Custom type - doesn't bind to DOM Event Model
        } else {
            //Retrieve the element if there is an identity
            if( !_.isEmpty(this.property.identity) ) {

                var elem = document.getElementById(this.property.identity);
                elem.setAttribute(this.property.type, 'dexit.scp.device.management.scmanager.behaviour["'+consumer+'"].execute()');
            }
        }
    }

    callback = callback || noop;
    var consumers = this.property.hasConsumer;

    //Check to make sure consumers exists
    if( _.isUndefined(consumers) ) {
        consumers = [];
    }

    if( !_.isArray(consumers) ) {
        //Formatting consumers so that it is an array to iterate through
        consumers = [consumers];
    }

    _.each(consumers, forEachConsumer.bind(this));

    //After the AEVent Object Behaviour is bound to the event, callback
    callback();
};

//AEventObject Behaviour
aeventobject.subscribe = function() {
    "use strict";
    //Check to see if the AEvent Object is global; if not subscribe a new instance for SCD


};
aeventobject.unsubscribe = function() {
    "use strict";
    //Check to see if the AEvent Object is global; if not unsubscribe the new instance

};
aeventobject.getMyEvents = function() {
    //List the

};

/**
 *
 * @param {object} ievent
 * @param {string} ievent.id - identifier
 * @param {object} [ievent.body] - data body included
 * @param {object} [ievent.body.attributes] - commonly included
 */
aeventobject.receive = function(ievent) {
    'use strict';

    //currently expecting to pass data from event.body.attributes
    var data = (ievent && ievent.body &&  ievent.body.attributes) ? ievent.body.attributes : null;
    /**
     * Return tha parent SmartContent so the reference to the behaviour can be gotten
     * @param concept The concept to check
     */
    function getParentSC(concept) {
        var parent = concept.getParent();
        if (!parent) {
            return; //return immediately if no parent is set
        }
        //TODO: in the future smartcontent#container should also be supported
        if (parent && parent.kind === "smartcontent#object") {
            return parent;
        }else {
            return getParentSC(parent);
        }
    }

    /**
     * Iterate through each behaviour that consumes the aevent and execute if found
     * @param behaviourId The unique identifier for the behaviour
     */
    function forEachConsumer(behaviourId) {
        var uri = 'http://dexit.co/smartcontent/behaviour/',
            id = behaviourId.split(uri)[1];
        if (scObject && scObject.behaviour[id]) {
            scObject.behaviour[id].execute(data);
        }else {

        }
    }

    //get SC of the current aevent is assigned to
    var scObject = getParentSC(this);

    //Get the consumer
    var consumers = this.property.hasConsumer;

    if( _.isEmpty(consumers) ) {
        return;
    }

    if( !_.isArray(consumers) ) {
        consumers = [consumers];
    }

    _.each(consumers, forEachConsumer);

};
aeventobject.produce = function(data, callback) {
    'use strict';
    callback = callback || noop;
    //Behaviour that produces this event will call produce - trigger IEvent
    var headers =
            {
                Accept : 'application/json',
                'X-Auth-Key' : this.property.entitykey
            },
        query,
        url = dexit.scp.device.config.getEndPoints().rts.eb + '/events/' + this.property.eventid + '/trigger';

    new dexit.scp.device.request.XHRRequest('POST', url, headers, query, data, callback);

};

/*Behaviour related to Assigning & Un-assigning Producer and Consumer (Behaviour)*/
aeventobject.assignConsumer = function(id, callback) {
    'use strict';
    callback = callback || noop;
    var headers =
            {
                Accept : 'application/json'
            },
        query,
        data;

    new dexit.scp.device.request.DEXRequest('post', this.resource + this.id+'/consumes/'+id, headers, query, data, callback);
};
aeventobject.assignProducer = function(id, callback) {
    'use strict';
    callback = callback || noop;
    var headers =
            {
                Accept : 'application/json'
            },
        query,
        data;

    new dexit.scp.device.request.DEXRequest('post', this.resource + this.id+'/produces/'+id, headers, query, data, callback);
};

aeventobject.unassignConsumer = function(id, callback) {
    'use strict';
    callback = callback || noop;
    var headers =
            {
                Accept : 'application/json'
            },
        query,
        data;

    new dexit.scp.device.request.DEXRequest('delete', this.resource + this.id+'/consumes/'+id, headers, query, data, callback);
};
aeventobject.unassignProducer = function(id, callback) {
    'use strict';
    callback = callback || noop;
    var headers =
            {
                Accept : 'application/json'
            },
        query,
        data;

    new dexit.scp.device.request.DEXRequest('delete', this.resource + this.id+'/produces/'+id, headers, query, data, callback);
};
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject, _ */
var scproduction = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/decision/production/'}
    }
);

scproduction.ruleEngine = {};


//TODO: look later at integrating rule engine if needed
scproduction.ruleEngine.evaluate = function(condition, callback) {
    //eval is most appropriate for this purpose
    /* jshint -W061*/
    if (condition && condition.length > 0 && eval(condition)) {
        callback(null,true); //true
    }else {
        callback(); //false
    }
}

scproduction.validActionTypes = ["event-based","behaviours", "production"];

/**
 * single resolve
 * @param arguments key value pairs
 * @param conditionString
 */
scproduction.resolveIntelligence = function(args, conditionString, callback) {
    var self = this;
    function handleArgumentReplace(value, key) {
        if (conditionString.indexOf(key) !== -1) {
            toEval = conditionString.replace(key, value)
        }
    }


    function returnIfNumber(item){
        var val = Number(item);
        if (!_.isNaN(val)){
            return val;
        }else {
            return item;
        }
    }

    function parseString(data, rightSide) {
        var newString = "";
        data = returnIfNumber(data);
        rightSide = returnIfNumber(rightSide);

        if (!_.isNumber(data)){
            newString += "'"+data +"'";
        }else {
            newString += data;
        }
        newString += comparator;

        if (!_.isNumber(rightSide)){
            newString += "'"+rightSide+"'";
        }else {
            newString += rightSide;
        }
        return newString;
    }

    function handleResolveIntelligenceResponse(err, data) {
        if (data) {
            callback(null,data,parseString(data,rightSide));
        }else {
            callback(err,data);
        }

    }
    var toEval = conditionString;

    //replace arguments
    _.each(args, handleArgumentReplace);

    var parsed = dexit.scp.device.util.parseIntelligenceConditionString(toEval);
    var rightSide = parsed.rightSide;
    var comparator = parsed.comparator;
    var leftSide = parsed.leftSide;

    var intel = dexit.scp.device.util.parseIntelligenceString(self.getParent().id,leftSide);
    if (intel) {
        dexit.scp.device.util.resolveIntelligenceValue(intel, handleResolveIntelligenceResponse);
    }else {
        //no intelligence try to just eval the current
        callback();

    }


}

/**
 * Evaluates the decision.  Will only evaluate decisions if the current execution stage matches.
 * This function is intended to filter as outside caller should not know of execution internals.
 *
 * @param args  arguments: decision arguments
 *              execution_stage: (optional) used to help evaluate.  Must be manually specified currently as lifecycle is not captured in sC
 * @param callback
 */
scproduction.evaluate = function(args, intelParams, execution_stage, callback) {
    function isFunction(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    }

    var filter = false;
    var self = this;
    // check for argument length for backward compatability
    if (arguments && arguments.length === 2){
        if (isFunction(intelParams)){
            callback = intelParams;
            intelParams = {}
        }
        // if the current execution stage does not match, then must return immediately
    }else if (arguments && arguments.length === 3) {
        if (isFunction(execution_stage)) {
            callback = execution_stage;
            execution_stage = intelParams;
            intelParams = {};
        }
        //return if this should not be executed.  Prevent uncaught exception through checks
        if (self.property && self.property.execution_stage && execution_stage && execution_stage !== self.property.execution_stage) {
            //callback immediately if it should not execute
            return callback(null,false);
        }
    }

    /**
     * Cloud evaluation will return a result
     * @param err if an error occurred
     * @param result The result of the evaluation
     */
    function handleEvaluateDecisionResponse(err, result) {
        if (err) {

            return callback(err);
        }

        callback(undefined,result);
    }

    function evaluateCloud() {
        var scId = self.getParent().id;
        if (!scId){
            scId = args.smartContentId;
        }
        var headers = {'Content-Type':'application/json'};
        var resource ='/management/smartcontent/'+scId +'/decision/'+self.id +'/evaluate';
        var toSend = args;
        dexit.scp.device.request.DEXRequest('post', resource, headers, toSend, intelParams, handleEvaluateDecisionResponse);
    }


    function mapToBehaviourArguments(toPassIn, argsToSub) {
        var toPassValues = [];
        _.each(argsToSub, function(elementToSub) {
            _.each(toPassIn, function(elementPassingValue, elementPassingKey) {
                if (elementToSub === elementPassingKey) {
                    toPassValues.push(elementPassingValue);
                }
            });
        });
        return toPassValues;
    }

    function handleIntelligenceData(err, data, newConditionString) {
        if (err){
            return callback(err);
        }

        var action = property.action;
        var actionType = property.actionType;
        if (newConditionString) {
            condition = newConditionString;
        }

        self.ruleEngine.evaluate(condition,function(err, result) {
            if (err) {

                return callback(err);
            }
            if (!result) {
                return callback(null,false);
            }
            if (action && actionType && self.validActionTypes.indexOf(actionType.toLowerCase()) !== -1 ) {

                if (actionType.toLowerCase().indexOf('behaviour') !== -1) {


                    //for input into the behaviour
                    var behaviourArguments = property.behaviour_input_arguments;

                    //map to behaviour arguments
                    var behaviourArgs = self.getParent().behaviour[action].property.args;

                    var toPass = [];
                    if (behaviourArguments) {
                        var dat = mapToBehaviourArguments(behaviourArgs, behaviourArguments);
                        if (_.isString(behaviourArguments)) {
                            behaviourArguments = [behaviourArguments];
                        }
                        _.each(behaviourArguments, function(element, key) {
                            var intel = dexit.scp.device.util.parseIntelligenceString(self.getParent().id,element);
                            if (intel) {
                                dexit.scp.device.util.resolveIntelligenceValue(args,intel, function(err, data) {
                                    if (err) {

                                        return callback(err);
                                    }
                                    toPass.push(data);
                                });
                            }else {
                                //if supplied in the input
                                if (args && args[element]) {
                                    //set the output arg
                                    toPass[key] = args[element];
                                    toPass.push(args[element]);
                                }
                            }
                        });

                    }else {
                        toPass = behaviourArgs || [];
                    }
                    var inputArg = toPass || [];


                    self.getParent().behaviour[action].execute(inputArg,callback);

                }else if (actionType.toLowerCase().indexOf('aevent') !== -1) { //event-based

                    var aeventArguments = property.behaviour.aevent_input_arguments;
                    var inputArgs = aeventArguments || {};

                    dexit.scp.device.management.scmanager.aevent.object[property.action].produce(inputArgs, callback);
                }else {

                    callback(null,true);
                }
            }else {

                callback(null,false);
            }




        });

    }

    function evaluateDevice() {
        var args2 = {};
        args2[property.arguments] =args[property.arguments];
        self.resolveIntelligence(args2, condition, handleIntelligenceData);


    }
    var property = self.property;
    var condition = ''+property.condition;
    //cannot directly evaluate
    if (condition && condition.indexOf('ae:') === 0) {
        return callback(null,false);
    }

    //check if the decision is a cloud or device side through "context"
    var context = self.property.context || 'Cloud';
    if (context.toLowerCase() === 'device') {
        evaluateDevice();
        //supposed to be "device" or "cloud" but adding service as see this being passed in
    }else if (context.toLowerCase() === 'cloud' || context.toLowerCase() === 'service') {
        evaluateCloud();
    }else {
        var msg = 'Unrecognized context for decision. Context:'+context;

        callback(new Error(msg));

    }

};
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject, _, dexit, scinformation  */
var scconcept = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/intelligence/concept/'}
    }
);
scconcept.populate = function(data, callback) {
    'use strict';

    function forEachProp(v, n) {
        this[n] = v;
    }//END forEachProperty

    function forEachInformation(v, n) {
        function handlePopulatedInformation(err, data) {
            //Add it to this concept
            this.information[o.id] = o;

            if(informationcount <= 0) {
                //Information build - now create the Sub-concepts
                createSubConcepts.bind(this)();
            }
        }//END handlePopulatedinformation

        informationcount--;

        //Create each information object
        var o = Object.create(scinformation);
        //set parent concept
        o.setParent(this);
        //Populate the information
        o.populate(v, handlePopulatedInformation.bind(this));


    }//END forEachInformation

    function createSubConcepts() {
        //Check to see if there are any sub-concepts - recursive call
        if( concepts && !_.isEmpty(concepts) ) {
            //Create each concept - then call populate (recursive)
            _.each(concepts, forEachConcept.bind(this));
        } else {
            syncResponse.bind(this)();
        }
    }

    function forEachConcept(v, n) {
        function handlePopulatedConcept(err, data) {
            //Add it to this concept
            this.concept[o.id] = o;

            syncResponse.bind(this)();
        }
        //Create each information object
        var o = Object.create(scconcept);
        //Populate the Concept - i.e. Traverse the concept(s)
        o.populate(v, handlePopulatedConcept.bind(this));

    }//END forEachConcept

    function syncResponse() {
        conceptcount--;

        if( conceptcount <= 0 && informationcount <= 0 ) {
            if( callback ) {
                callback(undefined, true);
            } else {
                return true;
            }
        }
    }//END commonCallback

    //TODO Complete recursive logic

    //Check to make sure data was passed to the function
    if( _.isUndefined(data) ) {
        var err = new Error('You must provide data in-order to populate the object.');
        return callback(err);
        //return;
    }

    var concepts = [],
        information = [],
        conceptcount = 0,
        informationcount = 0;

    if( _.isObject(data) ) {
        concepts = data.concept;
        information = data.information;

        conceptcount = _.size(concepts);
        informationcount = _.size(information);

        //Set the properties for the Concept
        _.each(data, forEachProp.bind(this));
        //Prepare variables to hold the sub-concepts & information
        this.concept = {};
        this.information = {};

        //Check to see if there is any information - create related concepts
        if( information && !_.isEmpty(information) ) {
            _.each(information, forEachInformation.bind(this));
        } else {
            createSubConcepts.bind(this)();
        }

    }

};//END populate


scconcept.getAllData = function(callback) {
    'use strict';
    dexit.scp.device.em._getAllData(this.getParent().id,this,callback);
};


/**
 *
 * @param filter
 * @param callback
 */
scconcept.getData = function(filter,callback) {
    'use strict';
    var smartContentId = this.getParent().id;

    dexit.scp.device.em._getData(smartContentId,this,filter,callback);
};


scconcept.addData = function(smartContentId, data, key, value,callback) {
    'use strict';
    var headers = {'Content-Type':'application/json'};
    var q;
    if (key) {
        q = {};
        q.key = value;
    }

    var location = '/management/smartcontent/' + smartContentId + '/intelligence/' + this.id + dexit.scp.device;
    new dexit.scp.device.request.XHRRequest('POST', location, headers, q, data, callback);

};


scconcept.updateData = function(smartContentId, data, key, value, callback) {
    'use strict';
    if (!key) {
        return callback(new Error("Must specify key"));
    }

    var headers = {'Content-Type':'application/json'};
    var location = '/management/smartcontent/' + smartContentId + '/intelligence/' + this.id + "/";
    var q = {};
    dexit.scp.device[key] = value;
    new dexit.scp.device.request.XHRRequest('PUT', location, headers, q, data, callback);
};

scconcept.deleteData = function(smartContentId, key, value, callback) {
    'use strict';
    if (!key) {
        return callback(new Error("Must specify key"));
    }

    var location = '/management/smartcontent/' + smartContentId + '/intelligence/' + this.id + "/";
    var headers = {'Content-Type':'application/json'},
        query = {};
    query[key] = value;
    new dexit.scp.device.request.XHRRequest('DELETE', location, headers, query, undefined, callback);
};
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject, _ */

var scinformation = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/intelligence/information/'}
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject, _, noop */
var scanimationbody = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/multimediabody/animationbody/'}
    }
);

scanimationbody.render = function(callback) {
    callback = callback || noop;
    callback();
};;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject, _, noop */

var scaudiobody = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/multimediabody/audiobody/'}
    }
);

scaudiobody.render = function(callback) {
    callback = callback || noop;
    callback();
};

scaudiobody.preload =
    [
        'none',
        'metadata',
        'auto'
    ];;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject, _, noop */
var scimagebody = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/multimediabody/imagebody/'}
    }
);

scimagebody.render = function(callback) {
    callback = callback || noop;
    callback();
};;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject, _ , noop */
var sctextbody = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/multimediabody/textbody/'}
    }
);

sctextbody.render = function(callback) {

    callback = callback || noop;
    callback();

};;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject, _, noop */

var sctextinputbody = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/multimediabody/textinputbody/'}
    }
);

sctextinputbody.render = function(callback) {
    callback = callback || noop;
    callback();
};;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject, _, noop */

var scvideobody = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/multimediabody/videobody/'}
    }
);

scvideobody.render = function(callback) {
    callback = callback || noop;
    callback();
};

scvideobody.preload =
    [
        'none',
        'metadata',
        'auto'
    ];;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject, _, noop, dexit */
var scbehaviour = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/behaviour/'}
    }
);

/*jshint -W061 */
/**
 * Execute behaviour
 * @param args
 * @param callback
 * @return {*}
 */
scbehaviour.execute = function(args, callback) {
    callback = callback || noop;
    var self = this;
    var context = self.property.context || "";
    var type = self.property.type;

    /*
     * Check to see if there is a property isProducer; if so, also trigger the
     * associated IEvent
     * */
    //Check to see if it is a service or a local action
    if  (type && type.toLowerCase() === 'service'  && (context && context.toLowerCase() === 'device')) {
        var executionArgs = {
            operation : self.property.name,
            parameters : args || self.property.args
        };
        //TODO: args should be better matched but make sure args from definition are used as backup
        return dexit.rtsc.sb.manager.executeService(self.property.location, executionArgs, callback);
        //TODO:  context should not be service but this option supports legacy DX
    } else if ( (type && type.toLowerCase() === 'service' ) && (context && (context.toLowerCase() === 'cloud' || context.toLowerCase() === 'service') )) {
        var options = {};
        options.headers = {'Content-Type':'application/json'};
        //TODO: pass additional parameters to have service-side resovle
        var toSend = {body:args.body, header:args.header, args: args};
        var resource ='/management/smartcontent/'+this.getParent().id +'/behaviour/'+this.id +'/';
        var cb = _.partial(this.handleDEXBehaviourXHRResponse,callback);
        dexit.scp.device.request.DEXRequest('POST', resource, options.headers, undefined, toSend, cb);
        //only for backwards compatibility TODO: remove in next release
    } else if ( (type && type.toLowerCase() === 'function') || (context && context.toLowerCase() === 'device')) {


        var namespace = this.property.location;
        var func = this.property.action;
        var argDef = this.property.args;
        var executionContext = this.property.executionContext;

        if (!namespace) {
            return callback(new Error('The behaviour must have a location (namespace) specified'));
        }

        if (!func) {
            return callback(new Error('The behaviour must have a name (function) specified'));
        }

        var operation = namespace+'.'+func;

        var argLength =0;
        if(args) {

            if (_.isArray(argDef)){
                argLength = argDef.length;
            }else {
                argLength =1;
            }
        }
        var processedArg = _.after(argLength, function() {

            if( !executionContext) {
                //TODO: ST can a better way be found instead of using eval?
                try {
                    eval(operation)(argDef);
                }catch(ex1) {

                }
                callback();
            } else {
                try {
                    executionContext = eval(executionContext);

                    eval(operation).call(executionContext, argDef);
                    callback();
                }catch(ex2) {

                }
            }
        });

        //If the args paprossed in aren't undefined and argDef is not undefined,
        //try to retrieve the args
        if(args && !_.isEmpty(args)) {
            if(_.isArray(argDef)){  //pass to function as an array of values
                _.each(argDef, function(a, i) {

                    var intel = dexit.scp.device.util.parseIntelligenceString(self.getParent().id,a);
                    // need to resolve this argument if intelligence
                    if (intel) {
                        var argValue;
                        //resolve intelligence
                        dexit.scp.device.util.resolveIntelligenceValue(intel, function(err, data) {
                            if (err) {


                                argValue = a;
                            }else {
                                argValue = data;
                            }


                            var tmp = args[argValue];

                            if(tmp) {
                                argDef[i] = tmp;
                            }

                            processedArg();
                        });
                    }else {
                        var tmp = args[a];

                        if(tmp) {
                            argDef[i] = tmp;
                        }
                        processedArg();
                    }



                });
            } else { //single string
                var tmp = args[argDef];

                if(tmp) {
                    argDef = tmp;
                }
                processedArg();
            }
            //if no args supplied then static arguments
        }else {
            if(argDef && _.isArray(argDef) ) {
                argDef = argDef.toString();
            }
            processedArg();
        }




    } else {
        //invalid behaviour
        var error = new Error('Behaviour:'+this.id + ' does not contain a valid context or type');
        return callback(error);
    }
};



scbehaviour.executeWithParams = function(args, params, callback) {
    var executionArgs = args;
    this.execute(executionArgs,callback);
};


//START handleDEXBehaviourXHRResponse
scbehaviour.handleDEXBehaviourXHRResponse = function(callback,err, data) {
    if( err ) {
        throw new Error(err);
    } else {
        callback(undefined, data);
    }
};//END handleDEXBehaviourXHRResponse
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject, _, ice */

var sclayout = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/layout/'}
    }
);

sclayout.render = function(callback) {
    if( !_.isUndefined(callback) ) {
        callback(undefined, true);
    } else {
        return true;
    }

};;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject */
var smartcontent = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/smartcontent/'}
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject */
var smartcontentcontainer = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/smartcontent/container/'}
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobject, _, scproduction, scconcept, scbehaviour, aeventcontainer, sclayout, sctextbody, sctextinputbody, scaudiobody, scimagebody, scanimationbody, scvideobody */
var smartcontentobject = Object.create(
    dexobject,
    {
        endpoints : {value : dexit.scp.device.config.getEndPoints()},
        resource : {value : '/smartcontent/object/'}
    }
);
//Behaviour to initalize the Smart Concept Object and its Children
smartcontentobject.init = function(callback) {
    function forEachConcept(v, n) {
        if( v && !_.isEmpty(v) ) {
            counter += _.size(v);
        }
    }
    function forEachDecisionInit(obj) {
        function handlePopulateResponse(err, data) {
            //Add the behaviour
            this.decision[o.id] = o;
            //Call the common callback
            commonCallback.bind(this)();
        }

        var o = Object.create(scproduction);
        //set smart content as parent of object so that there is a child-parent link
        o.setParent(this);
        //Populate the behaviour
        o.populate(obj, handlePopulateResponse.bind(this));

    }//END forEachDecisionInit
    function forEachIntelligence(obj) {
        function handlePopulateResponse(err, data) {
            //Add the behaviour
            this.intelligence[o.id] = o;
            commonCallback.bind(this)();
        }
        //        counter++;

        //TODO Populate for Container will have to be different than for an Object
        var o = Object.create(scconcept);
        //set smart content as parent of object so that there is a child-parent link
        o.setParent(this);
        //Populate the behaviour
        o.populate(obj, handlePopulateResponse.bind(this));

    }//END forEachIntelligence
    function forEachBehaviourInit(obj) {
        function handlePopulateResponse(err, data) {
            //Add the behaviour to the Smart Content Object
            this.behaviour[o.id] = o;
            //Add the behaviour into the SC Manager
            dexit.scp.device.management.scmanager.behaviour[o.id] = o;
            commonCallback.bind(this)();
        }
        //        counter++;

        var o = Object.create(scbehaviour);
        //set smart content as parent of object so that there is a child-parent link
        o.setParent(this);
        //Populate the behaviour
        o.populate(obj, handlePopulateResponse.bind(this));

    }//END forEachBehaviourInit
    function forEachAEvent(obj) {
        function handlePopulateResponse(err, data) {
            //Add the AEvent Container
            this.aevent[o.id] = o;
            //Authorize the AEVent
            //o.authorize(commonCallback.bind(this));
            commonCallback.bind(this)();
        }
        //        counter++;

        //TODO Populate for Container will have to be different than for an Object
        //Create the Application Events
        var o = Object.create(aeventcontainer);
        o.setParent(this);
        //Populate the AEvent Container
        o.populate(obj, handlePopulateResponse.bind(this));

    }//END forEachAEvent

    function forEachLayout(obj) {
        function handlePopulateResponse(err, data) {
            //Add the behaviour
            this.layout[o.id] = o;
            //Render the layout
            //o.render(commonCallback.bind(this));
            commonCallback.bind(this)();
        }
        //        counter++;

        var o = Object.create(sclayout);
        o.setParent(this);
        //Populate the layout
        o.populate(obj, handlePopulateResponse.bind(this));

    }//END forEachlayout
    function forEachMultimediaBody(obj) {
        function handlePopulateResponse(err, data) {
            //Add the Multimedia Body
            this.multimedia[o.id] = o;

            //Render the Multimedia Body
            //Check to see if the render function is available
            //            if( !_.isUndefined(o.render) ) {
            //                o.render(commonCallback.bind(this));
            //            }
            commonCallback.bind(this)();
        }
        //        counter++;

        var o = '';
        if( obj.kind === 'multimediabody#text' ) {
            o = Object.create(sctextbody);
        } else if( obj.kind === 'multimediabody#textinput' ) {
            o = Object.create(sctextinputbody);
        } else if( obj.kind === 'multimediabody#audio' ) {
            o = Object.create(scaudiobody);
        } else if( obj.kind === 'multimediabody#image' ) {
            o = Object.create(scimagebody);
        } else if( obj.kind === 'multimediabody#animation' ) {
            o = Object.create(scanimationbody);
        } else if( obj.kind === 'multimediabody#video' ) {
            o = Object.create(scvideobody);
        }
        //set smart content as parent of object so that there is a child-parent link
        o.setParent(this);

        //Populate the Multimedia Body
        o.populate(obj, handlePopulateResponse.bind(this));

    }//END forEachMultimediaBody

    function commonCallback() {
        counter--;

        if(counter <= 0) {


            if( callback ) {
                callback(undefined, true);
            } else {
                return true;
            }
        }


    }

    try {
        var concepts =
                {
                    decision : this.decision,
                    intelligence : this.intelligence,
                    behaviour : this.behaviour,
                    aevent : this.aevent,
                    layout : this.layout,
                    multimediabody : this.multimedia,
                    text : this.text,
                    textinput : this.textinput,
                    audio : this.audio,
                    image : this.image,
                    animation : this.animation,
                    video : this.video
                },
            counter = 0;

        this.decision = {};
        this.intelligence = {};
        this.behaviour = {};
        this.aevent = {};
        this.layout = {};
        this.multimedia = {};

        //Remove the individual multimedia components
        delete this.text;
        delete this.textinput;
        delete this.audio;
        delete this.image;
        delete this.animation;
        delete this.video;


        //Setup the counter
        _.each(concepts, forEachConcept.bind(this));

        //if empty then ensure callback
        if (counter < 1){
            commonCallback.bind(this)();
        }
        //Iterate through each decision - for now just production decision
        _.each(concepts.decision, forEachDecisionInit.bind(this));
        //Iterate through each Intelligence
        _.each(concepts.intelligence, forEachIntelligence.bind(this));
        //Iterate through each Behaviour
        _.each(concepts.behaviour, forEachBehaviourInit.bind(this));
        //Iterate through each Application Event
        _.each(concepts.aevent, forEachAEvent.bind(this));
        //Iterate through each layout
        _.each(concepts.layout, forEachLayout.bind(this));
        //Iterate through each Multimedia Body
        //Currently as individual Multimedia Body Elements
        _.each(concepts.text, forEachMultimediaBody.bind(this));
        _.each(concepts.textinput, forEachMultimediaBody.bind(this));
        _.each(concepts.audio, forEachMultimediaBody.bind(this));
        _.each(concepts.image, forEachMultimediaBody.bind(this));
        _.each(concepts.animation, forEachMultimediaBody.bind(this));
        _.each(concepts.video, forEachMultimediaBody.bind(this));



        //Populate each subconcept
        //Decision
        //Intelligence
        //Behaviour
        //Application Event
        //Multimedia Body
        //Layout
    } catch(e) {

        callback(e, undefined);
    }

};

/**
 * Execute the smart content and it's respective components. i.e. Bind Events, Select Layout,
 * Render Multimedia Body, etc.
 * @param callback - Function to execute on completion.
 */
smartcontentobject.execute = function(callback) {
    var count = 0;

    if( !_.isEmpty(this.aevent) ) {
        //TODO Count will need to be modified in-order to iterate through each container
        count += _.size(this.aevent);
    }
    /**
     * TODO: still need to re-engineer this method.  The layout should be known, but it is done by the specific layout
     * management.  Determining this requires additional input at run-time, not static initialization
     */
//    if( !_.isEmpty(this.layout) ) {
//        count += _.size(this.layout);
//    }


    if (count === 0){
        return callback(undefined, true);
    }

    function commonCallback(err, data) {
        count--;

        if(err) {
            if (callback) {
                callback(err);
            }else {
                throw new Error(err);
            }
        }

        if(count <= 0) {
            if( !_.isUndefined(callback) ) {
                callback(undefined, true);
            } else {
                return true;
            }
        }


        //Check to see if the Layout and Multimedia are unassigned - if so callback
        if (this.layout.length === 0 && this.multimedia.length === 0) {
            if( !_.isUndefined(callback) ) {
                callback(undefined, true);
            } else {
                return true;
            }
        }

    }//END commonCallback



    function forEachAEvent(aevent) {
        if( !_.isUndefined(aevent.execute) ) {
            aevent.execute(commonCallback.bind(this));
        }
    }

    function forRenderableObject(o) {
        try {
            if( o && o.render ) {
                o.render(commonCallback.bind(this));
            } else {
                commonCallback.bind(this)();
            }
        } catch(e) {

            commonCallback.bind(this)();
        }
    }//END forRenderableObject

    //Authenticate AEvents
    _.each(this.aevent, forEachAEvent.bind(this));
    //Render Layout
    /**
     * TODO: still need to re-engineer this method.  The layout should be known, but is done by the specific layout
     * management.  Determining this requires additional input at run-time, not static initialization
     */

    //
    //_.each(this.layout, forRenderableObject.bind(this));
    //Render Multimedia Body : removed





};
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, _ */


var dexobjectmanagement = {
    endpoints : '',
    resource : '',
    type : '',
    objs : {},
    obj : {},
    callback : '',
    /**
     * Retrieve the DEX Object by the specified identity
     * @param id - The Id of the DEX Object to find.
     * @param callback - The function to be executed on completion. Object returned on success,
     *              error otherwise.
     * @return {Object} - Object returned on success, undefined otherwise.
     */
    get : function(id, callback) {
        if( id ) {
            //Check to see if a callback was passed in
            if(!callback) {
                return this.objs[id];
            } else {
                callback(undefined, this.objs[id]);
            }
        } else {
            throw new Error('Sorry, id must be provided!');
        }
    },
    /**
     * Add the DEX Object. Make sure it is of the correct type.
     * @param obj - Object to be added.
     * @param callback - Function to execute on completion. Boolean, true returned on success,
     *                  false otherwise.
     * @return {Boolean} - True returned on success, false otherwise.
     */
    add : function(obj, callback) {
        if( obj ) {
            var added = false;
            //Check to make sure the object they passed in are of the same type
//            if(obj.type != this.type) {
//                throw new Error('Sorry, the Object provided is not the correct type!');
//            } else {
            added = true;
            this.objs[obj.id] = obj;
//            }

            //Check to see if a callback was passed in
            if(!callback) {
                return added;
            } else {
                callback(undefined, added);
            }
        } else {
            throw new Error('Sorry, an Object must be provided!');
        }
    },
    /**
     * Remove the DEX Object
     * @param id - Identity of the Object to be removed from management.
     * @param callback - Function to execute on completion. Boolean, true on success,
     *                  false otherwise.
     * @return {Boolean} - True on success, false otherwise.
     */
    remove : function(id, callback) {
        if(id) {
            var removed = false;
            //Check to make sure the Object exists
            if(_.contains(this.objs, id)) {
                removed = true;
                delete this.objs[id];
            }

            //Check to see if a callback was passed in
            if(!callback) {
                return removed;
            } else {
                callback(undefined, removed);
            }
        } else {
            throw new Error('Sorry, an id must be provided!');
        }
    },
    /**
     * Retrieve all the concepts of the specified type and create them.
     * @param callback - Function to execute on completion. Boolean, true on success,
     *                  false otherwise.
     * @return {Boolean} - True on success, false otherwise.
     */
    populate : function(callback) {
        function handleDEXObjectMgntPopulateXHRResponse(err, data) {
            function populated(err, populatedRespose) {
                count--;

                if( err ) {
                    throw new Error(err);
                } else {
                    //Add the object
                    this.objs[o.id] = o;

                    if(count <= 0) {
                        this.callback();
                    }
                }
            }

            function forEachProp(v, n) {
                o = Object.create(this.obj);
                o.populate(v, populated.bind(this));
            }


            if( err) {

                callback(err);
            } else {
                var o = '',
                    count = data[this.type].length;
                if( _.isObject(data) ) {

                    _.each(data[this.type], forEachProp.bind(this));

                    callback(undefined, true);
                }else {

                    callback(undefined, false);
                }
            }
        }

        this.callback = callback;

        var headers =
                {
                    Accept : 'application/json'
                },
            query,
            data;

        //Request to list the Objects
        new dexit.scp.device.request.DEXRequest('GET', this.resource, headers, query, data, handleDEXObjectMgntPopulateXHRResponse.bind(this));
    },
    populateConcept : function(ids, callback) {
        function forEachObject(id) {
            function handleRetrieveObject(err, data) {
                count--;
                if( err ) {
                    callback(err);
                } else {
                    this.add(o);
                    commonCallback.bind(this)(count, callback);
                }
            }
            var o = '';

            count++;

            o = Object.create(this.obj, { id: { value : id } } );
            o.retrieve(handleRetrieveObject.bind(this));
        }

        function commonCallback(count, callback) {
            if(count <= 0) {
                callback(undefined, true, this.objs);
            }
        }

        var count = 0;
        _.each(ids, forEachObject.bind(this));
    }
};;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobjectmanagement, scbehaviour */
var scbehaviourmanagement = Object.create(
    dexobjectmanagement,
    {
        endpoints : { value : dexit.scp.device.config.getEndPoints() },
        resource : { value : '/behaviour/' },
        type : { value : 'behaviour' },
        obj : { value : scbehaviour }
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobjectmanagement, sclayout */
var sclayoutmanagement = Object.create(
    dexobjectmanagement,
    {
        endpoints : { value : dexit.scp.device.config.getEndPoints() },
        resource : { value : '/layout/' },
        type : { value : 'layout' },
        obj : { value : sclayout }
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobjectmanagement, smartcontentobject */
var smartcontentobjectmanagement = Object.create(
    dexobjectmanagement,
    {
        endpoints : { value : dexit.scp.device.config.getEndPoints() },
        resource : { value : '/smartcontent/object/' },
        type : { value : 'smartcontentobject' },
        obj : { value : smartcontentobject }
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobjectmanagement, smartcontentcontainer */
var smartcontentcontainermanagement = Object.create(
    dexobjectmanagement,
    {
        endpoints : { value : dexit.scp.device.config.getEndPoints() },
        resource : { value : '/smartcontent/container/' },
        type : { value : 'smartcontentcontainer' },
        obj : { value : smartcontentcontainer }
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobjectmanagement, aeventcontainer */
var scaeventcontainermanagement = Object.create(
    dexobjectmanagement,
    {
        endpoints : { value : dexit.scp.device.config.getEndPoints() },
        resource : { value : '/aevent/container/' },
        type : { value : 'container' },
        obj : { value : aeventcontainer }
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobjectmanagement, aeventobject */
var scaeventobjectmanagement = Object.create(
    dexobjectmanagement,
    {
        endpoints : { value : dexit.scp.device.config.getEndPoints() },
        resource : { value : '/aevent/object/' },
        type : { value : 'object' },
        obj : { value : aeventobject }
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobjectmanagement, scproduction */
var scproductionmanagement = Object.create(
    dexobjectmanagement,
    {
        endpoints : { value : dexit.scp.device.config.getEndPoints() },
        resource : { value : '/decision/production/' },
        type : { value : 'production' },
        obj : { value : scproduction }
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobjectmanagement, scconcept */
var scconceptmanagement = Object.create(
    dexobjectmanagement,
    {
        endpoints : { value : dexit.scp.device.config.getEndPoints() },
        resource : { value : '/intelligence/concept/' },
        type : { value : 'concept' },
        obj : { value : scconcept }
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobjectmanagement, scinformation */
var scinformationmanagement = Object.create(
    dexobjectmanagement,
    {
        endpoints : { value : dexit.scp.device.config.getEndPoints() },
        resource : { value : '/intelligence/information/' },
        type : { value : 'information' },
        obj : { value : scinformation }
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobjectmanagement, scanimationbody */

var scanimationbodymanagement = Object.create(
    dexobjectmanagement,
    {
        endpoints : { value : dexit.scp.device.config.getEndPoints() },
        resource : { value : '/multimediabody/animationbody/' },
        type : { value : 'animationbody' },
        obj : { value : scanimationbody }
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobjectmanagement, scaudiobody */

var scaudiobodymanagement = Object.create(
    dexobjectmanagement,
    {
        endpoints : { value : dexit.scp.device.config.getEndPoints() },
        resource : { value : '/multimediabody/audiobody/' },
        type : { value : 'audiobody' },
        obj : { value : scaudiobody }
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobjectmanagement, scimagebody */
var scimagebodymanagement = Object.create(
    dexobjectmanagement,
    {
        endpoints : { value : dexit.scp.device.config.getEndPoints() },
        resource : { value : '/multimediabody/imagebody/' },
        type : { value : 'imagebody' },
        obj : { value : scimagebody }
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobjectmanagement, sctextbody */
var sctextbodymanagement = Object.create(
    dexobjectmanagement,
    {
        endpoints : { value : dexit.scp.device.config.getEndPoints() },
        resource : { value : '/multimediabody/textbody/' },
        type : { value : 'textbody' },
        obj : { value : sctextbody }
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobjectmanagement, sctextinputbody */
var sctextinputbodymanagement = Object.create(
    dexobjectmanagement,
    {
        endpoints : { value : dexit.scp.device.config.getEndPoints() },
        resource : { value : '/multimediabody/textinputbody/' },
        type : { value : 'textinputbody' },
        obj : { value : sctextinputbody }
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, dexobjectmanagement, scvideobody */
var scvideobodymanagement = Object.create(
    dexobjectmanagement,
    {
        endpoints : { value : dexit.scp.device.config.getEndPoints() },
        resource : { value : '/multimediabody/videobody/' },
        type : { value : 'videobody' },
        obj : { value : scvideobody }
    }
);;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, smartcontent,
    sclayoutmanagement, scaeventcontainermanagement, scaeventobjectmanagement, scbehaviourmanagement, scproductionmanagement,
    scconceptmanagement, scinformationmanagement, scanimationbodymanagement, scaudiobodymanagement, scimagebodymanagement,
    sctextbodymanagement, sctextinputbodymanagement, scvideobodymanagement, smartcontentobjectmanagement, smartcontentcontainermanagement */
//Holds the layout and AEvent Objects
smartcontent.objectmgnt =
    {
        layout : Object.create(sclayoutmanagement),
        aevent :
            {
                object : Object.create(scaeventobjectmanagement),
                container : Object.create(scaeventcontainermanagement)
            }
    };

smartcontent.init = function() {
    //Populate the Smart Content Objects
    this.objectmgnt.layout.populate();
    this.objectmgnt.aevent.object.populate();
    this.objectmgnt.aevent.container.populate();
};

var managedDEXObjects =
    {
        aevent :
            {
                container : Object.create(scaeventcontainermanagement),
                object : Object.create(scaeventobjectmanagement)
            },
        behaviour : Object.create(scbehaviourmanagement),
        decision :
            {
                production : Object.create(scproductionmanagement)
            },
        intelligence :
            {
                concept : Object.create(scconceptmanagement),
                information : Object.create(scinformationmanagement)
            },
        multimediabody :
            {
                animation : Object.create(scanimationbodymanagement),
                audio : Object.create(scaudiobodymanagement),
                image : Object.create(scimagebodymanagement),
                text : Object.create(sctextbodymanagement),
                textinput : Object.create(sctextinputbodymanagement),
                video : Object.create(scvideobodymanagement)
            },
        layout : Object.create(sclayoutmanagement),
        scobject : Object.create(smartcontentobjectmanagement),
        sccontainer : Object.create(smartcontentcontainermanagement)
    };;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, PubSub, SockJS, _ */
dexit.scp.device.management.sm = {};
dexit.scp.device.management.sm.manager = {};
dexit.scp.device.management.sm.manager.currentSchedule = [];
/**
 * Manages the handling of schedule updates
 *
 * @param {boolean} [fetchCurrent=true] fetch smart content currently deployed on the touchpoint
 * @param {function} callback callback(err, done) when finished
 */
dexit.scp.device.management.sm.manager.init = function (fetchCurrent, callback) {
    'use strict';

    if (_.isFunction(fetchCurrent)) {
        callback = fetchCurrent;
        fetchCurrent = true;
    }

    //Make sure there is configuration loaded, otherwise resort to the default config but print a warning message
    if (!dexit.scp.device.config) {
        console.log("Warning...configuration was not loaded.  Loading the default configuration");/*RemoveLogging:skip*/
        dexit.scp.device.loadConfig();
    }


    function getCurrentTouchPoint() {
        var tp = dexit.scp.device.util.getURLParameter('touchpoint');
        if (tp) {
            dexit.scp.device.management.sm.manager.touchpoint = tp;
        } else {
            dexit.scp.device.management.sm.manager.touchpoint = dexit.scp.device.config.getTouchpoint();
        }
    }//END getCurrentTouchPoint
    if (fetchCurrent) {
        getCurrentTouchPoint();
    }
    try {
        //Check to make sure the AEvent Object has an entitykey before trying to authorize
        if( _.isEmpty(dexit.scp.device.config.getEventEntityKey()) ) {

            //there is no key so we need to register!

            callback();

        } else {
            //Authorize the WS

            dexit.scp.device.ebIntegration.authorize({
                auth_key: dexit.scp.device.config.getEventEntityKey()
            });
            //register event handler for receiving event with ebIntegration
            dexit.scp.device.ebIntegration.addHandlerByEventId(dexit.scp.device.config.getUpdateEventId(),dexit.scp.device.management.sm.manager.receiveEventBody);

            if (fetchCurrent) {
                dexit.scp.device.management.sm.manager.retrieveSchedule(callback);
            } else {
                callback(undefined, true);
            }
        }
    } catch (err) {

        callback(err);
    }

};



dexit.scp.device.management.sm.manager.retrieveSchedule = function(callback) {

    function extractSCObjectIds(data) {
        var ids = [];
        if (data && _.isArray(data)) {
            _.each(data,function(element) {
                if (element.scheduledContent && element.scheduledContent.length > 0 ) {
                    _.each(element.scheduledContent, function(scElement) {
                        if (scElement.id){
                            ids.push(scElement.id);
                        }
                    });
                }
            });
        }
        return ids;
    }

    function handleScheduleResponse(err, data) {
        if (err) {

            callback(err);
        }else {
            //prepare/init the smart content objects for each item in the schedule
            var scIds = extractSCObjectIds(data);

            //notifty of schedule update
            if (scIds && scIds.length > 0) {


                dexit.scp.device.management.scmanager.init(undefined,scIds, function(err, done) {
                    if (err) {

                        callback(err);
                    }else {
                        PubSub.publish( 'scd.scheduleUpdateEvent', data );
                        callback(undefined,true);
                    }
                });
            }else {

                callback(undefined,true);
            }


        }
    }

    var tp =dexit.scp.device.management.sm.manager.touchpoint;
    if (!tp) {

    }
    var eDate= new Date();
    var current_date = eDate.toISOString();
    var repo =dexit.scp.device.config.getRepository();

    var headers =
            {
                Accept : 'application/json'
            },
        query=
            {

                date: current_date,
                touchpoint: tp,
                repo: repo
            }
        ,data;
    var resource ='/scheduler/schedule/';
    //new dexit.scp.device.request.XHRRequest('GET', this.property.location, headers, query, data, handleGetDataXHRResponse.bind(this));
    new dexit.scp.device.request.SchedulerXHRRequest('GET', resource, headers, query, data, handleScheduleResponse);


};
/**
 * Receive schedule event
 * @param {object} eventBody
 * @param {object} eventBody.scheduleData - scheduleData
 * @param {string} [eventBody.type=update]  - Type of schedule update can be either type or delete
 */
dexit.scp.device.management.sm.manager.receiveEventBody = function(eventBody) {
    dexit.scp.device.management.sm.manager.receiveEvent(eventBody.scheduleData, eventBody.type);
};



/**
 * Receive schedule event
 * @param {object} data - scheduleData
 * @param {string} [type=update]  - Type of schedule update can be either type or delete
 */
dexit.scp.device.management.sm.manager.receiveEvent = function(data, type) {
    'use strict';
    function extractSCObjectIds(data) {
        var ids = [];
        if (data) {
            if (data.scheduledContent && data.scheduledContent.length > 0 ) {
                _.each(data.scheduledContent, function(scElement) {
                    if (scElement.id){
                        ids.push(scElement.id);
                    }
                });
            }
        }
        return ids;
    }

    if (!data || !data.touchpoints) {
        return;
    }
    var tp = data.touchpoints;
    var repo = data.contentRepo;
    //if the schedule is for the current touchpoint
    if (tp && _.isArray(tp) && dexit.scp.device.management.sm.manager.touchpoint && tp.indexOf(dexit.scp.device.management.sm.manager.touchpoint) !== -1) {


        //only for configured repository
        if (dexit.scp.device.config.getRepository() && repo.toLowerCase() === dexit.scp.device.config.getRepository().toLowerCase()){
            var scheduleUpdateData = data;
            //if this is a delete type
            if (type && type === 'delete') {
                PubSub.publish('scd.scheduleDeleteEvent', scheduleUpdateData);
            }else {
                var scIds = extractSCObjectIds(scheduleUpdateData);
                //initialize SC
                dexit.scp.device.management.scmanager.init(undefined, scIds, function (err, done) {
                    if (err) {

                    } else {
                        PubSub.publish('scd.scheduleUpdateEvent', scheduleUpdateData);
                    }
                });

            }
        }

    }


};
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit */


/**
 *
 * @param {object} args - configuration
 * @param {function} [args.ebIntegrationModule=dexit.EBWebSocketModule] - eb integration implementation
 */
dexit.scp.device.init = function(args) {
    "use strict";
    dexit.scp.device.loadConfig(args);

    //default to WS if not specified
    var ebModule = (args.ebIntegrationModule) ? args.ebIntegrationModule : new dexit.EBWebSocketModule();

    dexit.scp.device.ebIntegration = new dexit.EBIntegration(args);
    dexit.scp.device.ebIntegration.setEbModule(ebModule);

};
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit */
/*jshint -W079 */



//var dexit = dexit || {};
dexit.device = dexit.device || {};
dexit.device.util = dexit.device.util || {};

;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/**
 * Custom Errors
 * @type {Errors}
 */
var errors = (function () {
    /**
     * Validation error
     * @param {string} message
     * @constructor
     */
    function ValidationError(message) {
        this.name ='ValidationError';
        this.message = message || 'Validation issue';
        this.stack = (new Error()).stack;
    }
    ValidationError.prototype = Object.create(Error.prototype);
    ValidationError.prototype.constructor = ValidationError;

    /**
     * Conflict error
     * @param {string} message
     * @constructor
     */
    function ConflictError(message) {
        this.name ='ConflictError';
        this.message = message || 'Conflict issue';
        this.stack = (new Error()).stack;
    }
    ConflictError.prototype = Object.create(Error.prototype);
    ConflictError.prototype.constructor = ConflictError;


    /**
     * Conflict error
     * @param {string} message
     * @constructor
     */
    function NotFoundError(message) {
        this.name ='NotFoundError';
        this.message = message || 'Not found';
        this.stack = (new Error()).stack;
    }
    NotFoundError.prototype = Object.create(Error.prototype);
    NotFoundError.prototype.constructor = NotFoundError;


    return {
        Validation: ValidationError,
        Conflict: ConflictError,
        NotFound: NotFoundError
    };
})();
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, _, async, PubSub */


/**
 * Configuration object for SDK
 * @typedef {Object} SDKConfig
 * @property  {string} [mode=EP] - Deprecated: redundant after removing mode=legacy
 * @property {string} updateEventId
 * @property {string} updateEventKey
 * @property {string} monitorEventId
 * @property {string} monitorEventKey
 * @property {string} tenant
 * @property {string} authToken
 * @property {string} repository
 * @property {string} ebUrl
 * @property {string} sbUrl
 * @property {string} cbUrl
 * @property {string} tpmUrl
 * @property {string} upmUrl
 * @property {string} lpmUrl
 * @property {string} scpUrl
 * @property {string} upmUrl
 * @property {string} epmUrl - Engagement Pattern management endpoint from the engagement platform
 * @property {string} [touchpointId] - touchpoint identifier
 * @property {function} [userResolutionFunction] - function pass that will resolve the user (allows overriding thow the user is resolved
 * @property {function} [channelUrlResolutionFunction] - function pass that will resolve the channel url (allows overriding the channel url is resolved
 * @property {string} epEventId
 * @property {string} epEventKey
 * @property {PresentationPlugin} presentationPlugin
 */


dexit.device.sdk = (function (pubSub,logger,EPHandler) {
    'use strict';
    var initialized = false;
    var config;
    var touchpoint;
    var user;
    var channelUrl;
    var device;
    var noOp = function() {};
    var epHandler;
    var executionManager;
    var epParser;
    var currentExecutionPattern;

    var currentExecutionPatterns= [];
    var presToken = null;

    var parentRef = null;

    var _userResolution;
    var _channelUrlResolution;


    var sdk = this;

    pubSub = pubSub || PubSub;
    logger = logger || console;


    function loadEngagementPatternByEvent(data, callback) {
        //TODO: improve how this loads/unloads
        callback = callback || noOp;
        epHandler.loadEngagementPatternByEvent(data,function(err, ep) {
            if (err) {
                logger.log('problem loading engagement pattern');
                return callback(err);
            }
            var result = epParser.prepare(ep);
            if (result && result instanceof Error) {
                logger.warn('Could not parse engagement pattern due to error: %s', result.message);
                return callback(result);
            }
            currentExecutionPattern = result;

            if (data.overrideContainer) {
                currentExecutionPattern.overrideContainer = data.overrideContainer;
            }

            executionManager.initExecutionPattern(currentExecutionPattern,function(err){
                if (err) {
                    logger.error('could not execute pattern:'+( (err && err.message) ? err.message : err ));
                    callback(err);
                }else {
                    executionManager.start(currentExecutionPattern,function(err){
                        if (err) {

                        }

                        executionManager.stop(currentExecutionPattern);
                        epHandler.unloadEngagementPattern(currentExecutionPattern.id,callback);
                    });
                }

            });

        });
    }



    /**
     *
     * Loads the specified Engagement Pattern with optional overloads
     * @param {object} params
     * @param {string} params.epId - ep Id
     * @param {string} [params.overrideContainer] - optional parameter
     * @param {boolean} [params.resume=false] - allows resuming execution of the specified pattern
     * @param callback
     */
    function loadEngagementPatternParams(params, callback) {
        //epId, overrideContainer,
        var container = null;

        var resume = (params.resume ? true : false);
        if (params.overrideContainer) {
            container = params.overrideContainer;
        }


        callback = callback || noOp;


        if (resume) {
            executionManager.resume(params.epId, container, function (err) {
                if (err) {
                    console.log('problem resuming');
                }
                executionManager.stop(currentExecutionPattern);
                epHandler.unloadEngagementPattern(params.epId, callback);
            });
        }else {

            epHandler.loadEngagementPatternById(params.epId, function (err, ep) {
                if (err) {
                    return callback(err);
                }
                var result = epParser.prepare(ep);
                if (result && result instanceof Error) {
                    logger.warn('Could not parse engagement pattern due to error: %s', result.message);
                    callback(result);
                    return;
                }
                currentExecutionPattern = result;

                if (container) {
                    currentExecutionPattern.overrideContainer = container;
                }

                //if resume === true then load all "suspended" elements

                executionManager.initExecutionPattern(currentExecutionPattern, function (err) {
                    if (err) {

                        callback(err);
                    } else {
                        executionManager.start(currentExecutionPattern, function (err) {
                            if (err) {

                            }

                            executionManager.stop(currentExecutionPattern);
                            epHandler.unloadEngagementPattern(params.epId, callback);
                        });
                    }
                });

            });
        }
    }



    /**
     *
     * @param {string} epId - ep Id
     * @param {string} [overrideContainer] optional parameter
     * @param callback
     */
    function loadEngagementPattern(epId, overrideContainer, callback) {

        var container = null;

        if (arguments.length === 2 && _.isFunction(overrideContainer)) {
            callback = overrideContainer;

        } else {
            container = overrideContainer;
        }


        callback = callback || noOp;
        epHandler.loadEngagementPatternById(epId,function(err, ep) {
            if (err) {
                return callback(err);
            }
            var result = epParser.prepare(ep);
            if (result && result instanceof Error) {
                logger.warn('Could not parse engagement pattern due to error: %s', result.message);
                callback(result);
                return;
            }


            //FIXME: so currentExecutionPattern of 1 is limiting the concurrent execution here (execution manager was updated to allow this)

            if (container) {
                result.overrideContainer = container;
            }


            currentExecutionPatterns.push(result);

            //currentExecutionPattern = result;



            executionManager.initExecutionPattern(result,function(err){
                if (err) {

                    callback(err);
                }else {
                    executionManager.start(result,function(err){
                        if (err) {

                        }
                        //FIX
                        //for epId with a hyphen, then get the epId from result
                        var singleEPId = result.id;

                        executionManager.stop(result);
                        currentExecutionPatterns = _.reject(currentExecutionPatterns, {id: singleEPId});
                        epHandler.unloadEngagementPattern(singleEPId,callback);
                    });
                }

            });


        });
    }

    function unloadEngagementPatterns(callback) {

        callback = callback || noOp;
        var executions = executionManager.executions || [];

        async.each(executions, function(val, cb) {

            if (!val || !val.id){
                return cb();//skip
            }

            epHandler.unloadEngagementPattern(val.id, function(err) {
                if (err) {
                    //skip
                }
                executionManager.stop(val);
                setTimeout(function(){
                    cb();
                },100);

            })

        }, function (err) {
            setTimeout(function(){
                callback();
            },100);
        })




    }


    function unloadEngagementPattern(epId,callback) {

        callback = callback || noOp;
        currentExecutionPattern = null;
        epHandler.unloadEngagementPattern(epId,function(err) {
            if (err) {
                return callback(err);
            }
            executionManager.stop({id:epId});
            setTimeout(function(){
                callback();
            },100);

        });

    }


    /**
     * Initializes the SDK
     * @param options {SDKConfig} configuration object
     * @param callback {function} err
     */
    function initialize(options, callback) {
        callback = callback || noOp;


        if (initialized) {
            return callback(new Error('SDK already initialized'));
        }

        //set configuration
        options.mode = options.mode || 'EP';
        config = options;

        //set not to load user profile from query string
        config.skipLoadFromUrl = true;

        _channelUrlResolution = options.channelUrlResolutionFunction || dexit.device.util.channelUrlResolution;
        _userResolution = options.userResolutionFunction || dexit.device.util.userResolution;


        //set configuration for device registration
        dexit.scp.device.registration.loadConfiguration(options);

        //set configuration for device/touchpoint resolution
        dexit.scp.device.resolution.loadConfiguration(options);

        //make sure ep is initialized on the device, call init later
        dexit.ep.module = new dexit.EP(options);

        //configure sb-web
        dexit.rtsc.sb.manager.setConfig(options);

        //configure scp-device
        dexit.scp.device.init(options);
        //configure xKB plugin manager
        //FIXME dexit.device.sdk.xKbPluginManager = new dexit.device.XKbPluginManager(options);


        //initialize engagement pattern parser
        epParser = new dexit.EPParser(['waitTime']);


        //don't try to keep loading a new object everytime it is called
        if (!executionManager) {
            executionManager = new dexit.ExecutionManager(options);
        }

        //call to resolve the touchpoint
        _resolveTouchpoint(function (err, result) {
            if (err) {
                return callback(new Error('Could not resolve the touchpoint'));
            }
            //note touchpoint is also stored under dexit.scp.device.resolution.touchpoint
            touchpoint = result;
            //set touchpointId
            options.touchpointId = touchpoint.touchpoint;
            epHandler = EPHandler || new dexit.EPHandler(options);

            //initialize execution manager
            executionManager.init(touchpoint);


            //bind event for ep event to epHandler
            if (options.epEventKey && options.epEventId && dexit.scp.device.ebIntegration) {

                var authParams = {
                    authKey: options.epEventKey
                };

                dexit.scp.device.ebIntegration.authorize(authParams);
                dexit.scp.device.ebIntegration.addHandlerByEventId(options.epEventId, dexit.device.sdk.loadEngagementPatternByEvent);
            }else {
                logger.log('ep on-demand not configured');
            }
            //initialize presentation manager
            var params = {
                touchpoint:getTouchpoint()
            };
            if (dexit.device.sdk.getUser()) {
                params.user = dexit.device.sdk.getUser();
            }
            dexit.device.sdk.presentationMng = new dexit.PresentationMng(config,params,config.presentationPlugin);

            initialized = true;
            callback();
        });
    }

    /**
     * Sets the sdk-modules to use the current access token
     * @param {string} token - access token
     */
    function setAuthToken(token) {
        dexit.scp.device.registration.config.setAuthToken(token);
        dexit.scp.device.resolution.config.setAuthToken(token);
        dexit.ep.config.setAuthToken(token);
        dexit.scp.device.config.setToken(token);
        dexit.rtsc.sb.manager.setAuthToken(token);
    }

    /**
     * Returns the current user (or nothing if no user is set)
     * @returns {string|undefined}
     */
    function getUser() {
        return user;
    }

    /**
     * Returns the current touchpoint (or nothing if no user is set)
     * @returns {string|undefined}
     */
    function getTouchpoint() {
        return touchpoint;
    }


    function _resolveTouchpoint(callback) {

        async.series({
                register: function (cb) {
                    dexit.scp.device.registration.registery.register(function (error, result) {
                        if (error) {

                            return cb(error);
                        }
                        device = result;
                        //resolve user id
                        user = _userResolution();
                        //resolve channelUrl
                        channelUrl = _channelUrlResolution();
                        cb();

                    });
                },
                resolveTPInstance: function (cb) {
                    //resolve the touchpoint instance details
                    dexit.scp.device.resolution.tpr.resolve(channelUrl, function (err, result) {
                        if (err) {

                            return cb(err);
                        }
                        touchpoint = result;
                        //Note: still need to set touchpoint identifier for sc-platform-device
                        dexit.scp.device.config.setTouchpoint(touchpoint.touchpoint);
                        cb();
                    });
                },
                loadUser: function (cb) {
                    if (!user) {
                        return cb();
                    }
                    dexit.ep.module.setUserId(user, function (err) {
                        if (err) {

                        }
                        cb();
                    });
                }
            },
            function (error) {
                if (error) {
                    pubSub.publish('SDK Initialization ERROR', error);
                    callback(error);
                } else {
                    callback(null, touchpoint);
                }
            });
    }



    /**
     * Unload function for the SDK.
     * Sets the SDK to uninitialized
     */
    function unload(cb) {
        cb = cb || noOp;

        if (executionManager) {
            var executions = executionManager.executions;
            _.each(executions, function(execution) {
                executionManager.unload(execution);
            });

        }
        debugger;
        executionManager.stateStorage.stopProcessing();

        if (epHandler) {
            //no need to run unload
            // if (epHandler.getStatus() === epHandler.AVAILABLE_STATUS.IDLE) {
            //     initialized = false;
            //     return cb();
            // }
            unloadEngagementPatterns(function (err) {
                initialized = false;
                cb(err);
            });

        }else {
            cb();
        }
    }






    function getEpHandler() {
        return epHandler;
    }

    function getExecutionManager() {
        //TODO: refactor without need to expose this
        return executionManager;
    }
    function setParentRef(val) {
        parentRef = val;
    }

    function getParentRef() {
        return parentRef;
    }

    return {
        getParentRef: getParentRef,
        setParentRef: setParentRef,
        initialize: initialize,
        setAuthToken: setAuthToken,
        getUser: getUser,
        getTouchpoint: getTouchpoint,
        unload: unload,
        loadEngagementPattern: loadEngagementPattern,
        unloadEngagementPattern: unloadEngagementPattern,
        getEpHandler: getEpHandler,
        getExecutionManager: getExecutionManager,
        loadEngagementPatternByEvent: loadEngagementPatternByEvent,
        unloadEngagementPatterns: unloadEngagementPatterns,
        loadEngagementPatternParams: loadEngagementPatternParams
    };

})();
dexit.device.sdk.xkb = dexit.device.sdk.xkb || {};






;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, PubSub */

/**
 * Parses the specified query string
 * @param {string} qStr = query string (after the ? in the url)
 * @returns {object}
 */
dexit.device.util.parseQueryString = function(qStr) {
    var query = {};
    var params = qStr.split('&');
    for (var idx in params) {

        var keyvalue = params[idx].split('=');
        query[decodeURIComponent(keyvalue[0])] = decodeURIComponent(keyvalue[1]);
    }
    return query;
};

/**
 * Attempts to resolve the channel url
 * @param {object} [win] - can pass in window override (useful for testing)
 * @returns {string}
 */
dexit.device.util.channelUrlResolution = function(win) {
    var glob = win || window;
    // check player URL query string for parameter which overrides URL
    var params;
    var query = glob.location.href.split('?')[1];
    if (query) {
        params = dexit.device.util.parseQueryString(query);
        if (params.overrideChannelUrl) {
            return decodeURIComponent(params.overrideChannelUrl);
        }
    }

    // if URL was injected via configuration, use that
    if (dexit.scp && dexit.scp.scpm && dexit.scp.scpm.config && dexit.scp.scpm.config.instanceUrl) {
        return dexit.scp.scpm.config.instanceUrl;
    }

    //on refresh document.referrer is not set, also need to check if referrer is /login on redirect
    if (!document.referrer || document.referrer.indexOf('/login') !== -1) {
        return glob.location.href;
    }

    // otherwise default to referrer URL
    return document.referrer;
};

/**
 * Returns the user id (if specified) from the query string
 * @param {object} [win] - can pass in window override (useful for testing)
 * @returns {*|string}
 */
dexit.device.util.userResolution = function(win){
    var glob = win || window;
    var query = glob.location.href.split('?')[1];
    if (query) {
        var queryParams = dexit.device.util.parseQueryString(query);
        if (queryParams.user) {
            return queryParams.user;
        }
    }
};


/**
 * Returns if the string ends with the supplied search string
 * Note: had issue with polyfill so using utility {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith}
 * @param {string} subjectString - the string to each
 * @param {string} searchString - what to check
 * @param {number} [position=subjectString.length] - max position
 * @returns {boolean}
 */
dexit.device.util.endsWith = function(subjectString,searchString, position) {
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
};


/**
 * Returns a semi-random uuid-like number (does not follow the RFC)
 * @returns {string}
 */
dexit.device.util.guid = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};


/**
 * Create a timer and fire the specified event
 * @param {number} time - time in ms
 * @param {object} eventDef
 * @param {string} eventDef.name
 * @param {object} eventDef.params
 */
dexit.device.util.createTimer = function (time, eventDef) {
    setTimeout(function () {
        PubSub.publish(eventDef.name,eventDef.params);
    }, time);
};;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, PubSub */

dexit.device.XKbPluginManager = function(options) {
    'use strict';

    function setupListener(e) {

        try {
            var data = JSON.parse(e.data);
            self.receiveExternal(data, e.source, e.origin);
        } catch(ex) {

        }
    }



    var self = this;
    //default to 1.5 second wait
    self.getDataWaitTime = ( (options && options.getDataWaitTime) ? options.getDataWaitTime : 1500);
    self.plugins = {};
    self.messages = {};
    //TODO: look at how to deregister (removeEventListener)
    window.addEventListener('message', setupListener, false );
};

/**
 * Registers a plugin that is loaded within another window (when player is embedded in another site)
 * @param plugin {object} The name of the plugin (unique)
 * @param origin {string} The origin of the request ( {protocol}://{host}:{port} )
 * @param source {Window} The reference to the other window
 * @returns {boolean}
 */
dexit.device.XKbPluginManager.prototype.registerExternalPlugin = function(plugin, origin, source) {
    var self = this;
    if (!plugin) {
        return false;
    } else {
        //capture origin
        plugin.origin = origin;
        plugin.source = source;
        //capture iframe it came from
        self.plugins[plugin.name] = plugin;
        PubSub.publish('dexit.sdk.xkb.plugins', {action: 'added', pluginName: plugin.name});
        return true;
    }
};

/**
 * Remove plugin
 * @param name {string} unique name
 * @returns {boolean}
 */
dexit.device.XKbPluginManager.prototype.removeExternalPlugin = function(name) {
    var self = this;

    if (self.plugins && self.plugins[name]) {
        delete self.plugins[name];
    }

    PubSub.publish('dexit.sdk.xkb.plugins', {action: 'removed', pluginName: name});
    return true;

};

dexit.device.XKbPluginManager.prototype._getDataFromPlugin = function(pluginName, callback) {
    var self = this;
    var plugin = self.plugins[pluginName];

    //make sure it exists first
    if (plugin) {
        var messageId = dexit.device.util.guid();
        var data = {type: 'dexit.sdk.xkb.plugins.extractData', messageId:messageId, name: pluginName };
        var iFrame = plugin.source;
        var origin = plugin.origin;
        self.messages[messageId] =  {name: pluginName, response:null};
        iFrame.postMessage(JSON.stringify(data), origin);

        //wait for response for up to 1.5 seconds or configured time
        setTimeout(function(){
            var msg = {};
            if (self.messages[messageId].response) {
                msg = self.messages[messageId].response;
                //remove messageId
                delete self.messages[messageId];
            }
            callback(null,msg);
        }, self.getDataWaitTime);

    }
};

/**
 * Receives a string from the external listener that is a JSON string
 * @param {object} msg - message (once parsed will be a json object with type and data fields)
 * @param {string} [msg.type] - if specified, can be 'dexit.sdk.xkb.plugins.registration'
 * @param {object} msg.data - Data to pass in (if registration then data is the plugin definition)
 * @param {object} msg.messageId - Message identifier sent that can be used for a reply to correlate a response
 * @param {string} origin - origin of the request reference
 * @param {string} source - source of the request reference
 *
 */
dexit.device.XKbPluginManager.prototype.receiveExternal = function(msg, origin, source) {
    var self = this;
    if (!msg) {
        return;
    }
    var data = msg.data;
    if (msg.type === 'dexit.sdk.xkb.plugins.registration') {
        self.registerExternalPlugin(data, origin, source);
    } else if (msg.type === 'dexit.sdk.xkb.plugins.removal' && data && data.name) {
        self.removeExternalPlugin(data.name);
    } else if (msg.type === 'dexit.sdk.xkb.plugins.extractDataResponse' && msg.messageId) {
        //TODO: revise this later when looking at data collection

        //look up plugin my messageId and and add response
        if (self.messages[msg.messageId]) {
            var message = self.messages[msg.messageId];
            //set to message log so xkb collector can pick it up
            message.response = data;
        }

    }
};





;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global, dexit, PubSub, _ */

/**
 * @param {object} config - configuration
 * @param {object} config.epmUrl - Engagement Pattern Management URL
 * @param {string} config.touchpointId - The current touchpoint Identifier
 * @param {object} [dexRequestUtil=dexit.scp.device.request] - HTTP request utility
 * @param {object} [pubSub=Pubsub] - PubSubJS library reference
 * @param {object} [logger=console] - logger object to call
 * @class
 */
dexit.EPHandler = function(config, dexRequestUtil, pubSub, logger){
    'use strict';

    //Private variables and functions
    logger = logger || window.console;
    /**
     * Enum for the status
     * @readonly
     * @enum {string}
     */
    var STATUS_OBJ = {
        IDLE: 'idle',
        LOADING: 'loading pattern',
        LOADED: 'pattern loaded',
        ERROR: 'error',
        UNLOADING: 'unloading pattern'
    };
    //events:  on status change,
    var EVENT_NAME= 'dexit.ep.handler.update';
    var status = STATUS_OBJ.IDLE;
    var noOp = function(){};
    var currentPattern;
    var loadedPatterns = [];

    /**
     * Initialization
     */
    if (!config || !config.epmUrl) {
        logger.log('Configuration was not loaded'); /*RemoveLogging:skip*/
        throw new Error('Configuration must be specified');
    }

    if (!config.touchpointId) {
        logger.log('No touchpoint was loaded'); /*RemoveLogging:skip*/
        throw new Error('Touchpoint must be specified');
    }
    var touchpointId = config.touchpointId;
    var epmURL = config.epmUrl;

    pubSub = pubSub || window.PubSub;
    if (!pubSub) {
        throw new Error('PubSubJS is required');
    }

    dexRequestUtil = dexRequestUtil || dexit.scp.device.request;


    /**
     * Sets the status and publishes any relevant information with it (optional)
     * @param {string} value - status value {@link }
     */
    function setStatus(value, data) {

        //skip if setting the same status or no value is passed
        if (!value || status === value) {
            return;
        }

        status = value;
        var msg  = {
            status: status
        };
        if (data) {
            msg.data = data;
        }
        pubSub.publish(EVENT_NAME, msg);
    }


    /**
     * This callback returns no value on successful retrieval or error
     * @callback EPHandler~RetrieveEngagementPatternCallback
     * @param {Error} [error] - If an error happens then it is returned
     */

    /**
     * Retrieves the engagement pattern from the service based on id
     * @param {string} engagementPatternId - engagement pattern identifier
     * @param {string} tp - touchpoint identifier
     * @param {EPHandler~RetrieveEngagementPatternCallback} callback
     */
    function retrieveEngagementPattern(engagementPatternId, tp, callback) {

        if (!engagementPatternId) {
            return callback(new Error('engagementPatternId is required'));
        }

        var revId = 'latest';
        if (engagementPatternId.indexOf('-') !== -1) {
            revId = engagementPatternId.split('-')[1];
            engagementPatternId = engagementPatternId.split('-')[0];
        }



        var current_date = new Date().toISOString(),
            resource ='/engagement-pattern/' + encodeURIComponent(engagementPatternId),
            headers =
                {
                    Accept : 'application/json'
                },
            query=
                {
                    date: current_date,
                    touchpoint: tp,
                    revision:revId
                },
            numRetries = 0,
            maxRetries= 3,
            url_base = epmURL;
        dexRequestUtil.XHRRequestWithRetry(url_base,'GET', resource, headers, query, null, numRetries, maxRetries, callback);
    }


    //END: Private variables and functions

    // public functions
    /**
     * Enum for the status
     * @readonly
     * @enum {string}
     * {@link STATUS_OBJ}
     */
    this.AVAILABLE_STATUS = STATUS_OBJ;

    /**
     * Retrieves the current status
     * @returns {STATUS_OBJ|string}
     */
    this.getStatus = function() {
        return status;
    };

    /**
     * Returns the current pattern loaded
     * @returns {*}
     */
    this.getCurrentPattern = function() {
        return currentPattern;
    };




    /**
     * This callback returns no value on successful load or an error
     * @callback EPHandler~LoadEngagementPatternCallback
     * @param {Error} [error] - If an error happens then it is returned
     */


    /**
     * Loads the specified engagement pattern
     * @param {object} engagementPattern - engagement pattern JSON object
     * @param {EPHandler~LoadEngagementPatternCallback} callback
     */
    function loadEngagementPatternData (engagementPattern, callback) {
        //check that ep is not already loaded
        var found = _.find(loadedPatterns, {id:engagementPattern.id});
        if (found) {
            return callback(new Error('Pattern is already loaded'));
        }

        //engagement pattern is not for the specified touchpoint
        var tpIndex = engagementPattern.touchpoints.indexOf(touchpointId);
        if (engagementPattern && engagementPattern.active && engagementPattern.touchpoints && tpIndex !== -1 ) {
            //successful
            //filter out other touchpoints as their layout is not relevant here
            if (engagementPattern.epSchemaVersion && engagementPattern.epSchemaVersion === 2) {
                var newTp = _.find(engagementPattern.tp, function (value) {
                    return (value.touchpoint === touchpointId); //filter out others
                });
                engagementPattern.currentTouchpoint = newTp;

            }

            loadedPatterns.push(engagementPattern);
            //currentPattern = engagementPattern;
            setStatus(STATUS_OBJ.LOADED, engagementPattern);
            callback(null,engagementPattern);
        } else {
            var errTpMatch = new Error('engagement pattern must be valid, active and the current touchpoint must be specified in the engagement pattern');
            logger.log(errTpMatch.message); /*RemoveLogging:skip*/
            setStatus(STATUS_OBJ.ERROR, errTpMatch);
            callback(errTpMatch);
        }
    }


    /**
     * Loads the specified engagement pattern
     * @param {object} engagementPattern - engagement pattern JSON object
     * @param {EPHandler~LoadEngagementPatternCallback} callback
     * @returns {*}
     */
    this.loadEngagementPattern = function(engagementPattern, callback) {
        callback = callback || noOp;

        // if (status !== STATUS_OBJ.IDLE) {
        //     return callback(new Error('Cannot load due to loaded pattern or a pattern is already loading'));
        // }


        setStatus(STATUS_OBJ.LOADING);
        loadEngagementPatternData(engagementPattern,callback);
    };


    /**
     * Loads the engagement pattern by its identifier
     * @param {string} engagementPatternId - engagement pattern identifier
     * @param {EPHandler~LoadEngagementPatternCallback} callback
     */
    this.loadEngagementPatternById = function(engagementPatternId, callback) {
        var self = this;
        callback = callback || noOp;
        // if (status !== STATUS_OBJ.IDLE) {
        //     return callback(new Error('Cannot load due to loaded pattern or a pattern is already loading'));
        // }

        setStatus(STATUS_OBJ.LOADING);
        //retrieve patterh
        retrieveEngagementPattern(engagementPatternId, touchpointId, function(err, engagementPattern){
            if (err) {
                logger.log(err.message);
                setStatus(STATUS_OBJ.ERROR, err);
                return callback(err);
            }
            //format pattern into expected format
            var pattern = engagementPattern.pattern;
            pattern.active = engagementPattern.isActive;
            pattern.id = engagementPattern.id;

            loadEngagementPatternData(pattern,callback);
        });
    };


    /**
     * Callback that fires after a request to unload current engagement pattern
     * @callback {EPHandler~UnLoadEngagementPatternCallback} callback
     * @param {Error} [error] - if an error occurs (ie. no pattern is currently loaded)
     */

    /**
     * Unloads the currently engagement Pattern
     * @param {EPHandler~UnLoadEngagementPatternCallback} callback
     */
    this.unloadEngagementPattern = function(epId, callback) {
        var self = this;
        callback = callback || noOp;
        if (!epId) {
            //unloading all
            _.each(loadedPatterns, function(val) {
                setStatus(STATUS_OBJ.UNLOADING,val.id);
            });
            loadedPatterns = [];
            return callback();
        }


        // if (status === STATUS_OBJ.UNLOADING) {
        //     logger.warn('pattern is already unloading');
        //     return callback(new Error('pattern is already unloading'));
        // }
        //

        // if (status === STATUS_OBJ.LOADING) {
        //     logger.warn('Currently loading a pattern');
        //     return callback(new Error('Currently loading a pattern'));
        // }


        var foundIndex = _.findIndex(loadedPatterns, function(val){
            return (val.id === epId);
        });

        //if status is idle then no need to unload, or no pattern is loaded
        if (status === STATUS_OBJ.IDLE || loadedPatterns.length < 1 || foundIndex === -1) {
            logger.warn('pattern is not currently loaded');
            return callback(new Error('pattern is not currently loaded'));
        }

        //unload
        setStatus(STATUS_OBJ.UNLOADING,epId);
        //Note: possible further expansion here in the future on listening for unload or initiating to save current state
        currentPattern = null;

        loadedPatterns.splice(foundIndex,1);

        //set idle
        if (loadedPatterns.length < 1) {
            setStatus(STATUS_OBJ.IDLE);
        }
        callback();
    };

    /**
     * Loads engagement pattern by event received.  Makes sure to unload and load
     * @param {object} eventBody
     * @param {object} eventBody.engagementPattern - enagagement pattern
     * @param callback
     */
    this.loadEngagementPatternByEvent = function(eventBody, callback) {
        var self = this;
        callback = callback || noOp;

        if (!eventBody || !eventBody.engagementPattern || !eventBody.engagementPattern.pattern) {
            logger.warn('did not received a pattern to load');
            return callback(new Error('did not received a pattern to load'));
        }

        var engagementPattern = eventBody.engagementPattern;
        //format pattern into expected format for loadEngagementPatternData
        var pattern = engagementPattern.pattern;
        pattern.active = engagementPattern.isActive; //should always be true for dispatched engagement patterns
        pattern.id = engagementPattern.id;
        var scId = eventBody.scId;
        var repo = eventBody.repo;
        var tenant = eventBody.tenant;

        //filter touchpoint out on event
        if (pattern.active && pattern.touchpoints && pattern.touchpoints.indexOf(touchpointId) !== -1 ) {
            //make sure no other pattern running now
            // self.unloadEngagementPattern(function (err) {
            //     if (err) {
            //         logger.warn('error:'+err);
            //     }
            loadEngagementPatternData(pattern,callback);
            // });
        } else {
            logger.log('touchpoint does not match');
            callback(new Error('touchpoint does not match'));
        }
    };
    //END: public functions

};
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, errors, _ */
//TODO: migrate this code to a shared spot between device and cloud

/**
 *
 * @param {object} params - constructor paremeters
 * @param {Date} params.start - start time
 * @param {Date} params.end - end time
 * @param {Graph} params.graph - initialized graph using graph.js
 * @param {string[]} params.scReferences - array of SC element this execution graph is for
 * @param {object} [params.parameters] - any additional parameters to send
 * @param {string[]} [params.layout] - layout(s) for pattern
 * @param {string} [params.mainScId] - workaround to override the sc identifier
 * @class ExecutionGraph
 */
dexit.ExecutionGraph = function(params) {

    if (!params) {
        throw new errors.Validation('params is required');
    }

    this.endConfiguration = params.endConfiguration;
    this.id = params.id;
    this.start = params.start;
    this.end = params.end;
    this.graph = params.graph;
    this.scReferences = params.scReferences;
    this.parameters = params.parameters;
    this.layout = params.layout;
    this.mainScId = params.mainScId;
    this.time = Date.now();
};


/**
 * Show a list of all possible paths across nodes (if path is 0, then the pattern will not execute)
 * @returns {array[string[]]} - Array of array of strings of node identifiers in the graph
 */
dexit.ExecutionGraph.prototype.paths = function() {
    var g =this.graph;
    var paths =[];
    // iterates over all paths between start and end
    for (var it = g.paths('start','end'), kv; !(kv = it.next()).done;) {
        var path = kv.value;
        paths.push(path);
    }
    return paths;
};

/**
 * Returns the information about the next vertex.
 * This includes the properties of the edge that connects to the vertex and the id and properties of the vertex
 * @typedef VertexInfo
 * @type {object} [edge] - The edge values (if any) connecting the vertex
 * @type {object} [vertex] - vertex identifier and value (if any)
 * @type {string} vertex.id - vertex identifier
 * @type {object} vertex.value - vertex value (if any)
 */


/**
 * Details of the id of the from value passed in
 * @typedef {object} ExecutionGraph~PossiblePaths
 * @property {string} id - the identifier
 * @property {object} value - the value
 * @property {VertexInfo[]} flow - vertices for edges of type flow
 * @property {VertexInfo[]} link - vertices for edges of type link
 */

/**
 * Returns a list of vertices (and the edge to them) from the current vertex  (organized buy the connection type: flow or
 * @param {string} from - name of the vertex
 * @returns {ExecutionGraph~PossiblePaths}
 */
dexit.ExecutionGraph.prototype.verticesFrom = function(from) {

    var toReturn = {flow:[], link:[]};

    if (!this.graph.hasVertex(from)) {
        return new errors.NotFound('vertex:'+from + ' does not exist');
    }

    //add the value of the current node as a reference
    var fromValue = this.graph.vertexValue(from);
    toReturn.from = { id: from, value: fromValue};



    var items = [];

    for (var it = this.graph.verticesFrom(from), kv; !(kv = it.next()).done;) {
        var to          = kv.value[0],
            vertexValue = kv.value[1],
            edgeValue   = kv.value[2];
        items.push({edge:edgeValue, vertex:{id:to, value:vertexValue}});
    }

    //organize by link type
    toReturn.link = _.filter(items,function(item) {
        return (item.edge && item.edge.type && item.edge.type === 'link');
    });
    toReturn.flow = _.filter(items,function(item) {
        return (item.edge && item.edge.type && item.edge.type === 'flow');
    });


    return toReturn;


};


/**
 * Returns a list of vertices (and the edge to them) connected to the current vertex through an edge (organized buy the connection type: flow or link)
 * @param {string} to - name of the vertex
 * @returns {ExecutionGraph~PossiblePaths}
 */
dexit.ExecutionGraph.prototype.verticesTo = function (to) {

    var toReturn = {flow:[], link:[]};

    if (!this.graph.hasVertex(to)) {
        return new errors.NotFound('vertex:'+to + ' does not exist');
    }

    //add the value of the current node as a reference
    var toValue = this.graph.vertexValue(to);
    toReturn.to = { id: to, value: toValue};

    var items = [];

    for (var it = this.graph.verticesTo(to), kv; !(kv = it.next()).done;) {
        var toNow       = kv.value[0],
            vertexValue = kv.value[1],
            edgeValue   = kv.value[2];
        items.push({edge:edgeValue, vertex:{id:toNow, value:vertexValue}});
    }

    //organize by link type
    toReturn.link = _.filter(items,function(item) {
        return (item.edge && item.edge.type && item.edge.type === 'link');
    });
    toReturn.flow = _.filter(items,function(item) {
        return (item.edge && item.edge.type && item.edge.type === 'flow');
    });


    return toReturn;


};
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, moment, errors, _, Graph*/
//TODO: migrate this code to a shared spot between device and cloud

/**
 * Takes a Engagement Pattern and converts it into a Executable Graph
 * @param {object} flags - possible flags to configure how the engagement pattern should be converted for execution
 * @param {string} [flags.multipleProductionToNode] - if set then support having two production rules (for true/false) in one node
 * @constructor
 */
dexit.EPParser = function(flags){
    this.state = 'unintialized';
    /**
     * Flags for parsing
     */
    this.flags = flags || [];
};



/**
 * Build Node reference objet
 * @param {string} type - element type ('intelligence'|'multimedia'|'decision'|'behaviour')
 * @param {string} typeId - specific reference to sc element
 * @param {object} [args] args - arguments that can be specified to the element ahead of execution
 * @param {string} [regionRef] - region reference for layout  (not required for decision)
 * @param {string} [layoutRef] - layout reference for element (not required for decision)
 * @param {string|object} [presentationRef] - presentation reference for element (not required for decision)
 * @param {object} [inEvent] - inEvent transition
 * @param {string} [description]
 * @param {object} [presentationStyle={}] - presentation reference for element
 * @param {object} [presentationRefArgs={}] - additional presentation parameters based presentationRef
 * @param {string} [elementTag=''] - if element is tagged
 * @param {object} [eventListener]
 * @returns {SCNodeReference}
 */
function buildNodeReference(type,typeId,args,regionRef,layoutRef,presentationRef,inEvent, description, presentationStyle, presentationRefArgs, elementTag,eventListener) {
    //parse out:  ie. type_id="sc:85fd8c80-9d2c-4f70-aef2-0c25419db5c0:behaviour:1dfd8c80-9d2c-4f70-aef2-0c25419db5aa",
    var items = typeId.split(':');
    var scId = items[1];
    var typeRef = items[2];
    var theTypeId = items[3];
    var data = {
        scId: scId,
        typeRef: typeRef,
        typeId: theTypeId,
        type: type,
        description:description || '',
        args: args
    };

    if (regionRef) {
        data.regionRef = regionRef;
    }

    if (layoutRef) {
        data.layoutRef = layoutRef;
    }

    if (presentationRef) {
        data.presentationRef = presentationRef;
    }
    if (inEvent && inEvent.events && inEvent.events.length > 0) {
        data.inEvent = inEvent;
    }else {
        data.inEvent = {
            value: true
        };
    }
    if (eventListener && !_.isEmpty(eventListener)) {
        data.eventListener = eventListener;
    }
    if (presentationStyle && !_.isEmpty(presentationStyle)) {
        data.presentationStyle = presentationStyle;
    }
    if (presentationRefArgs && !_.isEmpty(presentationRefArgs)) {
        data.presentationRefArgs = presentationRefArgs;
    }
    if (elementTag) {
        data.tag = elementTag;
    }

    return data;
}

/**
 * Create properties for the connection
 * @param {string} type - connection type
 * @param {object} [properties={}]
 * @returns {{type: string, properties: object}}
 */
function createPropertiesForConnection(type,properties) {
    return {
        type: type,
        properties:properties || {}
    };
}

/**
 *
 * @param [string[]] arr - Array of SC ids
 * @param {SCNodeReference} nodeRef
 */
function addSCReference(arr, nodeRef) {
    var scId = nodeRef.scId;
    if (arr.indexOf(scId) === -1) {
        arr.push(scId);
    }
}

/**
 * @type ExecutionGraph
 * @param {object} graph - Execution Graph
 * @param {string[]} scReferences - Links to the SC ids
 * @param {Date} start - start time
 * @param {Date} [end] - end time (if none then never)
 * @param {object[]} [parameters] - additional parameters for execution
 */

/**
 * @type {object} SCNodeReference
 * @param {string} type - Type of SC pattern elements (multimedia,decision,
 * @param {string} typeRef - Name of sc reference (may not be the same as type
 * @param {string} scId - Smart Content Identifer
 * @param {string} typeId - Identifier of sc element reference
 * @param {string} [regionRef] = region reference for layout  (not for decision)
 * @param {string} [layoutRef] = layout reference for element (not for decision)
 * @param {string|object} [presentationRef] - presentation reference for element (not for decision)
 * @param {object} [inEvent] - the event(s) that need to happen for this node to execute
 * @param {object} [inEvent.value=true] - if no events are specified then value is always true, value being true means it will execute on transition
 * @param {object[]} [inEvent.events] - array of events that must all happen be true (assume one for now)
 * @param {object[]} [inEvent.events[].source] - source of event
 * @param {object[]} [inEvent.events[].name] - name of the event
 */


/**
 * Parse the Engagement Pattern and prepare for execution
 * @param {object/string} engagementPattern - Engagement Pattern
 * @returns {ExecutionGraph}
 */
dexit.EPParser.prototype.parse = function(engagementPattern) {
    var self = this;


    function findElementRegion(elementId, regions) {
        var  match;
        _.each(regions, function(eId,currRegion) {

            if (!_.isArray(eId)) {
                eId = [eId];
            }
            _.each(eId, function (id) {
                if (elementId === id) {
                    match = currRegion;
                }
            });

        });
        return match;
    }

    /**
     *
     * @param {string} elementId - element identifier
     * @param {object} [vals] - map of presenation reference assignments/customizations for the current TP and layout combination
     * @param {string} [defaultPresentationRef] - default value (comes from element's presentationRef field and is usually 'default')
     * @returns {*}
     */
    function findElementPresentationRef(elementId, vals, defaultPresentationRef) {
        return (vals && vals[elementId] ? vals[elementId] : defaultPresentationRef);
    }



    /**
     * Handle connection based on set flags
     * @param {object} connection - connection element in the pattern
     */
    function handleConnectionFlags(connection) {
    }

    if (!engagementPattern) {
        return new errors.Validation('engagementPattern is required');
    }

    //convert string to object
    if (_.isString(engagementPattern)) {
        engagementPattern = JSON.parse(engagementPattern);
    }

    var version = engagementPattern.epSchemaVersion || 1;

    //convert ep json to graph  (using graph.js)
    var g = new Graph(['start'],
        ['end']);

    //create references to SC for initialization later on
    var scReferences = [];


    var doubleDecisionNodes = [];

    var trueAppend = '-true';
    var falseAppend ='-false';

    //create all vertices
    _.each(engagementPattern.element, function(item) {
        var regionRef;
        var layoutRef;
        var elementStyle;
        var presentationRef;
        var presentationRefArgs;
        var elementTag;
        if (engagementPattern.epSchemaVersion && engagementPattern.epSchemaVersion === 2) {
            var layout = engagementPattern.currentTouchpoint.layout;
            regionRef = findElementRegion(item.id, layout.regions);
            presentationRef = findElementPresentationRef(item.id,engagementPattern.currentTouchpoint.presentationRef, item.presentationRef);
            layoutRef = layout.id;
            elementStyle = (engagementPattern.currentTouchpoint.layout.elementStyle
            && engagementPattern.currentTouchpoint.layout.elementStyle[item.id] ? engagementPattern.currentTouchpoint.layout.elementStyle[item.id] : {});
            presentationRefArgs = (engagementPattern.currentTouchpoint.presentationRefArgs && engagementPattern.currentTouchpoint.presentationRefArgs[item.id] ? engagementPattern.currentTouchpoint.presentationRefArgs[item.id] : {});
            elementTag = item.tag || ''
        }else {
            regionRef = item.regionRef;
            layoutRef = item.layoutRef;
            elementStyle = {};
        }


        if (!_.isArray(item.type_id)) {
            var ref = buildNodeReference(item.type, item.type_id,item.args,regionRef,layoutRef,presentationRef,item.inEvent, item.description,elementStyle,presentationRefArgs,elementTag, item.eventListener);
            g.addVertex(item.id, ref);
            addSCReference(scReferences, ref);
        }else { //for decisions possible case is to convert one node to multiple (one for true and one for false) using production rule
            // if not 2 then it is not valid
            if (item.type_id.length !== 2) {
                return new errors.Validation('decision element must be single production rule or it can support only exactly 2 elements with the first being true and the second false:' + item.id);
            }

            //note:for decisions there is no layout/region required

            //first index is positive, second is assumed the negative, ordering of connections is considered the same
            var refTrue = buildNodeReference(item.type, item.type_id[0],item.args,null,null,item.inEvent, item.description, null,null,null,item.eventListener);
            var refFalse = buildNodeReference(item.type, item.type_id[1],item.args,null,null,item.inEvent, item.description, null,null,null,item.eventListener);
            g.addVertex(item.id+trueAppend, refTrue);
            g.addVertex(item.id+falseAppend, refFalse);
            addSCReference(scReferences, refTrue);
            addSCReference(scReferences, refFalse);
            //add so that when connections are processed the the order is considered
            doubleDecisionNodes.push(item.id);
        }

    });








    var fromAlreadyProcessed = [];

    //create all edges
    _.each(engagementPattern.connection, function(connection) {
        //connection contains:from, to, type, name, properties

        handleConnectionFlags(connection);

        var name = connection.name;
        var from = connection.from;
        var to = connection.to;
        var type = connection.type;
        var properties = connection.properties;
        var node;

        var connectionPropName = (properties && properties.name ? properties.name: null);
        //for case of no connection "to" then assume it is connected to the end element
        if (!to) {
            to = 'end';
        }


        //if the "from" matches an element in the array of decision nodes that needed to be split into 2 production rules
        //so the connections here need to be updated with the updated id (appending -true or -false)
        //the order in connections is assumed to match the order of the array values for type_id in the element and also match properties.name === path1 for true and path2 for false
        if (doubleDecisionNodes.indexOf(from) !== -1 ) {

            if (connectionPropName) {

                if (connectionPropName === 'path1'){
                    from += trueAppend;
                }

                if (connectionPropName === 'path2'){
                    from += falseAppend;
                }
            } else {
                //if the from reference id has already been seen then its false
                if (fromAlreadyProcessed.indexOf(from) < 0) {
                    fromAlreadyProcessed.push(from);
                    from += trueAppend;
                } else { //if the from reference id has already been seen then its false
                    fromAlreadyProcessed = _.without(fromAlreadyProcessed, from);
                    from += falseAppend;
                }

            }
        }

        if (name === 'start') { //for connection 'start'
            //create edge
            g.createNewEdge('start',to, createPropertiesForConnection(type,properties));
        } else { //for all other connections
            //add edge

            //For the to element, it will also need to be renamed but an additional edge will need to be made for false
            if (doubleDecisionNodes.indexOf(to) !== -1) {
                g.createNewEdge(from,to+trueAppend, createPropertiesForConnection(type,properties));
                g.createNewEdge(from,to+falseAppend, createPropertiesForConnection(type,properties));
            }else {
                g.createNewEdge(from, to, createPropertiesForConnection(type, properties));
            }
        }
    });

    //simple check: if there is a path from start to end...if not then this cannot be executed
    if (!g.hasPath('start','end') ) {
        return new errors.Validation('Cannot execute pattern there is no connection from start to end');
    }


    //good enough for now: determine number of splits at start element and add to end element
    self._prepareJoins(g);



    //return the graph and the SC referenced in the pattern
    return {
        graph: g,
        scReferences: scReferences
    };
};

/**
 * Scan pattern for splits and joins and set flow control information for transition aspect
 * (ie. match splits at start element and make sure end element waits for that many branches)
 * Note: currently only handles start and end (split/join)
 * @param graph
 * @private
 */
dexit.EPParser.prototype._prepareJoins = function (graph) {

    //TODO: generalize for all elements, look at General Synchronization pattern
    var numberOutFromStart = graph.outDegree('start');

    //update end element with parameters on required transitions
    var endElementValue = graph.vertexValue('end') || {};
    endElementValue.inJoin = {'and': numberOutFromStart};
    graph.setVertex('end', endElementValue);

};



/**
 * Prepares the pattern for execution
 * @param {object/string} engagementPattern
 * @returns {ExecutionGraph}
 */
dexit.EPParser.prototype.prepare = function(engagementPattern){
    var self = this;

    //for version 2, layout reference is in currentTouchpoint object
    if (engagementPattern.epSchemaVersion && engagementPattern.epSchemaVersion === 2) {
        if (!engagementPattern.currentTouchpoint) {
            return new Error('invalid EP: currentTouchpoint missing');
        }
        engagementPattern.layout = [engagementPattern.currentTouchpoint.layout.id];
    }


    //identify sc and parse pattern + put into executable graph format
    var parsed = self.parse(engagementPattern);
    if (parsed instanceof Error) {
        return parsed;
    }

    //prepare for start and end time
    var resultStartEnd = self.prepareStartEndDates(parsed.graph,engagementPattern.start,engagementPattern.end);
    if (resultStartEnd instanceof Error) {
        return resultStartEnd;
    }


    //convert params
    var parameters = engagementPattern.parameters || [];
    var val = _.zipObject(_.map(parameters,'key'), _.map(parameters,'value'));

    var params = {
        id: engagementPattern.id,
        start:  resultStartEnd.start,
        end: resultStartEnd.end,
        graph: parsed.graph,
        scReferences: parsed.scReferences,
        parameters: val,
        layout: engagementPattern.layout || [],
        currentTouchpoint: engagementPattern.currentTouchpoint,
        endConfiguration: engagementPattern.endConfiguration || { endId: 'and_path' }
    };
    if (engagementPattern.mainScId) {
        params.mainScId = engagementPattern.mainScId;
    }


    return new dexit.ExecutionGraph(params);

};


/**
 * Parses a Date string into a valid Date object
 * @param {string} DateStr - The ISO 8601 format of the date
 * @param {moment} [backupDate] - backup moment date time object in case parsing of date fails
 * @returns {Moment/*} - Returns either moment date object (which can be in an invalid state)
 */
function prepareDate(dateStr, backupDate) {
    var date;
    try {

        date = moment(dateStr, moment.ISO_8601);
    } catch(eStart) {
        if (backupDate) {
            date = backupDate;
        }
    }
    return date;
}

/**
 * @type EPParser~PrepareStartEndDates
 * @param {Date} start - Start time
 * @param {Date} [end] - end time
 * @param {object} graph - with start and end vertex properties updated
 */


/**
 * Resolve start and end date for the pattern
 * Note: if end is "never" then no timer to remove the pattern is required
 * @param {object} graph - underlying graph to execute
 * @param {string} [startStr] - internally defaults to "now"
 * @param {string} [endStr] - internally defaults to "never"
 * @returns {EPParser~PrepareStartEndDates}
 */
dexit.EPParser.prototype.prepareStartEndDates = function(graph,startStr,endStr) {
    var self = this;

    //check if this is a graph that is recognized
    if (!graph) {
        return new errors.Validation('graph is required');
    }


    //check if this is a graph that is recognized
    if (!_.isFunction(graph.hasVertex)) {
        return new errors.Validation('graph is invalid');
    }

    if (!graph.hasVertex('start')){
        return new errors.Validation('Graph has no start vertex');
    }

    if (!graph.hasVertex('end')){
        return new errors.Validation('Graph has no end vertex');
    }



    /* start date preparation */
    var start;
    if (!startStr || startStr === 'now') {
        start = moment();
    } else {
        start = prepareDate(startStr,start);
        if (!start.isValid()) {
            return new errors.Validation('Invalid start date');
        }
    }

    /* end date preparation*/
    var end;
    if (endStr && endStr !== 'never') {  //end defaults to never if not specified
        end = prepareDate(endStr);
        if (end && !end.isValid()) {
            return new errors.Validation('Invalid end date');
        }
    }

    //set the start and end times
    var startValue = graph.vertexValue('start') || {};
    graph.setVertex('start', _.extend(startValue,{ time: start}));


    if (end) {
        var endValue = graph.vertexValue('end') || {};
        graph.setVertex('end', _.extend(endValue, {time: end}));
    }


    return {
        start: start,
        end: end,
        graph:graph
    };

};

/**
 * Converts the wait time to ms
 * @param {string} str - represents the wait time interval.  This could be in the format 5h (hours), 5m (minutes), 5s (seconds) or 5 (milliseconds)
 */
dexit.EPParser.prototype._waitTimeResolver = function(str) {
    var multiplier = 1; //defaults to ms

    //if it is already a number assume ms
    if (_.isNumber(str)) {
        return str;
    }

    //seconds
    if (dexit.device.util.endsWith(str,'s')) {
        multiplier =1000;
        //remove s
        str = str.slice(0,-1);
    }
    //minutes
    if (dexit.device.util.endsWith(str,'m') || dexit.device.util.endsWith(str,'min')) {
        multiplier = 60000;
        str = str.slice(0,-1);
    }

    //hours
    if (dexit.device.util.endsWith(str,'h')) {
        multiplier = 3600000;
        str = str.slice(0,-1);
    }

    //days
    if (dexit.device.util.endsWith(str,'d')) {
        multiplier = 86400000;
        str = str.slice(0,-1);
    }

    var wait;
    try {
        wait = parseInt(str);
    } catch (e) {
        wait = 1000;  //defaul to 1000 if str cannot be parsed
    }
    return wait * multiplier;

};
;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, moment, errors, _, Graph*/



/**
 * @callback StateStorageCallback
 * @type {error} [] error - optional error
 */


/**
 * @type State
 * @param {string} id -  token identifier
 * @param {number} version - version
 * @param {object} date
 * @param {string} state - state
 */

/**
 *
 * Storage of the state (using memory for now but later plan to move to local storage + upload to service)
 * @param {object} [logger=console] - logger object to call
 * @param {object} [dexRequestUtil=dexit.scp.device.request] - HTTP request utility
 * @constructor
 */
dexit.StateStorage = function(logger, dexRequestUtil, webStorage) {
    'use strict';
    var VALID_STATES = ['waiting', 'runnable', 'running', 'done'];
    var BUCKET = 'dexit.ep.execution.';
    logger = logger || window.console;
    var accesstoken;
    var storage; //either localstorage or sessionstorage


    var executionPatternId;
    var smartContentId;
    var deviceId;
    var channelId;
    var tpId;
    var userId;
    var instanceTime;


    var dexRequestUtil = dexRequestUtil || dexit.scp.device.request;
    var sendQueue = new dexit.rtsc.kb.monitor.OfflineQueue('sc-ep-state', 20000);


    var cache = {};

    /**
     * Check if storage option is available in browser
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage}
     * @param {string} type - Type of storage (either localStorage or sessionStorage)
     * @returns {boolean}
     * @private
     */
    function _storageAvailable(type) {
        try {
            var storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return false;
        }
    }


    //initialize local storage or fallback to session storage (based on capabilities of the browser)
    if (_storageAvailable('localStorage')) {
        storage = localStorage;
    } else {
        storage = AsyncStorage;
    }


    function _generateId() {
        return dexit.util.guid();
    }

    // format for data
    //var map = {
    //    id: 'id',             // string  - unique  (combination of the executionPatternId and the elementId
    //    version: 'version', // int  (don't need to worry about this with only one at a time)
    //    tenant: 'tenant',            //string
    //    data: 'data',            // json
    //    state: 'state',           //string ('waiting', 'runnable', 'running', 'done')
    //    expirationTime: 'expirationTime'    // date
    //
    //};


    /**
     * Sets the current storage based on the following pattern
     * @param {string} executionId - execution pattern identifier
     * @param {string} scIdentifier - smart content identifier
     * @param {string} deviceIdentifier - device identifier
     * @param {string} channelInstanceIdentifier - channel identifier
     * @param {string} [userIdentifier] - user identifier
     * @param {string} [tpIdentifier] - Touchpoint identifier
     * @param {number} [time] - epoch time for instance
     */
    function init(executionId, scIdentifier, deviceIdentifier, channelInstanceIdentifier, userIdentifier, tpIdentifier, time) {
        executionPatternId = executionId;
        smartContentId = scIdentifier;
        deviceId =deviceIdentifier;
        channelId = channelInstanceIdentifier;
        userId = userIdentifier;
        tpId = tpIdentifier;
        instanceTime = time;
    }

    /**
     * Saves data using prefix
     * @param {string} key - unique key for record
     * @param value
     * @private
     */
    function _setData(group, key, value) {

        //make sure to save as a string
        // if (_.isObject(value)) {
        //     value = JSON.stringify(value);
        // }

        if (!cache[group]) {
            cache[group] = {};
        }
        cache[group][key] = value;

        //storage.setItem(BUCKET + key, value);
    }

    /**
     * Removes data using prefix
     * @param {string} key - unique key for record
     * @private
     */
    function _removeData(key) {
        storage.removeItem(BUCKET + key);
    }

    /**
     * Retrieves data using prefix.  Returns a value (string or object)
     * @param {string} key - unique key for record
     * @returns {Object|string}
     * @private
     */
    function _getData(group, key) {
        //var data = storage.getItem(BUCKET + key);
        var data = (cache[group] && cache[group][key] ? cache[group][key] : null)
        return data;

        //return JSON.parse(data);

    }
    function _setGroupData(group, newValue) {
        cache[group] = newValue;
    }


    function _getGroupData(group, value) {
        //var data = storage.getItem(BUCKET + key);
        var data = (cache[group] && cache[group] ? cache[group] : null)
        if (!data) {
            return;
        }
        if (value) {
            return _.pickBy(data, function(val, key) {
                return (val == value);
            });
        }else {
            return data;
        }


        //return JSON.parse(data);

    }


    function _generateKey(elementId) {
        return executionPatternId + '-' +elementId;
    }

    /**
     * Set the element state
     * @param {string} executionPatternId - execution
     * @param {object} element - Element data
     * @param {string} state - state name [see]{@link VALID_STATES)}
     * @param {object} [params] - any additional params
     * @param {number} [expiration] - expiration time (unix epoc)
     * @param {string} [type='full'] - if this is a full or partial
     */
    function setElementStateInfo(element, state, params, expiration, type) {
        //var key = _generateKey(element.id);

        type = type || 'full';

        //for update mode do one of 2 things
        //1) if the element is still in the queue, then append to the item
        //2) if the item is not in the queue then send a separate request to update it
        if (type === 'update') {

            let filter = {
                elementId:element.id,
                epId: executionPatternId
            };


            let data = _.extend({},params);
            if (params && params.presentation_multimedia) {
                data.presentationMultimedia = params.presentation_multimedia;
            }
            //
            //
            // if (params && params.presentation_intelligence) {
            //     data.presentationIntelligence = params.presentation_intelligence;
            // }


            sendQueue.replaceInQueue(filter,data, function (err, result) {
                if (err || (result === false))  {
                    console.log('could not replace in queue');

                    //add
                    _queue(element, state, data, 'update');
                    _setData(executionPatternId, element.id, state);
                }else {
                    //add to queue


                    console.log('updated existing entry');
                }
            });

        }else { //for full mode set all data

            //TODO: uncomment
            //_setData(key, {data: element, state: state, expirationTime: expiration});
            _queue(element,state,params);

            _setData(executionPatternId, element.id, state);
        }
    }


    function removeElementStateInfo(elementId) {
        var key = executionPatternId + '-' + elementId;
        _removeData(key);
    }


    /**
     * Returns the element state info (or null if not found)
     * @param executionPatternId
     * @param elementId
     * @returns {Object|string}
     */
    function getElementStateInfo(executionPatternId, elementId) {
        var key = executionPatternId + '-' + elementId;
        return _getData(key);
    }


    function getElementsByState(executionPatternId, state) {
        //get all data from executionPattern
    }


    function startProcessing(){
        sendQueue.processQueue(_send,function(err){
            if(err) {
                console.log('error processing queue');
            } else {
                console.log('processing done');
            }
        });
    }

    function stopProcessing() {
        sendQueue.stopProcessQueue();
    }


    function _queue(element, state, params, type) {

        var data =  {
            epId: executionPatternId,
            scId:smartContentId,
            deviceId:deviceId,
            channelId:channelId,
            time: instanceTime,
            userId: userId || '',
            tpId:tpId,
            elementId:element.id || element.type,
            elementType: (element.value && element.value.type ? element.value.type : ''),
            elementTypeId: (element.value && element.value.typeId ? element.value.typeId : ''),
            elementSCId: (element.value && element.value.scId ? element.value.scId : ''),
            elementLayoutRef: (element.value && element.value.layoutRef ? element.value.layoutRef : ''),
            elementRegionRef: (element.value && element.value.regionRef ? element.value.regionRef : ''),
            state: state,
            params: params || {},
            operationType: type || 'insert'
        };
        if (element.value && element.value.presentation_multimedia) {
            data.params.presentationMultimedia = element.value.presentation_multimedia;
        }

        if (element.value && element.value.presentationMultimedia) {
            data.params.presentationMultimedia = element.value.presentation_multimedia;
        }
        //
        // if (element.value && element.value.presentation_intelligence) {
        //     data.presentationIntelligence = params.presentation_intelligence;
        // }
        //
        // if (element.value && element.value.presentationIntelligence) {
        //     data.presentationIntelligence = params.presentationIntelligence;
        // }


        sendQueue.enqueue(data, function(err) {
            if (err) {
                console.log('failed to queue data');
            }
        });

    }

    function _send(body, callback) {

        var uploadTime = Date.now();
        var toUpload = body.map(function(val) {
            val.uploadTime = uploadTime;
            return val;
        });

        var resource ='/instance/',
            headers = { 'Content-Type': 'application/json'},
            query ={},
            numRetries = 0,
            maxRetries= 2,
            url_base = dexit.bccProxyUrl + '/bcc';

        dexRequestUtil.XHRRequestWithRetry(url_base,'POST', resource, headers, query, toUpload, numRetries, maxRetries, function(err) {
            if (err) {
                return callback(err);
                //TODO: requeue on failure
            }
            callback();
        });
    }


    return {
        init: init,
        setElementStateInfo: setElementStateInfo,
        removeElementStateInfo: removeElementStateInfo,
        getElementStateInfo: getElementStateInfo,
        startProcessing: startProcessing,
        stopProcessing: stopProcessing,
        getGroupData: _getGroupData,
        setGroupData: _setGroupData
    }


};





;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, errors, _, PubSub */
//TODO: migrate this code to a shared spot between device and cloud
var EXECUTE_EVENT = 'dexit.ep.execution';
var EXECUTE_DONE_EVENT = 'dexit.ep.executionResponse';


dexit.ExecutionManager = function(config,stateStorage, scManager, pubSub) {
    'use strict';

    var self = this;
    this.config = config;

    this.stateStorage = ( (stateStorage != null) ? stateStorage : dexit.StateStorage());

    this.stateStorage.startProcessing();

    this.scManager = scManager || dexit.scp.device.management.scmanager;

    //restriction at the device (only one EP can execute at a time)
    /** @type {ExecutionGraph} */
    this.currentExecution = null;

    this.executing = false;

    //allow pubsub to be overridden mainly for testing
    this.pubSub = pubSub || PubSub;

    //to be filled later
    //this.executeDoneHandlerToken;
    //this.executionDoneCallback;
    this.sc;
    this.channelId;
    this.deviceId;

    this.executions = [];
    this.suspendedExecutions = [];

    this.waitingElements = [];






    this.pubSub.subscribe('dexit.ep.show', function(msg, dat){
        //setElementStateInfo
        //self.stateStorage.setElementStateInfo();
        var data = dat.element;
        var scId = (dat.scId ? dat.scId : data.scId);

        self.stateStorage.init(data.epId,scId,self.deviceId,self.channelId,dexit.device.sdk.getUser(),dexit.device.sdk.getTouchpoint().touchpoint,data.instanceTime);
        var params = (data && data.previousElement && data.previousElement.id ? {previousElementId: data.previousElement.id} : {});

        self.stateStorage.setElementStateInfo(data.currentElement,'click',_.extend(params,data.intelligence));
        //self.stateStorage.setElementStateInfo(data.currentElement,'suspend');

        //call suspend
        self.suspend(data.epId,data.currentElement.id);

        self.pubSub.publish('dexit.ep.go', dat);
        // if (data && data.element && data.element.intelligence) {
        //     //1: unload current EP (data.element.epId), and wait
        //     //2: load new element
        //     self.goToEP(data.element.intelligence, data.element.epId);
        // }

    });


    this.pubSub.subscribe('video.event', function(msg, dat) {


        //dat: action,  name (video.event) , data { elementId, value, referenceId (epId) }
        //
        // if (!self.executing) {
        //     return;
        // }


        var action = (dat && dat.event ? dat.event : '');
        if (action && action === 'played') {
            var currentValue = dat.data.value;
            var elementId = dat.elementId;

            //find in suspended {eg: eg, currentElement: currentElement, cbFn: callback}
            var toFind = _.filter(self.waitingElements, function(element) {
                var currentElement = element.currentElement;
                return (currentElement && currentElement.value && currentElement.value.eventListener
                    && currentElement.value.eventListener.name === action && currentElement.value.eventListener.elementId === elementId
                    && currentElement.value.eventListener.value == currentValue);
            });
            if (toFind.length > 0) {

                _.each(toFind, function (val) {
                    val.cbFn();
                });

                //remove once done
                _.remove(self.waitingElements, function (element) {
                    return _.find(toFind, function (elementToRemove) {
                        return (elementToRemove.currentElement.id === element.currentElement.id);
                    });
                });
                //self.waitingElements = afterRemoval;
            }

        }
    });
};

/**
 * To be called when starting service
 */
dexit.ExecutionManager.prototype.init = function(touchpoint){
    var self = this;

    //make sure stateStorage is initialized
    self.channelId = touchpoint.channel_id;
    self.deviceId = touchpoint.deviceId;

    this.executing = false;

    //TODO: move this
    //register event reciever
    //PubSub.subscribe('scp.device.sc.localEvent', self.receiveEvent);
    self.eventElements = {};
    self.eventHandlers = [];
    self.waitingElements = [];

};


dexit.ExecutionManager.prototype.setAccessToken = function(token){
    this.token = token;
    return this;
};


dexit.ExecutionManager.prototype._scheduleTimer = function(timeParams, callback) {
    var unit = timeParams.unit;
    var value = timeParams.value;

    var multiplier = (unit === 'minutes' ? 60000 : 1000);

    if (_.isString(value)) {
        try {
            value = parseInt(value);
        }catch(e) {
            value = 1; //default to 1
        }
    }
    var timeDelay = multiplier * value;



    setTimeout(function () {
        callback();
    }, timeDelay);

    //dexit.device.util.createTimer(timeDelay, {name: 'scp.device.sc.localEvent', params: param});

};

/**
 * @callback ExecutionManager~InitPatternCallback
 * @param {Error} [error] - if any error initializing the pattern
 */


/**
 * A request object for loading a smart content object.  Useful to enable caching and prefix for cache key
 * @typedef SCObjectRequest
 * @type {object}
 * @property {string} id - Smart Content Identifer
 * @property {boolean} [cacheable] - if the result can be cached
 * @property {boolean} [cachePrefix=''] - if cacheable is set, then the prefix an be optionally appended
 *
 */

/**
 * Prepare for execution
 * @param {ExecutionGraph} eg  - executable pattern
 * @param {ExecutionManager~InitPatternCallback} callback
 */
dexit.ExecutionManager.prototype.initExecutionPattern = function(eg, callback){
    var self = this;

    if (this.currentExecution && this.currentExecution.id === eg.id) {
        return callback(new errors.Conflict('Pattern:'+this.currentExecution.id + ' is already running'));
    }

    //make sure all required sc are initialized
    var scIds = eg.scReferences;


    let scReq = _.map(scIds, function(id) {
        return {
            id: id,
            cacheable: true,
            cachePrefix: eg.id  //prefix will be engagement pattern id
        };
    });

    self.scManager.init(null,scReq,function(err) {
    //self.scManager.init(null,scIds,function(err) {

        if (err) {
            return callback(err);
        }

        this.sc = scIds;
        // if (eg) {
        //     return callback(); //skip issue with double load on callback
        // }

        callback();
    });
};



// dexit.ExecutionManager.prototype.resume = function(eg, callback) {
//     var self = this;
//
//     //execution engine
//     function executionEngine(eg, currentElementId, cb) {
//         var currentElement = {
//             id: currentElementId,
//             value: eg.graph.vertexValue(currentElementId),
//             layout:eg.layout || []
//         };
//         self._execute(eg,currentElement, null, cb);
//     }
//     eg.executing = true;
//     eg.executionDoneCallback = callback;
//     this.executions.push(eg);
//
//     //need to find all "running" elements"  and/or any adjacent elements to "done" that are not running
//
//     //or find all 'done' states and go to next elements for each *
//     this.stateStorage.init(eg.id,eg.mainScId,self.deviceId,self.channelId,dexit.device.sdk.getUser(),dexit.device.sdk.getTouchpoint().touchpoint,eg.time);
//
//     executionEngine(eg,'start', eg.executionDoneCallback);
//
// };



dexit.ExecutionManager.prototype.start = function(eg, callback) {
    var self = this;

    //execution engine
    function executionEngine(eg, currentElementId, cb) {
        var currentElement = {
            id: currentElementId,
            value: eg.graph.vertexValue(currentElementId),
            layout:eg.layout || []
        };
        self._execute(eg,currentElement, null, cb);
    }
    eg.executing = true;
    eg.executionDoneCallback = callback;
    this.executions.push(eg);


    //if the end is activated based on end of specified element, then add listener here
    if (eg.endConfiguration && eg.endConfiguration.endId && eg.endConfiguration.endId == 'element_done_path') {
        eg.endInterruptOnElementDone = eg.endConfiguration.params;

    }

    executionEngine(eg,'start', eg.executionDoneCallback);


};

/**
 * Modifies element and returns
 * @param eg
 * @param elementId
 * @private
 */
dexit.ExecutionManager.prototype._setElementValueProperty = function(eg, currentElementId, keyValues, params) {
    var self = this;
    var value = eg.graph.vertexValue(currentElementId);


    _.each(keyValues, (val, key) => {
        value[key] = val;
    });

    // value[propertyKey] = val;
    eg.graph.setVertex(currentElementId, value);

    //FIXME

    // //send to state tracker
    // self.stateStorage.init(data.epId,scId,self.deviceId,self.channelId,dexit.device.sdk.getUser(),dexit.device.sdk.getTouchpoint().touchpoint,data.instanceTime);
    // var params = (data && data.previousElement && data.previousElement.id ? {previousElementId: data.previousElement.id} : {});
    //
    //
    let element = {
        id: currentElementId,
        value: value
    };

    self.stateStorage.setElementStateInfo(element,'presented', params,null,'update');


    // //self.stateStorage.setElementStateInfo(data.currentElement,'click',_.extend(params,data.intelligence));
    //
    // self.stateStorage.setElementStateInfo(updateRequest,'running', {}, null,'update');



    return eg;
};

/**
 * Checks if element should proceed to run based on transitions with possible AND join
 * @param {object} currentElement
 * @return {boolean} if true then proceed, otherwise wait
 * @private
 */
dexit.ExecutionManager.prototype._checkJoin = function (eg, currentElement) {
    var self = this;
    //check for inJoin condition
    var elementValue =  currentElement.value || {};
    var number = 1;
    if (elementValue.inJoin && elementValue.inJoin.and){
        number = elementValue.inJoin.and;
    }

    if (number > 1) {
        number--;
        //decrement number for wait in elementValue.inJoin.and
        elementValue.inJoin.and = number;

        //update element value
        eg.graph.setVertex(currentElement.id, currentElement.value);
        return false;
    } else {
        return true;
    }

};

dexit.ExecutionManager.prototype._waitForHandler = function(eg, currentElement, callback) {

    if (currentElement.value.eventListener) {
        var element = ({eg: eg, currentElement: currentElement, cbFn: callback});
        this.waitingElements.push(element);
    } else {
        callback();
    }

};


dexit.ExecutionManager.prototype._execute = function(eg,currentElement, previousElement, callback) {
    callback = callback || function(){};

    var getTransitionItem = function(currentElement) {
        if (currentElement.value.inEvent && currentElement.value.inEvent.events && _.isArray(currentElement.value.inEvent.events) && currentElement.value.inEvent.events.length > 0) {

            var inE = currentElement.value.inEvent.events;
            var transitionItem = inE.find(function (val) {
                return val.name && (val.name === 'Timer' || val.name === 'Video');
            });

            if (transitionItem) {
                return transitionItem;

            }else {
                return {name:'Click'};
            }
        }else {
            return {name:'Click'};
        }

    };

    var self = this;
    if (!eg.executing) {

        return callback();
    }
    var data = {
        epId: eg.id
    };
    //make sure all join(s) have come in before trying to execute element
    var proceed = self._checkJoin(eg,currentElement);
    if (!proceed) {
        return;
    }

    if (currentElement.id === 'end') {
        //execution done

        data.type ='end';
        //self.pubSub.publish(EXECUTE_EVENT,data);
        eg.executing = false;
        callback();



    } else if (currentElement.id === 'start') {

        data.layout = currentElement.layout || [];
        data.type = 'start';

        if (eg.overrideContainer) {
            data.overrideContainer = eg.overrideContainer;
        }

        // self.pubSub.publish(EXECUTE_EVENT,data);

        var scId = eg.mainScId;
        this.stateStorage.init(data.epId,scId,self.deviceId,self.channelId,dexit.device.sdk.getUser(),dexit.device.sdk.getTouchpoint().touchpoint,eg.time);
        var toSave = {
            id: 'start',
            value: {
                layoutRef: data.layout
            }
        };
        this.stateStorage.setElementStateInfo(toSave,'running');


        //TODO: better handle preparing layout
        dexit.device.sdk.presentationMng.showElement(data, function(err) {
            if (err) {
                return callback(err);
            }


            var vertices = eg.verticesFrom(currentElement.id);

            //count number of flow vertices from start and hide loader in parentRef
            debugger;
            let counter = vertices.flow.length;

            _.each(vertices.flow, function(item) {
                var edgeValues = item.edge;
                var wait = ( (edgeValues.properties && edgeValues.properties.wait) ? edgeValues.properties.wait : 0 );

                setTimeout(function(){
                    var vertex = item.vertex;
                    //add previous element for consistency of data
                    self._execute(eg, vertex, toSave, callback);
                    counter = counter -1;




                    setTimeout(function(){
                        if (counter < 1 && dexit.device.sdk.getParentRef()) {

                             dexit.device.sdk.getParentRef().hideLoadingIndicator();
                        }
                    }, 500)


                }, wait);
            });



        });
    } else {
        //run any other element
        //self._runElement(currentElement);

        self._waitForHandler(eg, currentElement, function () {
            var transitionItem = getTransitionItem(currentElement);
            self._runElement(eg,currentElement, transitionItem,previousElement);
        });



        //
        // //pass along transition to element
        // if (currentElement.value.inEvent && currentElement.value.inEvent.events && _.isArray(currentElement.value.inEvent.events) && currentElement.value.inEvent.events.length > 0) {
        //
        //     var inE = currentElement.value.inEvent.events;
        //     var transitionItem = inE.find(function (val) {
        //         return val.name && (val.name === 'Timer' || val.name === 'Video');
        //     });
        //
        //     if (transitionItem) {
        //         //var timeParams = item.args;
        //         // self._scheduleTimer({currentElement: currentElement}, timeParams);
        //         self._runElement(eg,currentElement, transitionItem,previousElement);
        //     } else {
        //         self._runElement(eg, currentElement, {name:'Click'},previousElement); //default to click
        //     }
        //
        //     // if (!transitionItem) {
        //     //     transitionItem = {name:'Click'}; //default to click
        //     // }
        //     // if (!item) {
        //     //     self._runElement(currentElement);
        //     // } else {
        //     //     var timeParams = item.args;
        //     //     self._scheduleTimer({currentElement: currentElement}, timeParams);
        //     //     self._runElement(currentElement, item);
        //     // }
        // } else {
        //
        //     //run any other element
        //     self._runElement(eg,currentElement, {name:'Click'},previousElement);
        // }
    }

};

/**
 * Check if the pattern is stopped first
 * @private
 */
dexit.ExecutionManager.prototype._checkStopped = function(eg){
    eg.executionDoneCallback = eg.executionDoneCallback || function(){};

    eg.executionDoneCallback();
    var index = _.findIndex(this.executions, ['id',eg.id]);
    if (index !== -1) {
        this.executions.splice(index,1);
    }
};


/**
 * @typedef {object} InputElement
 * @property {string}  id - element identifier
 * @property {string} type - type element is pointing at (ie. intelligence)
 * @property {string} typeId - resolvable reference for SC element (ie. sc:a:intelligence:11234)
 * @property {object} [args={}] - any data to pass along to help resolve SC element value(s)
 */


/**
 *
 * @param {object} currentElement - current execution element {@link https://github.com/mhelvens/graph.js|refer to graph.js vertex)
 * @returns {InputElement[]} - array of input elements
 * @private
 */
dexit.ExecutionManager.prototype._getLinkInputs = function (eg, currentElement) {
    var self = this;
    var incoming = eg.verticesTo(currentElement.id);
    var inputElements = incoming.link.map(function(obj){
        var vertex = obj.vertex;

        var rObj = {
            id : vertex.id,
            type : vertex.value.type,
            typeId : vertex.value.typeId,
            args: vertex.value.args || {}
        };

        return rObj;

    });

    return inputElements;

};



dexit.ExecutionManager.prototype._presentElement = function (eg, data, transition) {
    var self =this;
    //check if pattern is stopped before proceeding then exit function
    if (!eg.executing) {
        self._checkStopped(eg);
        return;
    }

    if (eg.mainScId) {
        data.overrideScId = eg.mainScId;
    }

    if (transition && transition.name === 'Timer') {
        dexit.device.sdk.presentationMng.showElement(data, function () {

        });
        var timeParams = transition.args;
        self._scheduleTimer(timeParams, function () {
            self.onElementDone(eg, data);
        });
    }else  if (transition && transition.name === 'Video') {
        var transitionArgs = transition.args;

        dexit.device.sdk.presentationMng.showElement(data, function () {

        });


        var token = PubSub.subscribe('video.event', function(msg, dat) {
            if (transitionArgs && transitionArgs.elementId === dat.elementId && transitionArgs.event ===  dat.event) {
                if (transitionArgs.value) {
                    var currentValue = dat.data.value;
                    var val = transitionArgs.value;
                    console.log('current video value:'+currentValue + ' val:' + val + 'for event:'+dat.event);
                    if (_.isNumber(currentValue)) {
                        try {
                            val = parseFloat(transitionArgs.value);
                        }catch (e) {

                        }
                        if (currentValue >= val) {
                            self.onElementDone(eg, data);
                            PubSub.unsubscribe(token);
                        }
                    }else {

                        if (transitionArgs.value == dat.data.value) {
                            self.onElementDone(eg, data);
                            PubSub.unsubscribe(token);
                        }
                    }
                }else {
                    self.onElementDone(eg, data);

                    PubSub.unsubscribe(token);
                }

            }


            //if (data && data.event === data.currentElement.)




            //elementId: "a880843f-9cbc-491a-a9e8-4267a0f3f783"
            // event: "percent played"
            // value: "25"
        })

    } else { //wait for completion from
        dexit.device.sdk.presentationMng.showElement(data, function () {
            self.onElementDone(eg, data);
        });
    }

};

/**
 *
 * @param {object} currentElement
 * @param {object} transition
 * @param {string} transition.name - if 'Click: wait for click, otherwise could be a timer
 * @private
 */
dexit.ExecutionManager.prototype._runElement = function(eg, currentElement, transition, previousElement) {
    var self = this;


    if (!eg.executing) {
        self._checkStopped(eg);
        return;
    }

    /**
     *
     * @param {object} currentElement - current element
     * @return {object}
     */
    function getArgs(currentElement) {
        var args = (currentElement.value && currentElement.value.args ? currentElement.value.args : {});
        if (eg.parameters) {
            args = _.extend(args,eg.parameters);
        }
        //ICEEDU-1419: workaround to get userEmail for group chat behaviour
        if(args[':user']){
            args[':user'] = self.config.userEmail;
        }

        _.each(args, function(val,key) {
            if (val && _.isString(val) && val.indexOf('{{user.') !== -1) {
                var user = dexit.ep.lib.profile.user;
                var match = val.replace('{{user.','');
                match = match.replace('}}','');
                args[':'+key] = user.attributes[match];
                try {
                    delete args[key];
                }catch (e) {}
                //update args
            }
        });

        return args;
    }

    // to find the next element in the pattern and add in the data to be sent to sc-playback
    var nextElement = eg.verticesFrom(currentElement.id);
    var datatosend = nextElement.flow.map(function(obj){
        var vertex = obj.vertex,rObj;
        if (vertex.id === 'end'){
            rObj= {
                id : vertex.id,
                type : vertex.id
            };

        }else{
            rObj = {
                id : vertex.id,
                type : vertex.value.type,
                typeId : vertex.value.typeId,
                scId:vertex.value.scId
            };
        }
        return rObj;

    });

    var data = {
        epId: eg.id,
        type: currentElement.value.type,
        typeRef: currentElement.value.typeRef,
        typeId : currentElement.value.typeId,
        data: {
            scId: currentElement.value.scId,
            repository: self.config.repository
        },
        previousElement: previousElement,
        currentElement: currentElement,
        nextElement : datatosend,
        regionRef: (currentElement.value && currentElement.value.regionRef ? currentElement.value.regionRef : ''),
        layoutRef: (currentElement.value && currentElement.value.layoutRef ? currentElement.value.layoutRef : ''),
        presentationRef: (currentElement.value && currentElement.value.presentationRef ? currentElement.value.presentationRef : ''),
        presentationStyle: (currentElement.value && currentElement.value.presentationStyle ? currentElement.value.presentationStyle : null),
        presentationRefArgs: (currentElement.value && currentElement.value.presentationRefArgs ? currentElement.value.presentationRefArgs : null),
        instanceTime: eg.time,
        egReference: eg
    };

    var sc = dexit.scp.device.management.scmanager.smartcontent.object[currentElement.value.scId];

    var scId = (eg.mainScId ? eg.mainScId : currentElement.value.scId);
    //mark the element has completed, determine where to execute next
    this.stateStorage.init(data.epId,scId,self.deviceId,self.channelId,dexit.device.sdk.getUser(),dexit.device.sdk.getTouchpoint().touchpoint,eg.time);
    var previousParams = (data && data.previousElement && data.previousElement.id ? {previousElementId: data.previousElement.id} : {});
    this.stateStorage.setElementStateInfo(data.currentElement,'running',previousParams);
    var type = currentElement.value.type;

    //resolve any incoming 'link' connections for currentElement
    var inputs = self._getLinkInputs(eg, currentElement);


    switch (type) {
        case 'multimedia':
            //make sure layout is referenced
            if (data.typeRef === 'layout') {
                data.data.layoutId = currentElement.value.typeId;
            } else { //otherwise get the actual multimedia id
                var mmInfo = currentElement.value.typeId.split('#');
                data.data.multimedia = {id: mmInfo[0], mmType:mmInfo[1]};

            }
            //playback will handle the multimedia, wait for response
            self._presentElement(eg, data, transition);
            break;
        case 'intelligence':
            if (currentElement.value.args && currentElement.value.args.epId) {
                self._presentElement(eg, data, transition);
                //self._publish(EXECUTE_EVENT,data);
                //playback will handle the presentation for the report, wait for response
            } else if (currentElement.value.typeId && currentElement.value.typeId.indexOf('{{ep')!== -1){

                if (currentElement.value.typeId === '{{ep.recommended}}') {
                    data.presentationRef = 'embedded';
                }
                self._presentElement(eg, data, transition);
            } else if(self.config.reportEngine){ //TODO: report engine should be inside SDK and intelligence handling should be general
                var ps = {
                    args:getArgs(currentElement),
                    currentElementValue:data.currentElement.value
                };
                self.config.reportEngine.prepareReportByEPIntelligence(ps, function(err, res){
                    if (err) {
                        data.error = err;
                    } else {
                        //make sure result is added with the element data field
                        data.data = res;
                    }
                    self._presentElement(eg, data, transition);
                    //self._publish(EXECUTE_EVENT,data);
                });
            } else{
                self._presentElement(eg, data, transition);
                //self._publish(EXECUTE_EVENT,data);
            }
            break;
        case 'behaviour':
            var behaviour = sc.behaviour[currentElement.value.typeId];
            //pass any inputs through, for behaviours
            behaviour.executeWithParams(getArgs(currentElement), inputs,function(err,result) {
                if (err) {
                    data.error = err;
                } else {
                    //make sure result is added with the element data field
                    data.data = result;
                }
                //call behavior notification
                self._presentElement(eg, data, transition);
                //self._publish(EXECUTE_EVENT,data);
            });
            break;
        case 'decision':
            //call decision element
            //self._publish(EXECUTE_EVENT,data);
            var decisionElement = sc.decision[currentElement.value.typeId];

            var theArgs = getArgs(currentElement);

            //TODO: more generic way to pass in user
            var userId = dexit.device.sdk.getUser();
            if (userId){
                theArgs = _.extend(theArgs, {'userId':userId});
            }

            //resolve any incoming 'link' connections for currentElement
            var intelParams = {};
            if (inputs && inputs.length > 0) {
                if (inputs[0].type === 'intelligence' && inputs[0].typeId.indexOf('temp-') !== -1) {
                    //send temporary intelligence along
                    var behElement =eg.graph.vertexValue(inputs[0].typeId.split('temp-')[1]);

                    var scId = behElement.scId;
                    var behId = behElement.typeId;


                    intelParams = {
                        'intelligenceType': 'temporary',
                        'source': {
                            scId: scId,
                            behaviourId:behId,
                            elementId:inputs[0].id,
                            epId:eg.id
                        }
                    };
                }
            }


            decisionElement.evaluate(theArgs, intelParams, 'presentation',function(err, result) {
                if (err) {
                    data.error = err;
                }
                data.result = result;
                //self._publish(EXECUTE_DONE_EVENT,data);

                self.onElementDone(eg, data);
                //self._presentElement(data, transition);
            });
            break;
        default:

    }
};

/**
 * After execution of element is done, update the state and proceed to the next element
 * @param {object} data
 * @param {object} data.currentElement - reference to the execution element
 * @param {object} data.data - Data for the execution
 * @param {object} [data.error] - If present, then an error occurred executing the element
 * @param {object} [data.result] - If present, then the output of the execution that is not an error
 * @returns {*}
 */
dexit.ExecutionManager.prototype.onElementDone = function(eg, data) {
    var self = this;

    //check if not running
    if (!eg.executing) {
        self._checkStopped(eg);
        return;
    }

    var scId = (eg.mainScId ? eg.mainScId : data.data.scId);
    //mark the element has completed, determine where to execute next
    this.stateStorage.init(data.epId,scId,self.deviceId,self.channelId,dexit.device.sdk.getUser(),dexit.device.sdk.getTouchpoint().touchpoint, eg.time);

    this.stateStorage.setElementStateInfo(data.currentElement,'done');

    if (data.error) {
        return eg.executionDoneCallback(data.error);
    }

    //FIXME: should have handler for each type of element result: for now just use simple statement for decision
    if (data.currentElement && data.currentElement.value && data.currentElement.value.type && data.currentElement.value.type === 'decision'){
        //if decision result is false then don't continue
        if (data.result && !data.result.result) {
            return;
        }
    }
    if (eg.endInterruptOnElementDone && eg.endInterruptOnElementDone.id && eg.endInterruptOnElementDone.id ===data.currentElement.id) {
        self.executing= false;
        self._checkStopped(eg);
        return;
    }

    //look for next item(s) to execute
    var vertices = eg.verticesFrom(data.currentElement.id);

    _.each(vertices.flow, function(item) {
        var edgeValues = item.edge;
        var wait = ( (edgeValues.properties && edgeValues.properties.wait) ? edgeValues.properties.wait : 0 );

        setTimeout(function () {
            var vertex = item.vertex;
            self._execute(eg,vertex, data.currentElement, eg.executionDoneCallback);
        }, wait);
    });
};


/**
 * Stop execution of the pattern
 */
dexit.ExecutionManager.prototype.stop = function(eg) {
    eg.executing = false;
    eg.currentExecution = null;
    //remvoe from array


    var index = _.findIndex(this.executions, ['id', eg.id]);

    //var index = this.executions.indexOf(eg.id);
    if (index !== -1) {
        this.executions.splice(index,1);
    }

    //var suspended = this.suspendedExecutions.indexOf(eg.id);

};

/**
 * Unloads any resources the execution manager is holding onto.
 * Currently, only removes  stops the local event listener
 */
dexit.ExecutionManager.prototype.unload = function(eg) {
    if (eg.executeDoneHandlerToken) {
        // this.pubSub.unsubscribe(this.executeDoneHandlerToken);
        eg.executeDoneHandlerToken = null;

    }
};


dexit.ExecutionManager.prototype.resume = function(id, overrideContainer, callback) {
    //look up state


    var self = this;
    var suspendedExecutions = this.suspendedExecutions || [];

    //last indexOf
    var lIndex = _.findLastIndex(suspendedExecutions, function(val) {
        return (val.id === id);
    });

    if (lIndex !== -1) {
        var eg = suspendedExecutions[lIndex];
        //retrieve all elements that have state "running" and re-start them

        if (overrideContainer) {
            eg.overrideContainer = overrideContainer;
        }


        //replace callback
        if (callback) {
            eg.executionDoneCallback = callback;
        }


        this.sc = eg.scReferences;
        //add back executions
        this.executions.push(eg);


        //remove from suspended
        this.suspendedExecutions.splice(lIndex,1);



        //get all suspended
        var toRun = this.stateStorage.getGroupData(eg.id, 'suspended');

        //prepare layout required

        toRun = _.omit(toRun, ['start']);


        // var startData = {
        //     id: 'start',
        //     value: eg.graph.vertexValue('start'),
        //     layout:eg.layout || []
        //     type:
        // };

        var startData = {
            epId: eg.id,
            type: 'start',
            layout:eg.layout || [],
            egReference: eg
        };
        if (eg.overrideContainer) {
            startData.overrideContainer = eg.overrideContainer;
        }
        this.executing = true;


        dexit.device.sdk.presentationMng.showElement(startData, function(err) {
            if (err) {
                console.warn('could not load layout when resuming pattern');
                return;
            }
            //resume each suspended element
            _.each(toRun, function(value, elementId) {


                if (eg.suspendedFromElementId && elementId == eg.suspendedFromElementId) {
                    //bypass the element the suspension was initiated form and go to its next
                    var vertices = eg.verticesFrom(elementId);
                    _.each(vertices.flow, function(item) {
                        var edgeValues = item.edge;
                        var wait = ( (edgeValues.properties && edgeValues.properties.wait) ? edgeValues.properties.wait : 0 );

                        setTimeout(function(){
                            var vertex = item.vertex;
                            self._execute(eg, vertex, null, eg.executionDoneCallback);
                        }, wait);
                    });

                    delete eg.suspendedFromElementId;
                }else  {

                    var currentElement = {
                        id: elementId,
                        value: eg.graph.vertexValue(elementId)
                    };

                    self._execute(eg, currentElement, null, eg.executionDoneCallback);
                }
            });
        });
    }else {
        return callback(new Error('no valid pattern found to execute'));
    }

};


dexit.ExecutionManager.prototype.suspend = function(egId, suspendedFromElementId) {

    //var scId = eg.mainScId;
    //grab stat info and save
    var index = _.findIndex(this.executions,['id', egId]);
    if (index !== -1) {
        var eg = this.executions[index];

        eg.suspendedFromElementId = suspendedFromElementId;
        //suspended[eg.id] =eg;
        //var ss = [];

        //change all 'running' to 'suspended'
        var running = this.stateStorage.getGroupData(eg.id, 'running');

        _.extend(running,this.stateStorage.getGroupData(eg.id,'click'));

        var mapped = _.mapValues(running, function(state, elementId) {
            return 'suspended';
        });
        this.stateStorage.setGroupData(eg.id,mapped);


        //grab all state info for selected and save
        //this.stateStorage.init(eg.id,scId,self.deviceId,self.channelId,dexit.device.sdk.getUser(),dexit.device.sdk.getTouchpoint().touchpoint,eg.time);

        this.suspendedExecutions.push(eg);

        //remove from execution

        this.executions.splice(index,1);
    }else {
        debugger;
    }

};




;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/* global, dexit, _, Base64, async */

dexit.LayoutProcessor = function LayoutProcessor() {


    function findMultimediaWithTagByMultimedia(tag, multimedia) {
        var scMultimedia = [].concat(multimedia.image).concat(multimedia.video).concat(multimedia.text).concat(multimedia.link).concat(multimedia.audio);

        for (var i = 0; i < scMultimedia.length; i++) {
            var mm = scMultimedia[i];
            if (mm && _.isArray(mm.property.tag) && mm.property.tag.indexOf(tag) !== -1) {
                return mm;
            } else if (mm && mm.property.tag && mm.property.tag === tag) {
                //check if tag is not an array
                return mm;
            }
        }
        return null;
    }

    function findMultimediaWithTag(tag, scMultimedia) {
        for (var i = 0; i < scMultimedia.length; i++) {
            var mm = scMultimedia[i];
            if (mm && _.isArray(mm.property.tag) && mm.property.tag.indexOf(tag) !== -1) {
                return mm;
            } else if (mm && mm.property.tag && mm.property.tag === tag) {
                //check if tag is not an array
                return mm;
            }
        }
        return null;
    }

    /**
     * parse the provided layout and pre-process it by resolving the location/content of all multimedia tags
     * based on the multimedia on the specified smart content
     * NOTE: this method will fail if layout doesn't have a body or is an invalid html
     * @param layout layout to be parsed
     * @param scMultimedia the multimedia that has been processed for engagement etc
     * @param callback with the processed layout
     */
    this.prepareLayout = function (layout, scMultimedia, callback) {

        //jquery ignores <html> and <body> tags, create another root element for the layout to
        //allow proper parsing
        // SC-330 'double video' bug
        //         There seems to be issue with chrome/firefox autoplaying video as soon as its loaded into the DOM
        //         whether its attached to DOM tree or not.  Work around found by not using Jquery.
        //         The work around also requires the element be created using a DOM other than
        //         'document'.  Whenever, document.createElement is used and the video tag is loaded
        //         into the element, it begins playing right away if it has autoplay set.
        //         However, when we first call 'createHTMLDocument' and use that to create the element
        //         it does not seem to trigger the video autoplay.
        //            (previously jQuery was used as follows: var $layout = $("<span />").append(layout);)
        //            - but as soon as jQuery instantianted an object with video autoplay, it queues it for playing
        //              causing double video.
        if (!layout) {
            return callback(null,{content: '', multimedia: scMultimedia})
        }
        var multimedia = {
            text: [],
            image: [],
            video: [],
            audio: [],
            link: []
        };

        // create a temporary element to manipulate the HTML.  If instead we use 'document'
        // without creating a temporary dom, the video element is played twice.

       // var dom = new JSDOM(`<body></body>`);

        //workaround
        debugger;
        //const $ = cio.load('<span>+layout+</span>');
        const $ = cio.load(layout);
        let $layout = $();
       // var dom = document.implementation.createHTMLDocument( 'tmp_doc' );
        //var wrapper = dom.createElement('span');

        // load the layout HTML source into a temporary element
        //wrapper.innerHTML = layout;



        //resolve img sources  - update the 'src' attribute on img elements
        //
        // $layout.find("img[data-mm-tag]").each(function (i, ele) {
        //     var tag = $(ele).data('mm-tag');
        //
        // // });
        // // var arr = wrapper.querySelectorAll( 'img[data-mm-tag]' );
        // // Array.prototype.slice.call(arr).forEach(function(curElement) {
        // //     var tag = curElement.getAttribute('data-mm-tag');
        //     var mm = findMultimediaWithTagByMultimedia(tag, scMultimedia);
        //     if (mm) {
        //         var location = mm.property.location;
        //
        //         // curElement.setAttribute('src', location);
        //         $(ele).attr("src", location);
        //         multimedia.image.push(mm);
        //     }
        // });
        //
        // //resolve text (Assuming that text will be in a <span data-type='text'> tag
        // //arr = wrapper.querySelectorAll( 'span[data-type=\'text\'][data-mm-tag]' );
        // //Array.prototype.slice.call(arr).forEach(function(curElement) {
        //     //var tag = curElement.getAttribute('data-mm-tag');
        // $layout.find("span[data-type='text'][data-mm-tag]").each(function (i, ele) {
        //     var tag = $(ele).data('mm-tag');
        //
        //     var mm = findMultimediaWithTagByMultimedia(tag, scMultimedia);
        //     if (mm) {
        //         var content = mm.property.content;
        //
        //         curElement.textContent = content;
        //         multimedia.text.push(mm);
        //     }
        // });
        //
        // //resolve video sources
        // arr = wrapper.querySelectorAll( 'video > source[data-mm-tag]' );
        // Array.prototype.slice.call(arr).forEach(function(curElement) {
        //     var tag = curElement.getAttribute('data-mm-tag');
        //     var mm = findMultimediaWithTagByMultimedia(tag, scMultimedia);
        //     if (mm) {
        //         var location = mm.property.location;
        //
        //         curElement.setAttribute('src', location);
        //         curElement.setAttribute('webkit-playsinline', '' );
        //         multimedia.video.push(mm);
        //     }
        //     // strip elements from parent 'video' tag
        //     curElement.parentElement.removeAttribute( 'poster' );
        // });
        //
        //
        // //resolve link hrefs
        // arr = wrapper.querySelectorAll( 'a[data-mm-tag]' );
        // Array.prototype.slice.call(arr).forEach(function(curElement) {
        //     var tag = curElement.getAttribute('data-mm-tag');
        //     var mm = findMultimediaWithTagByMultimedia(tag, scMultimedia);
        //     if (mm) {
        //         var location = mm.property.location;
        //
        //         curElement.setAttribute('href', location);
        //         multimedia.link.push(mm);
        //     }
        // });
        //
        //
        // //resolve audio sources
        // arr = wrapper.querySelectorAll( 'audio > source[data-mm-tag]' );
        // Array.prototype.slice.call(arr).forEach(function(curElement) {
        //     var tag = curElement.getAttribute('data-mm-tag');
        //     var mm = findMultimediaWithTagByMultimedia(tag, scMultimedia);
        //     if (mm) {
        //         var location = mm.property.location;
        //
        //         curElement.setAttribute('src', location);
        //         multimedia.audio.push(mm);
        //     }
        // });
        //
        // // return the updated HTML source as a string
        // var htmlStr = wrapper.innerHTML;
        // callback(null, {content: htmlStr, multimedia: multimedia});
        //resolve img sources
        $layout.find("img[data-mm-tag]").each(function (i, ele) {
            var tag = $(ele).data('mm-tag');
            var mm = findMultimediaWithTagByMultimedia(tag, scMultimedia);

            if (mm) {
                var location = mm.property.location;
                console.log("resource: layout action: prepare data: tag=" + tag + " location=" + location +
                    " message=replacing image src");
                $(ele).attr("src", location);
                multimedia.image.push(mm);
            }
        });
        //resolve text (Assuming that text will be in a <span data-type='text'> tag
        $layout.find("span[data-type='text'][data-mm-tag]").each(function (i, ele) {
            var tag = $(ele).data('mm-tag');
            var mm = findMultimediaWithTagByMultimedia(tag, scMultimedia);

            if (mm) {
                var content = mm.property.content;
                console.log("resource: layout action: prepare data: tag=" + tag + " content=" + content +
                    " message=replacing text content");
                $(ele).text(content);
                multimedia.text.push(mm);
            }

        });

        //resolve video sources
        $layout.find("video > source[data-mm-tag]").each(function (i, ele) {
            var tag = $(ele).data('mm-tag');
            var mm = findMultimediaWithTagByMultimedia(tag, scMultimedia);

            if (mm) {
                var location = mm.property.location;
                console.log("resource: layout action: prepare data: tag=" + tag + " location=" + location +
                    " message=replacing video src");
                $(ele).attr("src", location);
                $(ele).attr("webkit-playsinline", ""); //For supporting inline video for iOS
                multimedia.video.push(mm);
            }
            // strip attributes from video tag
            $(ele).parent().removeAttr('poster');
        });

        //resolve link hrefs
        $layout.find("a[data-mm-tag]").each(function (i, ele) {
            var tag = $(ele).data('mm-tag');
            var mm = findMultimediaWithTagByMultimedia(tag, scMultimedia);

            if (mm) {
                var location = mm.property.location;
                console.log("resource: layout action: prepare data: tag=" + tag + " location=" + location +
                    " message=replacing link href");
                $(ele).attr("href", location);
                multimedia.link.push(mm);
            }

        });

        //resolve audio sources
        $layout.find("audio > source[data-mm-tag]").each(function (i, ele) {
            var tag = $(ele).data('mm-tag');
            var mm = findMultimediaWithTagByMultimedia(tag, scMultimedia);

            if (mm) {
                var location = mm.property.location;
                console.log("resource: layout action: prepare data: tag=" + tag + " location=" + location +
                    " message=replacing audio stc");
                $(ele).attr("src", location);
                multimedia.audio.push(mm);

            }

        });
        var html = $layout.html();
        callback(null, {content: html, multimedia: multimedia});

    };



};


;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/* global dexit, $ */

dexit.PresentationClient = function (presentationUrl) {
    this.url = presentationUrl;

    this.createPlaylist = function (touchpointId, channelId, channelTypeId, scheduleData, userId, token, callback) {

        var theUserId = (userId && _.isObject(userId) ? userId.id : userId);
        var body = {
            scheduleData: scheduleData,
            channelId: channelId,
            channelTypeId: channelTypeId,
            touchpointId: touchpointId,
            userId: theUserId
        };



        var url = this.url + '/scpm/playlist_resolution';


        let request = new Request(url, {
            method: 'post',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? 'Bearer ' + token : undefined
            },
            body: JSON.stringify(body)
        });

        fetch(request).then((data) => {
            console.log("resource:playlist, action:create result:success");
            // callback(null,res.json());
            if (data.status === 200) {
                return data.json();
            } else {
                throw new Error('unexpected response:' + data.status);
            }
        }).then(res => {
            callback(null, res, scheduleData);
        }).catch((err) => {
            console.log("resource:playlist , action:create , error:" + JSON.stringify(err));
            callback(err);
        });

        // $.ajax({
        //     type: 'POST',
        //     url: url,
        //     data: JSON.stringify(body),
        //     crossDomain: true,
        //     contentType: 'application/json',
        //     beforeSend: function (xhr) {
        //         if (token) {
        //             xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        //         }
        //     }
        //
        // }).done(function (data) {
        //
        //     callback(null, data, scheduleData);
        // }).fail(function (xhr, textStatus, errorThrown) {
        //
        //     callback(xhr);
        //
        // });

    };
};
;/*jslint browser: true */
/*jslint devel: true */
/*global dexit, _ */

/**
 * Initialize the ElementHandler
 * @param {object} config - Confoguration object
 * @param {string} config.presentationUrl - URL for sc-presentation
 * @param {object} params - Configuration Parameters
 * @param {string} params.user - User profile Identifier
 * @constructor
 */
dexit.MultimediaHandler = function (config, params, presentationClient,layoutProcessorLib) {
    'use strict';
    var userId;
    var authToken = (config && config.authToken ? config.authToken : '');
    var scPresentationClient = presentationClient || new dexit.PresentationClient(config.presentationUrl);
    if (params && params.user) {
        userId = params.user;
    }
    var layoutProcessor = layoutProcessorLib || new dexit.LayoutProcessor();


    function setUser(user){
        userId = user;
    }

    /**
     * @type PlayItem
     * @param {object} [playItem.layoutId] - layout identifier
     * @param {object} [playItem.multimedia] - multimedia object
     * @param {object} [playItem.multimedia.id] - multimedia identifier
     * @param {object} playItem.scId - Smart Content Identifier
     * @param {object} playItem.repository - Smart Content Repo
     */

    /**
     * Required to be able to resolve layout/multimedia etc from sc-presentation as the current implementation of it assumes scheduleData
     * @param {PlayItem} playItem - multimedia item(s) to display
     * @returns {object} - scheduleData formatted object
     * @private
     */
    function _buildScheduleDataObj(playItem) {

        var parameters = [];
        if (playItem.layoutId) {
            parameters.push({'key':'layout', 'value':playItem.layoutId});
        }
        if (playItem.multimedia && playItem.multimedia.id) {
            parameters.push({'key':'multimedia', 'value':playItem.multimedia.id});
        }

        return {
            contentRepo: playItem.repository,
            scheduledContent: [{
                id: playItem.scId,
                contentRepo: playItem.repository,
                parameters: parameters
            }]
        };
    }


    /**
     * Prepare item to be displayed
     * @param {object} touchpoint - touchpoint instance
     * @param {string} touchpoint.touchpoint - touchpoint identifier
     * @param {string} touchpoint.channel_id - channel identifier
     * @param {string} touchpoint.channel_type_ id - channel type identifier
     * @param {PlayItem} playItem - element to show
     * @param callback
     */
    var initPlayItem = function(touchpoint, playItem, callback) {

        const theUserId = (userId && userId.id ? userId.id : 'default');
        async.auto({
            checkCache: function(cb) {
                if (playItem && playItem.multimedia && playItem.multimedia.id) {
                    //check cache (cache depends on with user)
                    let key = 'mm-' +touchpoint.touchpoint + '-' + playItem.scId + '-' + playItem.multimedia.id + '-' + theUserId;
                    AsyncStorage.getItem(key, (err, data) => {
                        if (data) {
                            let toReturn = JSON.parse(data);
                            cb(null, toReturn);
                        } else {
                            cb();
                        }
                    });
                }else {
                    cb();
                }

            },
            checkService: ['checkCache', function(result, cb) {
                if (result.checkCache) {
                    return cb(null,result.checkCache);
                }
                var scheduleData = _buildScheduleDataObj(playItem);
                scPresentationClient.createPlaylist(touchpoint.touchpoint, touchpoint.channel_id,
                    touchpoint.channel_type_id, scheduleData, userId, authToken, function(err, result) {
                        if (err) {
                            return cb(err);
                        } else {
                            if (playItem && playItem.multimedia && playItem.multimedia.id) {
                                let key = 'mm-' + touchpoint.touchpoint + '-' + playItem.scId + '-' + playItem.multimedia.id + '-' + theUserId;
                                AsyncStorage.setItem(key, JSON.stringify(result));
                            }
                            cb(null, result);
                        }
                });
            }]
        }, function(err, res) {
            //TODO: Can change after SC-477
            if (err) {
                return callback(err);
            } else {
                let result = res.checkService;
                if (result && _.isArray(result)&& result.length > 0) {
                    var playItem = result[0];
                    layoutProcessor.prepareLayout(playItem.layout, playItem.multimedia, function(err, parsedLayout) {
                        var toReturn = {
                            layout: parsedLayout.content,
                            multimedia: parsedLayout.multimedia
                        };
                        callback(null,toReturn);
                    });
                } else {
                    callback(new Error('Empty playItem'));
                }
            }

        });


        //TODO: if the playItem is not "dynamic" then can should bypass sc-presentation,
        //debugger;


    };

    return {
        initPlayItem: initPlayItem,
        setUser: setUser
    };

};


;/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/* global, dexit, _, Base64, async, PubSub */

/**
 * @typedef {object} PresentationPlugin
 * @property {Function} setErrorStatus - if an error occurs will pass it to presentation (ie. setErrorStatus(new Error('error') )
 * @property {Function} prepareMasterContainer - Have presentation prepare container. Likely to change (ie. prepareMasterContainer('html fragment here')
 * @property {Function} show - Present element with first parameter being presentation element (ie. show(pres, callback) )
 * @see {@link ShowParams}
 */

/**
 * @typedef {object} ShowParams - plus other fields
 * @property {object} refs
 * @property {string} refs.presentationRef
 * @property {string} refs.regionRef
 * @property {string} refs.layoutRef
 * @property {object} [presentation]
 * @property {object} [nextElement]
 * @property {Function} callback
 */

/**
 * Presentation Engine Management
 * @param {object} config
 * @param {string} config.lmUrl - Url for layout management service
 * @param {object} params - Additional parameters to use
 * @param {string} params.user - User identifier
 * @param {object} [params.touchpoint] - Touchpoint instance
 * @param {PresentationPlugin} plugin
 * @param {dexit.MultimediaHandler} mmHandler
 * @param {object} dexRequestUtil
 * @param {Function} dexRequestUtil.XHRRequestWithRetry
 * @constructor
 */
dexit.PresentationMng = function(config, params, plugin, mmHandler, dexRequestUtil){
    'use strict';


    if (!config) {
        throw new Error('config is required');
    }

    if (!plugin) {
        throw new Error('no plugin configured for presentation');
    }

    this.lmURL = config.lmUrl;

    var mmParams = params || {};

    if (params.touchpoint) {
        this.touchpoint = params.touchpoint;
    }

    if (dexit.device.sdk.getUser()) {
        mmParams.user = dexit.device.sdk.getUser();
    }

    this.plugin = plugin;

    this.multimediaHandler = mmHandler || new dexit.MultimediaHandler(config,mmParams);

    this.dexRequestUtil = dexRequestUtil || dexit.scp.device.request;

    //TODO: look at removing next element being sent automatically
    function resolveNextElement(data) {
        if (data.nextElement[0].type && data.nextElement[0].type === 'behaviour') {
            try {
                var scId = data.nextElement[0].scId;
                var smartcontent = dexit.scp.device.management.scmanager.smartcontent.object[scId];

                if (!smartcontent) {

                } else {
                    var nextElementType = smartcontent.behaviour[data.nextElement[0].typeId];
                    data.nextElement[0].property = nextElementType.property;

                }
            }catch (e){

            }
        }
        return data.nextElement;
    }

    /**
     * @callback PresentationMng~retrieveLayoutCallback
     * @param {Error} [error] - if unable to retrieve layout
     * @param {object} layout
     * @param {object} layout
     */

    /**
     * Retrieve layout based on identifier with cache.
     * @param {string} layoutId - layout identifier
     * @param {PresentationMng~retrieveLayoutCallback} callback
     * @private
     */
    this._retrieveLayout  = function(layoutId, callback) {

        if (!layoutId || layoutId.length < 1) {
            return callback(new Error('layoutId is required'));
        }

        var toPass =  (_.isArray(layoutId) ? layoutId[0] : layoutId);
        debugger;

        AsyncStorage.getItem('layout-'+toPass, (err, data) => {
            if (data) {
                let toReturn = JSON.parse(data);
                toReturn.id = toPass;
                callback(null,toReturn);
            } else {
                var resource ='/layout/' + encodeURIComponent(toPass),
                    headers = { Accept : 'application/json'},
                    query ={},
                    numRetries = 0,
                    maxRetries= 2,
                    url_base = this.lmURL;
                this.dexRequestUtil.XHRRequestWithRetry(url_base,'GET', resource, headers, query, null, numRetries, maxRetries, (err, data) => {
                    if (err) {
                        console.warn('could not load layout to device');
                        return callback(err);
                    }
                    data.id = toPass;
                    //make sure id is passed back with layout
                    debugger;

                    AsyncStorage.setItem('layout-'+toPass, JSON.stringify(data), (err2) => {
                        if (err2) {
                            console.warn('could not save layout to device');
                        }

                        callback(null, data);
                    });
                });
            }

        });



    };

    this._resolveIntelligencePresentation = function(isDynamic, dynamicEpt, data, intelResult, callback) {
        //TODO: generalize for any intelligence (this is only for intelligence for EPs)


        var presentationRef = data.presentationRef || 'default';


        if (presentationRef === 'embedded') {



            //make current EP layout the parent layout, pass in containerRef
            //in parser make sure to set container to an expression with:
            // #parentDivId div[data-region="' + regionRef + '"]'
            dexit.device.sdk.presentationMng._retrieveLayout(data.layoutRef, function (err, layout) {
                if (err) { //for now just retrieve the whole layout and get the container reference
                    return callback(err);
                }
                var container = layout.container;

                //intelResult


                //set layout relative to the container for the current layout and inside of the region
                var overrideContainer = container + ' div[data-region="' + data.regionRef + '"]';

                if (intelResult.epId) {//then need to load EP
                    var epId = (intelResult.revision ? intelResult.epId + '-' + intelResult.revision : intelResult.epId);
                    dexit.device.sdk.loadEngagementPattern(epId, overrideContainer, function (err) {
                        callback(null, {skip: true});
                    });
                } else { //passed in data is an ep
                    var toPass = intelResult;
                    toPass.overrideContainer = overrideContainer;
                    dexit.device.sdk.loadEngagementPatternByEvent(toPass, function (err) {
                        callback(null, {skip: true});
                    });
                }

            });


        } else if (dynamicEpt) {
            //look at mm for now only

            if (intelResult.type === 'multimedia') {
                //add layout
                var src = intelResult.multimedia[intelResult.subType][0];

                if (intelResult.subType === 'image') {
                    intelResult.layout = '<img src=\"'+src.location+'\" alt=\"element mm\" data-mm-tag=\"ep-dynamic-mm-0\">';
                }else if (intelResult.subType === 'text') {
                    intelResult.layout = '<span data-type="text" data-mm-tag="ep-dynamic-mm">'+src.content+'</span>';
                }else if (intelResult.subType === 'video') {
                    intelResult.layout = "<video controls><source data-mm-tag='ep-dynamic-mm-0' src='"+src.location+"' type='video/mp4'/></video>";
                }else if (intelResult.subType === 'link') {
                    intelResult.layout = '<a href="'+src.location+'"</a>';
                }
                intelResult.direct = true;
                callback(null, intelResult);

            }else if (intelResult.type === 'behaviour') {
                intelResult.direct = true;
                if (!intelResult.presentation) {
                    callback(null, {
                        mode:'inline'
                    });
                }else {
                    callback(null, intelResult.presentation);
                }



            } else {
                if (intelResult.presentation) {

                    callback(null, intelResult.presentation);
                    //if presentation is specified then pass it along

                }else {
                    callback(null,{skip:true});
                }


            }

        }else { //for default (icon)

            var name = data.currentElement.value.description || 'SeService';
            var imgSrc = (data.currentElement.value.presentationRefArgs && data.currentElement.value.presentationRefArgs.iconLink ?
                data.currentElement.value.presentationRefArgs.iconLink : '');
            //Workaround for
            if (isDynamic) {
                name = name.replace('Latest for', '');
            }

            //for default if data.p

            if (imgSrc) {
                var presentation = {
                    // html: '<div style="display:inline-block;vertical-align:top;margin-right:14px;margin-bottom:14px;border:none !important;box-shadow:0 0 11px #888888;" class="text-center" role="button">' +
                    //     '<img src="' + imgSrc + '" class="img-responsive">' +
                    //     '<span class="name-only-fix">' + name + '</span>' +
                    //     ' </div>',
                    // name: name
                    html: '<div class="text-center" role="button">' +
                        '<img src="'+imgSrc+'" class="img-responsive">' +
                        '<span class="name-only-fix">' + name + '</span>' +
                        ' </div>',
                    name: name
                };
            }else {
                var presentation = {
                    html: //'<div role="button">' +
                        '<span class="">' + name + '</span>', //+
                    //' </div>',
                    name: name
                };
            }


            //for large screen
            // var presentation = {
            //     html: '<div style="display:inline-block;vertival-align:top;margin-right:14px;margin-bottom:14px;border:none !important;box-shadow:0 0 11px #888888;" class="text-center" role="button">' +
            //     '<img src="'+imgSrc+'" class="img-responsive">' +
            //     '<span class="name-only-fix">' + name + '</span>' +
            //     ' </div>',
            //     name: name
            // };
            callback(null, presentation);
        }
    };

    this._resolveDynamicIntelligence = function(data, callback) {
        var args = {};
        if (data.currentElement.value.typeId && data.currentElement.value.typeId.indexOf('{{ept.dynamic') !== -1 ) {

            var previous = (data.previousElement && data.previousElement.value ? data.previousElement : {});
            var eptType = (data.previousElement && data.previousElement.value.type ? data.previousElement.value.type: '');
            if (eptType === 'behaviour') {

                try {
                    var sc = dexit.scp.device.management.scmanager.smartcontent.object[data.previousElement.value.scId];
                    var behaviour = sc.behaviour[data.previousElement.value.typeId];

                    var parsed = JSON.parse(behaviour.property.ds);
                    previous.eptId = parsed.id;
                }catch(e) {
                    console.log('error trying to parse previous behaviour');
                }

            }

            args = _.extend({dynamicEpt:true, previous:previous, elementId: data.currentElement.id },data.currentElement.value.args);


            if (dexit.device.sdk.getUser()) {
                args.userId = dexit.device.sdk.getUser();
            }

        }else {
            args = data.currentElement.value.args;
        }

        //QF: avoid circular referent
        var currElem = _.cloneDeep(data.currentElement.value);
        if (currElem.args && currElem.args.currentElement) {
            try {
                delete currElem.args.currentElement;
            }catch (e) {

            }
        }
        args.currentElement =  currElem;


        //For preview only, send TP id
        var body = {
            type:'intelligence',
            data: args,
            touchpointId:dexit.device.sdk.getTouchpoint().touchpoint,
        };

        if (args.type && args.type === 'campaign_dynamic' && args.dynamicEpt) {
            //check cache
            let key = args.type + '-' + args.userId + '-' + args.tag;
            AsyncStorage.getItem(key, (err, cached) => {
               if (cached) {
                   let toReturn = JSON.parse(cached);
                   callback(null,toReturn);
               }else {
                   //either err or no data
                   var resource ='/resolve',
                       headers = { Accept : 'application/json'},
                       query ={},
                       numRetries = 0,
                       maxRetries= 2,
                       url_base = dexit.bccProxyUrl + '/bcc';
                   this.dexRequestUtil.XHRRequestWithRetry(url_base,'POST', resource, headers, query, body, numRetries, maxRetries, (err2, data) => {
                       //if err is a 404 then there is not match...for now skip caching
                       if (err2 || !data) {
                           console.log('problem retrieving dynamic intelligence or no dynamic intelligence exists for parameters');
                           callback(err);
                       }else {
                           AsyncStorage.setItem(key, JSON.stringify(data), (err3) => {
                                if (err3) {
                                    console.log('could not save dynmic intelligence in cache');
                                }
                                callback(null,data);
                           });
                       }
                   });

               }
            });


        }


    };

    this._resolveEPIntelligence = function(data, callback) {
        //get eptId
        var eptId = '';
        var body = {
            eptType: (data.previousElement && data.previousElement.value.type ? data.previousElement.value.type: ''),
            eptId: eptId,//previous element
            tpId:dexit.device.sdk.getTouchpoint().touchpoint,
        };
        var eptType = body.eptType;

        if (eptType === 'behaviour') {
            var sc = dexit.scp.device.management.scmanager.smartcontent.object[data.previousElement.value.scId];
            var behaviour = sc.behaviour[data.previousElement.value.typeId];
            try {
                var parsed = JSON.parse(behaviour.property.ds);
                body.eptId = parsed.id;
            }catch(e) {

            }
        }


        if (dexit.device.sdk.getUser()) {
            body.userId = dexit.device.sdk.getUser();
        }

        var resource ='/ep-recommender',
            headers = { Accept : 'application/json'},
            query ={},
            numRetries = 0,
            maxRetries= 2,
            url_base = '/epm';
        this.dexRequestUtil.XHRRequestWithRetry(url_base,'POST', resource, headers, query, body, numRetries, maxRetries, callback);

    };

    this._resolveIntelligence = function(data, callback) {


        //
        //
        // if (  (data.currentElement.value.args && data.currentElement.value.args.epId) || (data.currentElement.value.typeId && data.currentElement.value.typeId.indexOf('{{ep.recommended}}') !== -1) ) {
        //
        //
        //     //if embedded then skip showing , otherwise if icon pass it along
        //
        //     this._resolveIntelligence(data, function (err, toPassInt) {
        //         if (err) {
        //             return cb(err);
        //         }
        //         //prepare presentation of EP
        //         toPass.intelligence = toPassInt;
        //
        //         cb(null, toPass);
        //     });
        //

        // } else if(data.currentElement.value.typeId && data.currentElement.value.typeId.indexOf('{{ep.recommended}}') !== -1) {
        //     this._resolveEPIntelligence(data,function(err, toPassInt){
        //         if (err){
        //             return cb(err);
        //         }
        //         //ep to show
        //         toPassInt.epSchemaVersion = 2;
        //         var timeId = Date.now();
        //         var toPass = {
        //             engagementPattern: {
        //                 pattern:toPassInt,
        //                 isActive: true,
        //                 id:'recommended-'+timeId
        //             },
        //         };
        //
        //         //also need to consider:
        //         //if data.presentationRef === 'embedded', record data.regionRef and reference to parent container
        //         if (data.presentationRef && data.presentationRef === 'embedded') {
        //             //make current EP layout the parent layout, pass in containerRef
        //             //in parser make sure to set container to an expression with:
        //             // #parentDivId div[data-region="' + regionRef + '"]'
        //             dexit.device.sdk.presentationMng._retrieveLayout(data.layoutRef, function(err, layout) {
        //                 if (err) { //for now just retrieve the whole layout and get the container reference
        //                     return cb(err);
        //                 }
        //                 var container = layout.container;
        //
        //                 //set layout relative to the container for the current layout and inside of the region
        //                 toPass.overrideContainer = container + ' div[data-region="'+data.regionRef+'"]';
        //                 dexit.device.sdk.loadEngagementPatternByEvent(toPass, function(err){
        //                     cb(null, {skip:true});
        //                 });
        //
        //             });
        //
        //
        //
        //         }
        //
        //     });
        // } else {
        //     cb(null,toPass);
        // }



        var self = this;


        var recommendationEP = (data.currentElement.value.typeId && data.currentElement.value.typeId.indexOf('{{ep.recommended}}') !== -1 ? true: false);
        var dynamicEpt = (data.currentElement.value.typeId && data.currentElement.value.typeId.indexOf('{{ept.dynamic') !== -1 ? true: false);

        var isDynamic = (data.currentElement.value.args && data.currentElement.value.args.epId && data.currentElement.value.args.epId.indexOf('{{') !== -1 ? true: false);


        async.auto({
            intelParams: function(cb) {

                if (recommendationEP) {
                    self._resolveEPIntelligence(data, function (err, toPassInt) {
                        if (err) {
                            return cb(err);
                        }
                        //ep to show
                        toPassInt.epSchemaVersion = 2;
                        var timeId = Date.now();
                        var toPass = {
                            engagementPattern: {
                                pattern: toPassInt,
                                isActive: true,
                                id: 'recommended-' + timeId
                            }
                        };
                        cb(null, toPass);
                    });
                } else {

                    if (isDynamic || dynamicEpt) {
                        self._resolveDynamicIntelligence(data, cb);
                    } else {
                        cb(null, {epId: data.currentElement.value.args.epId});
                    }

                }
            },
            presentation: ['intelParams', function(result, cb) {
                var intelRes = result.intelParams;

                self._resolveIntelligencePresentation(isDynamic,dynamicEpt, data,intelRes,cb);
            }]
        }, function(err, results) {
            if (err) {
                return callback(err);
            }
            var res= results.intelParams;
            res.presentation = results.presentation;
            callback(null, res);

        });


    };

    /**
     *
     * @param {string} str - base64 encoded string
     * @returns {string} decoded string
     * @private
     */
    this._base64Decode = function(str) {
        return Base64.decode(str);
        // return atob(str);
    };

    this._updateElementIntelligenceInfo = function (eg, currentElementId, intel) {


        if (intel && intel.epId) {

            let params = { presentationElementType: 'ep', presentationElement: intel.epId };
            if (intel.presentation && intel.presentation.html) {
                params.presentationMode = 'icon'
            }else {
                params.presentationMode = 'embedded';
            }

            this._updateElementInfo(eg, currentElementId, {}, params);
        } else {
            console.warn('no handling for intelligence: %o', intel);

        }


    };


    this._updateElementMMInfo = function(eg, currentElementId, key, mm) {

        //mm contains : audio, video, image, link, text
        //find first non empty one
        function getMMInfo(mmObj) {

            if (mmObj.video.length > 0) {
                return {
                    type: 'video',
                    data: mmObj.video[0].property.location
                }
            }
            if (mmObj.audio.length > 0) {
                return {
                    type: 'audio',
                    data: mmObj.audio[0].property.location
                };
            }
            if (mmObj.image.length > 0) {

                return {
                    type: 'image',
                    data: mmObj.image[0].property.location
                };
            }
            if (mmObj.text.length > 0) {
                return {
                    type: 'text',
                    data: mmObj.text[0].property.content
                };

            }
            if (mmObj.link.length > 0) {
                return {
                    type: 'link',
                    data: mmObj.link[0].property.location
                }
            }
        }
        var mmValue = getMMInfo(mm);
        if (!mmValue) {
            return;
        }

        this._updateElementInfo(eg, currentElementId, {presentation_multimedia: mmValue.data},{presentationElementType: mmValue.type, presentation_multimedia: mmValue.data});

    };

    this._updateElementInfo = function(eg, currentElementId, keyValues, params) {

        var em = dexit.device.sdk.getExecutionManager();
        em._setElementValueProperty(eg, currentElementId, keyValues, params);
    };


    /**
     *
     * @param {object} data
     * @param {string} data.epId - Execution Pattern Id
     * @param {object} data.currentElement
     * @param {string} data.currentElement.id - current pattern element id
     * @param {string} data.id - Execution Id
     * @param {ExecutionGraph} [data.egReference] - reference to current execution graph
     * @param {string/string[]} [data.layout] - layout (only passed if data.type === 'start')
     * @param {string/string[]} [data.overrideContainer] - (only passed if data.type === 'start' and if an override was sent) put layout inside of this element on the page
     * @param {string} data.type - Element Type to display ("multimedia" or "behaviour")
     * @param {object} [data.properties] - additional properties for the element
     * @param {object} data.data - Data related to showing.  For multimedia this can have data.data.layout or data.data.
     * @param callback - callback (useful for testing)
     */
    this.showElement = function(data, callback) {
        var self = this;
        var egReference = data.egReference;
        //noop
        callback = callback || function () {};


        //skip specific elements of EP
        if (data.type === 'end' || data.type === 'decision') {
            return callback();
        }
        if (data.type === 'start') {
            // find master layout and return it
            self._retrieveLayout(data.layout, function (err, layout) {
                if (err) { //add error handling so blank screen is not presented to consumer

                    self.showError(new Error('could not configure layout'));
                    // PubSub.publish('dexit.ep.executionResponse  ', data);
                    return callback(err);
                } else {
                    var decoded = self._base64Decode(layout.content);


                    //if data.overrideContainer
                    var containerRef = (data.overrideContainer ? data.overrideContainer : layout.container);


                    //Make masterContainer a composite of epId + revision + layout.id

                    var uniqueLayoutId =  data.epId + '@' +layout.id + (data.overrideContainer ? '@'+data.overrideContainer: '' );

                    plugin.prepareMasterContainer(uniqueLayoutId, containerRef, decoded);
                    // PubSub.publish('dexit.ep.executionResponse', data);
                    return callback();
                }
            });
        } else {

            if (data.nextElement && data.nextElement.length > 0) {
                data.nextElement = resolveNextElement(data);
            }

            async.auto({
                prepareElement: function (cb) {
                    var toPass = data.data;
                    //attempt to localize/personalize multimedia
                    if (data.type === 'multimedia') {
                        var touchpoint = self.touchpoint || dexit.device.sdk.getTouchpoint();

                        self.multimediaHandler.initPlayItem(touchpoint, toPass, function(err, res) {
                            if (err){
                                return cb(err);
                            }

                            //there will be multimedia and layout in resolved, update current EG with multimedia that was resolved
                            self._updateElementMMInfo(egReference,data.currentElement.id,'presentation_multimedia',res.multimedia);
                            cb(null,res);
                        });
                    } else if (data.type === 'behaviour') {
                        //pass along any presentation parts right now
                        try {
                            var smartContent = dexit.scp.device.management.scmanager.smartcontent.object[data.currentElement.value.scId];
                            var beh = smartContent.behaviour[data.typeId];
                            //should resolve presentation ref here
                            var pre = beh.property.display || {};
                            if (_.isString(pre)) {
                                pre = JSON.parse(pre);
                            }
                            toPass.presentation = pre;

                        } catch (e) {

                        }
                        cb(null, toPass);
                    } else if (data.type === 'intelligence') {
                        if (  (data.currentElement.value.args && data.currentElement.value.args.epId) || (data.currentElement.value.typeId && data.currentElement.value.typeId.indexOf('{{ep') !== -1) ) {
                            //if embedded then skip showing , otherwise if icon pass it along
                            self._resolveIntelligence(data, function (err, toPassInt) {
                                if (err) {
                                    return cb(err);
                                }
                                //prepare presentation of EP

                                if (toPassInt && (toPassInt.skip || toPassInt.direct)) { //if should skip presenting directly in later step (ie. when loading EP embedded in EP)
                                    //update previous with resolved mm
                                    if (toPassInt.multimedia) {
                                        self._updateElementMMInfo(egReference,data.currentElement.id,'presentation_multimedia',toPassInt.multimedia);
                                    }

                                    cb(null,toPassInt);
                                } else {
                                    toPass.intelligence = toPassInt;

                                    self._updateElementIntelligenceInfo(egReference,data.currentElement.id, toPassInt)

                                    cb(null, toPass);
                                }
                            });


                            // } else if(data.currentElement.value.typeId && data.currentElement.value.typeId.indexOf('{{ep.recommended}}') !== -1) {
                            //
                            //     self._resolveEPIntelligence(data,function(err, toPassInt){
                            //         if (err){
                            //             return cb(err);
                            //         }
                            //         //ep to show
                            //         toPassInt.epSchemaVersion = 2;
                            //         var timeId = Date.now();
                            //         var toPass = {
                            //             engagementPattern: {
                            //                 pattern:toPassInt,
                            //                 isActive: true,
                            //                 id:'recommended-'+timeId
                            //             },
                            //         };
                            //
                            //         //also need to consider:
                            //         //if data.presentationRef === 'embedded', record data.regionRef and reference to parent container
                            //         if (data.presentationRef && data.presentationRef === 'embedded') {
                            //             //make current EP layout the parent layout, pass in containerRef
                            //             //in parser make sure to set container to an expression with:
                            //             // #parentDivId div[data-region="' + regionRef + '"]'
                            //             dexit.device.sdk.presentationMng._retrieveLayout(data.layoutRef, function(err, layout) {
                            //                 if (err) { //for now just retrieve the whole layout and get the container reference
                            //                     return cb(err);
                            //                 }
                            //                 var container = layout.container;
                            //
                            //                 //set layout relative to the container for the current layout and inside of the region
                            //                 toPass.overrideContainer = container + ' div[data-region="'+data.regionRef+'"]';
                            //                 dexit.device.sdk.loadEngagementPatternByEvent(toPass, function(err){
                            //                     cb(null, {skip:true});
                            //                 });
                            //
                            //             });
                            //
                            //
                            //
                            //         } else {
                            //             //show icon???
                            //
                            //             dexit.device.sdk.loadEngagementPatternByEvent(toPass, function(err){
                            //                 cb(null, {skip:true});
                            //             });
                            //         }
                            //
                            //     });
                        } else {
                            cb(null,toPass);
                        }

                    } else {
                        // otherwise just pass along

                        cb(null, toPass);
                    }
                },
                show: ['prepareElement', function (results,cb) {

                    //data must be passed to player
                    var toShow = results.prepareElement || data.data;

                    if (toShow.skip) {
                        return cb();
                    }
                    if (data.nextElement) {
                        toShow.nextElement = data.nextElement;
                    }
                    if (data.previousElement) {
                        toShow.previousElement = data.previousElement;
                    }
                    if (data.currentElement && data.currentElement.id) {
                        toShow.id = data.currentElement.id;
                    }
                    if (data.currentElement ) {
                        toShow.currentElement = data.currentElement;
                    }


                    if (data.instanceTime) {
                        toShow.instanceTime = data.instanceTime;
                    }

                    if (data.presentationStyle) {
                        toShow.presentationStyle = data.presentationStyle;
                    }
                    var refs = {
                        presentationRef:data.presentationRef,
                        regionRef:data.regionRef,
                        layoutRef:data.layoutRef,
                        epId:data.epId,
                        scId: (data.currentElement && data.currentElement.value && data.currentElement.value.scId ? data.currentElement.value.scId : '')
                    };
                    if (data.overrideScId) {
                        refs.overrideScId = data.overrideScId;
                    }

                    //if this is being shown embedded in another EP then pass along the override container to help resolve
                    if (data.egReference  && data.egReference.overrideContainer) {
                        refs.overrideContainer = data.egReference.overrideContainer;
                    }

                    _.extend(toShow,refs);
              //      alert('show content');
                    self.plugin.show(toShow, cb);
                }]
            }, function (err) {
                if (err) {
                    //log error

                    self.showError(err);
                }
                //TODO: look at changing from message to callback
                //respond with data (that contains the id) to notify the completion of execution
                //PubSub.publish('dexit.ep.executionResponse', data);
                //callback();
                callback();
            });
        }
    };

    this.showError = function(error) {
        this.plugin.setErrorStatus(error);
    };

};

module.exports = {
    dexit: dexit
};

// export default function() {
//     return window.dexit;
// }

//
//
// export function dex() {
//     return window.dexit;
// }

