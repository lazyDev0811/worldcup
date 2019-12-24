/**
 * Copyright Digital Engagement Xperience 2017-2019
 */
/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/* global async, jsonata, dexit, bccLib, PubSub, _, $, videojs,  ReactNativeWebView */

const SKIP_VALIDATION = true;

var defaultFormArrayTemplate  = '<div id="<%= id %>"><ul class="_jsonform-array-ul" style="list-style-type:none;"><%= children %></ul><span class="_jsonform-array-buttons"><a href="#" class="btn btn-default _jsonform-array-addmore"><i class="glyphicon glyphicon-plus-sign" title="Add new"></i></a> <a href="#" class="btn btn-default _jsonform-array-deletelast"><i class="glyphicon glyphicon-minus-sign" title="Delete last"></i></a></span></div>';

var topupFormArrayTemplate = `<div id="<%= id %>"><ul class="_jsonform-array-ul" style="list-style-type:none;"><%= children %></ul>
     <span class="_jsonform-array-buttons">
         <a href="#" class="btn btn-secondary _jsonform-array-addmore">Add Another Number
             </a>
              &nbsp;    
             <a href="#" class="btn btn-secondary _jsonform-array-deletelast">Remove Last Number</a></span></div>`;


JSONForm.fieldTypes['transactionTitle'] = jQuery.extend(true, {}, JSONForm.fieldTypes['text']);
JSONForm.fieldTypes['transactionTitle'].template = `<div class="heading-wrraper margin-bottom-total-trans-detail">
                <div class="top-heading">
                    <h3 type="text">Transaction #<%= value %></h3>
                </div>
            </div>`;

JSONForm.fieldTypes['title'] = jQuery.extend(true, {}, JSONForm.fieldTypes['help']);
    JSONForm.fieldTypes['title'].template = `<div class="heading-wrraper">
                <div class="top-heading">
                    <h3><%= elt.helpvalue %></h3>
                </div>
            </div>`;




JSONForm.fieldTypes['totalAmountReceipt'] = jQuery.extend(true, {}, JSONForm.fieldTypes['help']);
JSONForm.fieldTypes['totalAmountReceipt'].template = `<div id="" class="margin-bottom-10 balance-value"><div class="recpt-title">
<span class="float-left">Top-up Amount</span>
<span total-amount="amount" class="green float-right" style="margin-left: 18%;">15</span>
</div></div>`;

var totalAmountReceiptTimer = null;
JSONForm.fieldTypes['totalAmountReceipt'].onInsert =function (data, node) {
    // Compute the value of "myvalue" here
    if (totalAmountReceiptTimer) {
        clearInterval(totalAmountReceiptTimer);
    }
    totalAmountReceiptTimer = setInterval(function() {
        var sum = 0;
        $('[name$="amount"]').each(function(){
            var val = $(this).val() || 0;
            sum = sum + parseFloat(val);
        });
        if (sum > 0) {
            $('span[total-amount="amount"]').text(sum);
        }

    }, 2000);
};

var totalAmountTimer = null;

JSONForm.fieldTypes['totalAmount'] = jQuery.extend(true, {}, JSONForm.fieldTypes['help']);

    // JSONForm.fieldTypes['totalAmount'].template =`<div id="<%= id %>" class="total-wraper margin-bottom-10">
    //         <span total-amount="amount" class="amunt"><%= value %></span>
    //     </div>`;
    JSONForm.fieldTypes['totalAmount'].template =`<div id="<%= id %>" class="margin-bottom-10 balance-value">
            <span><%= elt.title2 %> &nbsp; <span/><span total-amount="amount" class="green"><%=  value %></span>
        </div>`;
// template: '<span total-amount="true" id="<%=node.id%>"><%=value%></span>',
JSONForm.fieldTypes['totalAmount'].onInsert =function (data, node) {
  // Compute the value of "myvalue" here
  if (totalAmountTimer) {
    clearInterval(totalAmountTimer);
  }
  totalAmountTimer = setInterval(function() {
    var sum = 0;
    $('[name$="amount"]').each(function(){
        var val = $(this).val() || 0;
        sum = sum + parseInt(val);
    });
    if (sum > 0) {
        $('span[total-amount="amount"]').text(sum);
    }

  }, 1000);
};

    var totalAmountMineTimer = null;

    JSONForm.fieldTypes['totalAmountMine'] = jQuery.extend(true, {}, JSONForm.fieldTypes['help']);
    JSONForm.fieldTypes['totalAmountMine'].template =`<div id="<%= id %>" class="margin-bottom-10 balance-value">
            <span><%= elt.title2 %> &nbsp; <span/><span total-amount="amount" class="green"><%=  value %></span>
        </div>`;
    JSONForm.fieldTypes['totalAmountMine'].onInsert =function (data, node) {
    // Compute the value of "myvalue" here
    if (totalAmountMineTimer) {
            clearInterval(totalAmountMineTimer);
    }
        totalAmountMineTimer = setInterval(function() {
        var sum = 0;

        var manualAmount = $('[name$="amountManual"]').val();
        var selectedAmount = $('[name$="amountPredefined"]').val();
        if (manualAmount) {
            sum += parseFloat(manualAmount);
        } else if  (selectedAmount) {
            sum += parseFloat(selectedAmount);
        }

        $('[name$="topupmine[0].amount"]').val(sum);
        $('span[total-amount="amount"]').text(sum);

    }, 1000);
};


JSONForm.fieldTypes['subTitle'] = jQuery.extend(true, {}, JSONForm.fieldTypes['text']);

JSONForm.fieldTypes['subTitle'].template = `<div class="voucher-subtitle">
                <div class="top-heading">
                    <h1><%= value %></h1>
                </div>
            </div>`;


JSONForm.fieldTypes['textSection'] = jQuery.extend(true, {}, JSONForm.fieldTypes['text']);

JSONForm.fieldTypes['textSection'].template = `<div class="voucher-wraper">
                <p style="padding-top:20px"><%= value %></p></div>`;

var balanceCheckTimer = null;

JSONForm.fieldTypes['balanceCheck'] = jQuery.extend(true, {}, JSONForm.fieldTypes['help']);

JSONForm.fieldTypes['balanceCheck'].template =`<div id="<%= id %>" balanceCheck="amount" style="display: none">
            <div class="procceed-text"> <%= elt.helpvalue %></div>
        </div>`;
// template: '<span total-amount="true" id="<%=node.id%>"><%=value%></span>',
JSONForm.fieldTypes['balanceCheck'].onInsert =function (data, node) {
  // Compute the value of "myvalue" here
  if (balanceCheckTimer) {
    clearInterval(balanceCheckTimer);
  }
  balanceCheckTimer = setInterval(function() {
    var total = $('[total-amount="amount"]').text();
    var balance =$('[balance-amount="amount"]').text();

    if (total && balance) {
      var nBalance = parseFloat(balance);
      var nTotal = parseFloat(total);
      if (nBalance >= nTotal ) {
        $('div[balanceCheck="amount"]').hide();
        $('[type="submit"]').attr("disabled", false);
      } else {
        $('div[balanceCheck="amount"]').show();
        $('[type="submit"]').attr("disabled", true);
      }
    }
  }, 2000);
};

JSONForm.fieldTypes['balance'] = jQuery.extend(true, {}, JSONForm.fieldTypes['help']);
    JSONForm.fieldTypes['balance'].template =`<div id="<%= id %>" class="margin-bottom-10 balance-value">
            <span><%= typeof(mytitle)!== 'undefined' ?  mytitle : '' %> &nbsp; <span/><span balance-amount="amount" class="green"><%= myvalue %></span>
        </div>`;

JSONForm.fieldTypes['balance'].onBeforeRender = function (data, node) {
  // Compute the value of "myvalue" here
  data.myvalue = data.elt.helpvalue;
        data.mytitle = data.elt.title2;
};

JSONForm.fieldTypes['formHeading'] = jQuery.extend(true, {}, JSONForm.fieldTypes['help']);
JSONForm.fieldTypes['formHeading'].template = `<h2 class="form-heading"><%= elt.helpvalue %></h2>`;

JSONForm.fieldTypes['2Column'] = {
    template: `<div class="recpt-title">
                    <span style="float:left"><%= elt.left %></span>
                     <span style="float:right"><%= elt.right %></span>
            </div>`,
    fieldTemplate: true
};


/**
 * Compiles a string into a jsonata expression object
 * TODO: improve performance by caching expressions
 * @param {object} mappingParams
 * @param {object} mappingParams.expression
 * @return {object} - compiled jsonata expressing
 */
function getMappingExpression(mappingParams) {
    try {
        var expression = jsonata(mappingParams.expression);
        return expression;
    }catch (e) {
        return new Error('invalid mapping expression');
    }
}

async function sha256(message) {

    const encoder = new TextEncoder('utf-8');
    // encode as UTF-8
    const msgBuffer = encoder.encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    var u8 = new Uint8Array(hashBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(u8);

    const ctStr = hashArray.map(byte => String.fromCharCode(byte)).join('');             // ciphertext as string
    const ctBase64 = btoa(ctStr);
    console.log(ctBase64);
    return ctBase64;
}

var mapFormFields = function(evt, form, previous) {
    evt.preventDefault();


    var values = {};
    var rowIdx = -1;

    var schemaName = '';
    $.each($(evt.target.parentNode).serializeArray(), function(i, field) {

        var name = field.name.split('.')[1];
        if (rowIdx < 0) {
            rowIdx = field.name.substring(field.name.indexOf('[') + 1, field.name.indexOf(']'));
            schemaName =field.name.substring(0,field.name.indexOf('['));
        }
        values[name] = field.value;
        // console.log(name + " = " + field.value);
    });



    //return values;


    var toReturn = values;
    if (schemaName) {
        toReturn = {};
        toReturn[schemaName] = [values];
    }
    //QH
    //evt.preventDefault();
   // form.onSubmit(null, values)
    form.ownerTree.formDesc.onSubmit(null,toReturn)
};

var tempData = {
    "topupmine": [{
        "user":"22653423043",
        "amount":"",
        "amountPredefined":"",
        "pin":"12345"
    }],
    "transactions": [
        {
            "transactionId":"460",
            "name":"Hart Yarrow",
            "date":"Dec 20 2019 12:01",
            "transactionType":"Payment",
            "amount":"10.50"
        },
        {
            "transactionId":"456",
            "name":"Domenico Slixby",
            "date":"Nov 22 2019 12:01",
            "transactionType":"Payment",
            "amount":"22.20"
        },
        {
            "transactionId":"459",
            "name":"John David",
            "date":"Sept 29 2019 12:01",
            "transactionType":"Payment",
            "amount":"10.00"
        },
        {
            "transactionId":"458",
            "name":"Vlad Bow",
            "date":"Sept 10 2019 12:01",
            "transactionType":"Top Up",
            "amount":"32.50"
        },
        {
            "transactionId":"457",
            "name":"Larry Kyle",
            "date":"Aug 29 2019 12:01",
            "transactionType":"Payment",
            "amount":"15.50"
        },
        {
            "transactionId":"456",
            "name":"Kem Chris",
            "date":"Jul 30 2019 12:01",
            "transactionType":"Payment",
            "amount":"23.50"
        },
        {
        "transactionId":"123",
        "name":"Tester S",
        "date":"Jul 29 2019 12:01",
        "transactionType":"Top Up",
        "amount":"10.22"
        }
    ],
    "vendors": [{
        "vendorId":"1",
        "name":"Vendor A",
        "vouchers":[{
            "vendorId":"1",
            "voucher":"Cars",
            "amount":22
        },
            {
                "vendorId":"1",
                "voucher":"Boats",
                "amount":22
            },
            {
                "vendorId":"1",
                "voucher":"Planes",
                "amount":22
            },
            {
                "vendorId":"1",
                "voucher":"Doors",
                "amount":22
            },
            {
                "vendorId":"1",
                "voucher":"Scooters",
                "amount":22
            }
        ]
    },
        {
            "vendorId":"2",
            "name":"Bart",
            "vouchers":[
                {
                    "vendorId":"1",
                    "voucher":"Gliders",
                    "amount":22
                },
                {
                    "vendorId":"1",
                    "voucher":"cycles",
                    "amount":22
                }
            ]
        },
        {
            "vendorId":"3",
            "name":"Cars",
            "vouchers":[
                {
                    "vendorId":"1",
                    "voucher":"Gliders",
                    "amount":22
                },
                {
                    "vendorId":"1",
                    "voucher":"cycles",
                    "amount":22
                }
            ]
        },
        {
            "vendorId":"4",
            "name":"Doors",
            "vouchers":[
                {
                    "vendorId":"1",
                    "voucher":"Gliders",
                    "amount":22
                },
                {
                    "vendorId":"1",
                    "voucher":"cycles",
                    "amount":22
                }
            ]
        },
        {
            "vendorId":"5",
            "name":"Enders",
            "vouchers":[
                {
                    "vendorId":"1",
                    "voucher":"Gliders",
                    "amount":22
                },
                {
                    "vendorId":"1",
                    "voucher":"cycles",
                    "amount":22
                }
            ]
        },
        {
            "vendorId":"6",
            "name":"Fargo",
            "vouchers":[
                {
                    "vendorId":"1",
                    "voucher":"Bikes",
                    "amount":22
                },
                {
                    "vendorId":"1",
                    "voucher":"Scooters",
                    "amount":22
                }
            ]
        },
        {
            "vendorId":"7",
            "name":"Ghost",
            "vouchers":[
                {
                    "vendorId":"1",
                    "voucher":"Gliders",
                    "amount":22
                },
                {
                    "vendorId":"1",
                    "voucher":"cycles",
                    "amount":22
                }
            ]
        }
    ],
    "vouchers": [{
        "vendorId":"1",
        "voucher":"Cars",
        "amount":22
    },
        {
            "vendorId":"1",
            "voucher":"Boats",
            "amount":22
        },
        {
            "vendorId":"1",
            "voucher":"Planes",
            "amount":22
        },
        {
            "vendorId":"1",
            "voucher":"Doors",
            "amount":22
        },
        {
            "vendorId":"1",
            "voucher":"Scooters",
            "amount":22
        },
        {
            "vendorId":"1",
            "voucher":"Gliders",
            "amount":22
        },
        {
            "vendorId":"1",
            "voucher":"cycles",
            "amount":22
        }
    ]
};


if (!dexit) {
  var dexit = {};
}

dexit.guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
};

if (!dexit.localData) {
    dexit.localData = {};
}


bccLib = (function() {
  var token, overrideContainer;

  var layoutcontainerMap = {};

  /**
   * Allow to override container for all layouts (useful for testing?)
   */
  function setContainerOverride(containerId) {
    overrideContainer = containerId;
  }

  /**
   * empty UCC DOM container
   * @param containerId
   */
  function emptyContainer() {
    //remove all
    _.each(regionMap, function(value, key) {
      value.emptyContainer();
    });
    layoutcontainerMap = {};
  }

  /**
   * empty UCC DOM container
   * @param containerId
   */
  function emptyContainers() {
    //remove all
    _.each(layoutcontainerMap, function(value, layoutId) {
      var regionMap = (value && value.regionMap ?  value.regionMap : {});
      _.each(regionMap, function(value, key) {
        value.emptyContainer();
      });
    });
    layoutcontainerMap = {};
  }

  function prepareMasterContainer(layoutId, container, layoutHtml) {
    var containerVal = overrideContainer || container;

    if (!containerVal) {
      throw new Error('Layout must have a container');
    }

    if (!layoutcontainerMap[layoutId]) {
      layoutcontainerMap[layoutId] = {};
    }
    // TODO => pass the container reference from the epObject (should be unique)
    layoutcontainerMap[layoutId].patternContainer = document.querySelector(
      '#' + containerVal,
    );
    if (layoutcontainerMap[layoutId].patternContainer) {
      $(layoutcontainerMap[layoutId].patternContainer).empty();
    }

    // recieves the layout ref from sc-playback and renders the container to be used (finds the pattern container and renders the structure including the internal region references);
    layoutcontainerMap[layoutId].patternContainer.innerHTML = layoutHtml;
  }

  /**
   * Find container - fallback t
   * @param {string} regionId
   * @return {*|jQuery|HTMLElement}
   */
  function getRegion(regionId) {
    var selectionStr = '[data-region="' + regionId + '"]';
    var region = document.querySelector(selectionStr);
    //try using div id if fails
    if (!region) {
      region = document.querySelector('#' + regionId);
    }
    return region;
  }

  /**
   *
   * @param {object} uccContainer - reference to document element
   * @param {object} epAsset - to display
   * @param {object} [epAsset.presentationStyle] - styles to attach
   * @param {string} referenceId - id reference to track element
   */
  function parseMedia(bccVM, epAsset, referenceId) {
    var parsedMM = {};

    var nextElementType =
        epAsset.nextElement &&
        epAsset.nextElement.length > 0 &&
        epAsset.nextElement[0].type
            ? epAsset.nextElement[0].type
            : '';
    // find the next element

    //FIXME: this logic should be mostly removed, behaviour should come on show (not on click)
    switch (nextElementType) {
      case 'behaviour':
        bccVM.nextElement('behaviour');
        bccVM.nextElementType(epAsset.nextElement[0].property.resource);
        //FIXME: workaround to add reference to SC
        // if (epAsset.nextElement[0].property.isAssignedTo) {
        //     var val = epAsset.nextElement[0].property.isAssignedTo.split('/');
        //     bccVM.currentSCId(val[val.length-1]);
        // }

        var display = {};

        if (epAsset.nextElement[0].property.display) {
          try {
            if (_.isString(epAsset.nextElement[0].property.display)) {
              display = JSON.parse(epAsset.nextElement[0].property.display);
            } else {
              //safeguard against future changes of this being an object already
              display = epAsset.nextElement[0].property.display;
            }
          } catch (e) {
            console.log(e);
          }
        }
        //select icon from behavior
        if (display.icon) {
          bccVM.nextElementIcon(display.icon);
        } else {
          //if none then pick a default
          bccVM.nextElementIcon('fa-bullseye');
        }
        //select text to show with icon from behavior
        if (display.icon_text_wrapper) {
          bccVM.nextElementText(display.icon_text);
        } else {
          //if none then pick a default value
          bccVM.nextElementText('Next');
        }
        //select style for text icon wrapping from behavior
        if (display.icon_text_wrapper) {
          bccVM.textIconWrapper(display.icon_text_wrapper);
        }
        break;

      case 'multimedia':
        bccVM.nextElement('multimedia');
        bccVM.nextElementIcon('multimedia'); // createAssets will reference this
        break;

      case 'end':
        bccVM.nextElementIsEnd(true);
        bccVM.nextElement(null);
        break;

      default:
        bccVM.nextElementIsEnd(null);
        bccVM.nextElement(null);
        break;
    }

    // if there's no multimedia, then it's a behaviour and should just pop the link (whatever it is) in a new window
    if (
        !epAsset.multimedia &&
        epAsset.url &&
        epAsset.url.trim() !== '' &&
        epAsset.url !== null
    ) {
      bccVM.mediaType('behaviour');
      bccVM.behURL(epAsset.url);

      var params = {
        url: epAsset.url,
        regionRef: epAsset.regionRef,
        mode:
            epAsset.presentation && epAsset.presentation.mode
                ? epAsset.presentation.mode
                : 'window',
      };

    if (epAsset.props) {
        params.serviceDetails = epAsset.props;
        params.inputs = epAsset.inputs;
        params.args = epAsset.args;
        params.behaviourRef = epAsset.currentElement.value;
    }


      //bccVM.emptyContainer();
      bccVM.showBehaviour(params, referenceId);

      return;
    }

    //FIXME: intelligence should be passed in but nothing is received from sc-playback so just skip for now
    if (!epAsset.multimedia) {
      return;
    }

    bccVM.mediaType(null);

    // handle the media type here => pass to createAssets in bccVM
    if (epAsset.multimedia.video && epAsset.multimedia.video.length > 0) {
      bccVM.mediaType('video');
      parsedMM.mediaType = 'video';
      parsedMM.mediaPath = epAsset.multimedia.video[0].property.location;
      parsedMM.currentElement = epAsset.currentElement;
    } else if (
        epAsset.multimedia.image &&
        epAsset.multimedia.image.length > 0
    ) {
      bccVM.mediaType('image');
      parsedMM.mediaType = 'image';
      parsedMM.mediaPath = epAsset.multimedia.image[0].property.location;
    }

    parsedMM.mediaLinks = [];

    if (epAsset.multimedia.text && epAsset.multimedia.text.length > 0) {
      _.each(epAsset.multimedia.text, function(text) {
        if (text.property.tag.indexOf('mm-text') > -1) {
          parsedMM.mediaText = text.property.content;
        }

        if (text.property.tag.indexOf('mm-links') > -1) {
          var linkArray = [
            text.property.content.split(': ')[0],
            text.property.content.split(': ')[1],
          ];
          parsedMM.mediaLinks.push(linkArray);
        }
      });
    }

    if (bccVM.mediaType() === null && parsedMM.mediaLinks.length > 0) {
      bccVM.mediaType('links');
    } else if (bccVM.mediaType() === null && parsedMM.mediaLinks.length === 0) {
      bccVM.mediaType('text');
    }

    bccVM.createAssets(
        parsedMM,
        epAsset.regionRef,
        referenceId,
        epAsset.presentationStyle,
    );
  }

  //region to bccVM mapping  (layout + ":" + regionRef) -> bccVM
  //FIXME: hardcoded bccVM references
  var regionMap = {};

  var behaviourMessageMap = {};

  var callbackMap = {};
  var deviceId = '';
  function setDeviceId(id) {
    deviceId = id;
  }

  function getDeviceId(id) {
    return deviceId;
  }

  function setBehaviourMessageMap(key, val) {
    behaviourMessageMap[key] = val;
  }

  function postMessageListener(e) {
    //ignore anything not from click message
    if (!e.data.message || e.data.message != 'clicked') {
      return;
    }

    //look up callback back based on origin
    //fixme: need better way since if behaviours have same origin this will mess up
    var originMessage = behaviourMessageMap[e.origin];
    if (originMessage) {
      try {
        //remove from map
        delete behaviourMessageMap[e.origin];
      } catch (ex) {}

      //look up callbackMap based on container
      fetchNextElement(originMessage);
      //FIXME: call all bc
      _.each(regionMap, function(value, key) {
        value.handleQuizSubmission(e);
      });
    }
  }

  function generateId() {
    var uniqid = Date.now();
    return uniqid;
  }

  function handleShowNext(msg, data) {
    if (data && data.referenceId) {
      var cbFn = callbackMap[data.referenceId];
      if (cbFn) {
        try {
          cbFn.call();
        } catch (ex) {
          delete callbackMap[data.referenceId];
        }

        //remove from callback map?
      }
    }
  }

  token = PubSub.subscribe('showNext', handleShowNext);

  function showIntelligence(bccVM, body, referenceId) {
    //trigger the intelligence referred function to draw the report
    //resolve region
    var regionRef = body.regionRef;
    var targetRegion = bccVM.container.querySelector(
        '[data-region="' + regionRef + '"]',
    );

    //clear previous before adding
    $(targetRegion).empty();

    if (body.intelligence.renderInfo) {
      _.each(body.intelligence.renderInfo, function(renderReport, index) {
        if (renderReport.dom) {
          targetRegion.appendChild(renderReport.dom);
        }
        if (renderReport.showFunc) {
          if (renderReport.option) {
            renderReport.showFunc.setOption(renderReport.option);
            setTimeout(function() {
              renderReport.showFunc.resize({width: 'auto'});
            }, 10);
          } else {
            renderReport.showFunc();
          }
          targetRegion.addEventListener(
              'click',
              function() {
                fetchNextElement(referenceId);
              },
              false,
          );
        }
      });
    } else if (body.intelligence.presentation) {
      var newDiv = document.createElement('div');

      $(newDiv).append(body.intelligence.presentation.html);
      var listener = function() {
        var msg = {op: 'dexit.ep.show',  hasError: (false), data: { element:body, scId: bccVM.currentSCId()} };
        window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      };
      newDiv.addEventListener('click', listener, false);
      //newDiv.addEventListener('click', function() { PubSub.publish('dexit.ep.show',{ element:body, scId: bccVM.currentSCId()}); }, false);
      $(newDiv).css({'cursor':'pointer'});
      targetRegion.appendChild(newDiv);
    } else {
      console.warn('unhandled presentation for intelligence');
      fetchNextElement(referenceId);
    }
  }

  /**
   *
   * @param layoutRef
   * @param epId
   * @param overrideContainer
   * @returns {string}
   */
  function resolveAbsoluteLayoutId(layoutRef, epId, overrideContainer) {
    if (!overrideContainer) {
      return epId + '@' + layoutRef;
    } else {
      return epId + '@' + layoutRef + '@' + overrideContainer;
    }
  }



  function show(id, body, callback) {

    if (_.isString(body)) {
      body = JSON.parse(body);
    }

    //wrap callbacks with an id ref
    showMe(body, function(err) {
      var msg = {id: id, hasError: err ? true : false, error: err};
      window.ReactNativeWebView.postMessage(JSON.stringify(msg));
    });
  }

  function showMe(body, callback) {
    var layoutRef = resolveAbsoluteLayoutId(
        body.layoutRef,
        body.epId,
        body.overrideContainer,
    );

    //find if there is player to the dom container (for the layout);
    var match = layoutcontainerMap[layoutRef];

    if (!match) {
      return callback(Error('layout container was not recognized'));
    }

    //generate an id so showNext can be correlated
    var referenceId = generateId();
    callbackMap[referenceId] = callback;

    var bccVM = match.bccVM;

    //if not initailize
    if (!bccVM) {
      bccVM = new dexit.BccVM({
        container: match.patternContainer,
        ref: layoutRef,
        layoutId: body.layoutRef,
      });

      layoutcontainerMap[layoutRef].bccVM = bccVM;
    }
    if (body && body.epId) {
      bccVM.currentEpId(body.epId);
    }
    if (body && body.scId) {
      bccVM.currentSCId(body.scId);
    }

    if (body && body.overrideScId) {
      bccVM.currentSCId(body.overrideScId);
    }

    if (body.multimedia) {
      parseMedia(bccVM, body, referenceId);
    } else if (body.intelligence) {
      showIntelligence(bccVM, body, referenceId);
    } else if (body && body.url) {
      //quick fix for showing behaviour
      parseMedia(bccVM, body, referenceId);
    }
  }

  function setErrorStatus(err) {
    console.log(err);
  }

  function resetAll() {
    //remove all
    _.each(layoutcontainerMap, function(value, layoutId) {
      var regionMap = value && value.regionMap ? value.regionMap : {};
      _.each(regionMap, function(value, key) {
        value.emptyContainer();
      });
    });
    //TODO: find a better way to clear/reference layoutRegions for multiple executing patterns
    layoutcontainerMap = {};
    //remove override
    overrideContainer = null;
  }
  var user = {};
  var scId = {};
  function setUser(val) {
    user = val;
  }
  function getUser() {
    return user;
  }
  function overrideScId(val) {
    scId = val;
  }

  function getOverridenScId() {
    return scId;
  }

  //not sure where LB stuff should go
  function createLB() {
    var lightBox = document.createElement('div'),
        lightBoxWrapper = document.createElement('div'),
        lightBoxMMPreviewer = document.createElement('iframe'),
        lightBoxClose = document.createElement('button'),
        lightBoxHeader = document.createElement('h3'),
        lightBoxHeaderText = document.createTextNode('Link: AFI Tool Kit');

    lightBoxHeader.classList.add('ucc-lb-header');
    lightBox.classList.add('ucc-lightbox');
    lightBoxWrapper.classList.add('ucc-lightbox-wrapper');
    lightBoxHeader.appendChild(lightBoxHeaderText);

    lightBoxMMPreviewer.classList.add('ucc-lbox-mmpreview');
    lightBoxClose.classList.add('btn', 'btn-primary', 'pull-right');
    lightBoxClose.innerHTML = 'Close Lightbox';

    lightBoxWrapper.appendChild(lightBoxClose);
    lightBoxWrapper.appendChild(lightBoxHeader);
    lightBoxWrapper.appendChild(lightBoxMMPreviewer);

    lightBox.appendChild(lightBoxWrapper);

    document.body.appendChild(lightBox);
  }

  //not sure where LB stuff should go
  function createBehaviourLB(lbId) {
    var lightBox = document.createElement('div'),
        lightBoxWrapper = document.createElement('div'),
        lightBoxMMPreviewer = document.createElement('iframe'),
        lightBoxClose = document.createElement('button'),
        lightBoxHeader = document.createElement('h3');
    //lightBoxHeaderText = document.createTextNode('Link: AFI Tool Kit');

    //set the id
    lightBox.setAttribute('id', lbId);
    lightBoxHeader.classList.add('ucc-lb-header');
    lightBox.classList.add('ucc-lightbox');
    lightBoxWrapper.classList.add('ucc-lightbox-wrapper');
    lightBoxWrapper.setAttribute('style', 'display:inline');
    //lightBoxHeader.appendChild(lightBoxHeaderText);

    lightBoxMMPreviewer.classList.add('ucc-lbox-mmpreview');
    lightBoxClose.classList.add('btn', 'btn-primary', 'pull-right');
    lightBoxClose.innerHTML = 'Close Lightbox';

    lightBoxWrapper.appendChild(lightBoxClose);
    lightBoxWrapper.appendChild(lightBoxHeader);
    lightBoxWrapper.appendChild(lightBoxMMPreviewer);

    lightBox.appendChild(lightBoxWrapper);
    document.body.appendChild(lightBox);
    return lightBox;
  }

  // function popLightBox = function(bccVM,el) {
  //
  // }

  /**
   *
   * @param {string} id
   * @param {object} data
   * @param {object} data.error
   * @param {object} data.data
   */
  function handleBehaviourResponse(id, data) {
    var cbFn = behaviourMessageMap[id];

    if (cbFn && data) {
      if (cbFn) {
        try {
          cbFn(data.error, data.data);
          //cbFn.call();
        } catch (ex) {
          delete callbackMap[id];
        }

        //remove from callback map?
      }
    }
  }


  function fetchNextElement(referenceId) {
    //TODO: comment out for now
    // //find if there is player to handle region
    // var bccVM = regionMap[containerId];
    // if (!bccVM) {
    //     console.log('no bccVM');
    //     return;
    // }
    //
    // try {
    //     $('.ucc-preloader').height($('.content-scroller').height() - 10 + "px");
    //     document.querySelector('.ucc-preloader').classList.add('show-ucc-preloader');
    // }catch (e) {}
    // //bccVM.emptyContainer();

    PubSub.publish('showNext', {referenceId: referenceId});
  }

  // make methods public
  return {
    findMedia: parseMedia,
    show: show,
    setErrorStatus: setErrorStatus,
    emptyContainer: emptyContainer,
    resetAll: resetAll,
    setUser: setUser,
    getUser: getUser,
    fetchNextElement: fetchNextElement,
    prepareMasterContainer: prepareMasterContainer,
    setContainerOverride: setContainerOverride,
    postMessageListener: postMessageListener,
    setBehaviourMessageMap: setBehaviourMessageMap,
    createLB: createLB,
    createBehaviourLB: createBehaviourLB,
    setScId: overrideScId,
    getScId: getOverridenScId,
    handleBehaviourResponse: handleBehaviourResponse,
    setDeviceId: setDeviceId,
    getDeviceId: getDeviceId
  };
})();

dexit.BccVM = function(params) {
  var self = this;
  var bccVM = this;

  self.layoutId = params.layoutId;
  self.container = params.container;
  self.behPresentation = ko.observable('window');
  self.lectureTitle = ko.observable();
  self.mediaType = ko.observable();
  self.mediaSource = ko.observable();
  self.currentlyViewing = ko.observable('home');
  self.behWindow = null;
  self.behURL = ko.observable(null);
  self.viewingLecture = ko.observable(false);
  self.resizeOnLoad = ko.observable(false);
  self.outcomeType = 1;
  self.user = {};
  self.epaType = 'default';
  self.statusMessage = ko.observable('Loading content, please wait...');
  self.statusIcon = ko.observable('fa fa-spinner fa-pulse');
  self.nextElement = ko.observable(null);
  self.nextElementType = ko.observable(null);
  self.nextElementIcon = ko.observable(null);
  self.nextElementText = ko.observable(null);
  self.nextElementIsEnd = ko.observable(false);
  self.textIconWrapper = ko.observable(null);
  self.currentSCId = ko.observable(null);
  self.currentEpId = ko.observable(null);

  // TODO => empty regions only, not the whole container
  self.emptyContainer = function() {
    if (self.container && self.container.firstChild) {
      while (self.container.firstChild) {
        self.container.removeChild(self.container.firstChild);
      }
    }

    try {
      ko.cleanNode(self.container);
    } catch (e) {
      console.log('could not clean node');
    }
  };

  self.handleVideoEnded = function(mmEl, referenceId) {
    bccLib.fetchNextElement(referenceId);

    //Temp: hide for now
    // if (bccVM.mediaType() == "video") {
    //     mmEl.controls = false;
    //     mmEl.currentTime = 0;
    //     $(mmEl.nextElementSibling).css('top', "-" + $(mmEl).height() + "px");
    //     mmEl.nextElementSibling.classList.add('animate-down');
    // }
  };

  self.showEndedScreen = function() {
    if ($('.content-scroller').height() === 0) {
      $('.content-scroller').height('250px');
    }

    $('.ucc-preloader').css('height', '240px');

    bccVM.statusIcon('fa fa-check-circle lesson-complete');
    //maybe some words of wisdom
    bccVM.statusMessage('Congrats! You finished this module.');

    setTimeout(bccVM.preloadReset, 1500);
  };

  self.preloadReset = function() {
    var preloaderScreen = $('.ucc-preloader');

    bccVM.resetVM();

    preloaderScreen.removeClass('show-ucc-preloader');

    bccVM.statusMessage('Loading content, please wait...');
    bccVM.statusIcon('fa fa-spinner fa-pulse');
  };

  self.resetVM = function() {
    bccVM.mediaType(null);
    bccVM.mediaSource(null);
    bccVM.currentlyViewing('home');
    bccVM.behWindow = null;
    bccVM.viewingLecture(false);
    bccVM.resizeOnLoad(false);
    bccVM.lectureTitle('');
    bccVM.outcomeType = 1;
  };

  /**
   * dom reference
   */
  self.clearDiv = function(node) {
    if (node && node.firstChild) {
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    }
  };

  self.getRegion = function(regionRef) {
    var mainContainer = self.container;
    return mainContainer.querySelector('[data-region="' + regionRef + '"]');
  };

  /**
   *
   * @param {object} params
   * @param {string} params.url
   * @param {string} [params.mode=window] - open in new window (other option is 'container')
   */
  self.showBehaviour = function(params, referenceId) {
    var mode = params && params.mode ? params.mode : 'window';
    var newTargetURL = bccVM.prepareUrl(params.url);

    //FIXME: get origin only since it is only part accessible for cross-origin
    var myAnchor = $('<a />');
    myAnchor.attr('href', newTargetURL);
    var a = myAnchor[0];

    switch (mode) {
      case 'window':
        //add listener reference id so it is known how to handle 'done'
        bccLib.setBehaviourMessageMap(a.origin, referenceId);
        bccVM.showBehaviourInNewWindow(newTargetURL);
        break;
      case 'inline':
        //add listener reference id so it is known how to handle 'done'
        bccLib.setBehaviourMessageMap(a.origin, referenceId);
        bccVM.showBehaviourInIframe(
            newTargetURL,
            self.getRegion(params.regionRef),
        );
        break;
      case 'popover':
        //TODO: use behaviour message map to allow two ways: close lightbox or service sends signal and close LB automatically
        bccVM.showBehaviourInIframePopover(newTargetURL, referenceId);
        break;
      case 'local-embed': {
        bccVM.showBehaviourInLocalEmbed(params, referenceId);
        break;
      }
      case 'none': {
        //bccLib.setBehaviourMessageMap('fixme',referenceId);
        bccVM.showBehaviourNone(params, referenceId);
        break;
      }

    }
  };

  /**
   * Clear any responsive embed tags for iframe
   * @param domElement
   */
  self.clearIframeResponsive = function(domElement) {
    if (domElement) {
      domElement.classList.remove('embed-responsive', 'embed-responsive-4by3');
    }
  };


  self.showBehaviourNone = function(params, referenceId) {

        var fn = params.url.replace('local://','');

        var parts = fn.split('.');
        if (parts.length > 1) {
            if (parts[0] === 'self') {
                self[parts[1]](params);
            }
        }else {
            window[fn](params);
        }
        // eval(fn,params);
        // window[fn](params);


        bccLib.fetchNextElement(referenceId);
    }

    self.clearCurrentRegion = function(params) {
        var regionElement = self.getRegion(params.regionRef);
        self.clearDiv(regionElement);
    }


    self.showBehaviourInLocalEmbed = function(params, referenceId) {
        var regionElement = self.getRegion(params.regionRef);


        var form = document.createElement('FORM');
        form.classList.add('main-content-buttons');
        var alert = document.createElement('DIV');
        alert.classList.add('alert');
        //<div id="res" class="alert"></div>
        self.clearDiv(regionElement);

        //add to container
        regionElement.appendChild(form);
        regionElement.appendChild(alert);


        var values = null; //todo

        self._checkPreRun(params, form, referenceId, false, null, function(err, values, isConfirm, submitThenConfirm) {
            if (err) {
                //todo, warn
            }

            // submitThenConfirm = true;
            self._bindBehaviour(params,form,referenceId,isConfirm,values, submitThenConfirm);
        });
    };

    self._checkPreRun = function(params, form, referenceId, isConfirm, values, cb) {

        var skipValidation = SKIP_VALIDATION;



        var serviceDetails = params.serviceDetails;
        var presentationMapping = serviceDetails.presentationMapping;
        if (_.isString(presentationMapping)) {
            presentationMapping = JSON.parse(presentationMapping);
        }


        var submitThenConfirm = (presentationMapping.submitThenConfirm ? true : false);

        var inputModel = serviceDetails.inputModel;
        if (_.isString(inputModel)) {
            inputModel = JSON.parse(inputModel);
        }

        if (presentationMapping.preRun && presentationMapping.preRun.type && presentationMapping.preRun.type === 'autoSubmit') {
            var preRun = presentationMapping.preRun && presentationMapping.preRun;


            if (skipValidation) {
                var name = inputModel.title;
                if (tempData && tempData[name]) {

                    var data = {};
                    data[name] = tempData[name];

                    return cb(null, data, true, submitThenConfirm)
                } else {
                    cb(null, values, true, submitThenConfirm);
                }

                //return some dummy data
            } else {
                //todo:  preRun.args
                cb(null, values, null, submitThenConfirm);

            }


        }else if (presentationMapping.preRun && presentationMapping.preRun.type && presentationMapping.preRun.type === 'localfn') {
            var preRun = presentationMapping.preRun && presentationMapping.preRun;
            var callbackRef = 'preRun_' + referenceId;
            bccLib.setBehaviourMessageMap(callbackRef, cb);

            var args = preRun.args || {};
            var msg = {op: 'dexit.localfn',
                hasError: (false),
                data: { value: preRun.value, args: args, callbackRef: callbackRef } };
            window.ReactNativeWebView.postMessage(JSON.stringify(msg));

        } else {
            cb(null, values, null,submitThenConfirm);
        }


    };

    self._showBehaviourError = function(formElement, msg) {
        $(formElement).siblings('.alert').html(msg);
    };

    self._prepareFormDef = function(formDef) {
        _.each(formDef, function(val) {
            if (val && val.type && val.type === 'array') {
                //go through items
                _.each(val.items, function(itemVal) {
                    if (itemVal.items) {
                        _.each(itemVal.items, function (fieldsetVal) {
                            if (fieldsetVal.type && fieldsetVal.type === 'button' && fieldsetVal.onClick && !_.isFunction(fieldsetVal.onClick) ){
                                //lookup fn ref
                                var lookupNames = fieldsetVal.onClick;

                                if (_.isArray(lookupNames)) {
                                    //TODO;
                                }else {

                                    fieldsetVal.onClick = function(evt, form) {
                                        window[lookupNames](evt,form, self);
                                    }
                                }

                            }
                        })
                    }
                })


            }
        })
        return formDef;
    };

    self._next = function(params, formElement, referenceId, values ) {



        //add params.behaviourDef
        var serviceDetails = params.serviceDetails;

        var inputModel = serviceDetails.inputModel;
        if (_.isString(inputModel)) {
            inputModel = JSON.parse(inputModel);
        }
        var presentationMapping = serviceDetails.presentationMapping;
        if (_.isString(presentationMapping)) {
            presentationMapping = JSON.parse(presentationMapping);
        }

        var resultScreen = (presentationMapping && presentationMapping.resultScreen ? true : false);

        var autoComplete = (presentationMapping && presentationMapping.autoComplete ? true : false);


        if (!resultScreen) {
            bccLib.fetchNextElement(referenceId);
        }else {



            var inputModel = serviceDetails.completeModel || serviceDetails.inputModel;
            if (_.isString(inputModel)) {
                inputModel = JSON.parse(inputModel);
            }
            var fields = (presentationMapping.args && presentationMapping.args.fields ? presentationMapping.args.fields : {});
            //var formDef = (presentationMapping.args && presentationMapping.args.form ? presentationMapping.args.form : null);


            var defaultFormDef = ["*",{"type":"submit","title":"Done","htmlClass":"pink-btn"}];
            var formDefDefault = (presentationMapping.args && presentationMapping.args.form ? presentationMapping.args.form : defaultFormDef);
            var formDef = (presentationMapping.args && presentationMapping.args.formComplete ? presentationMapping.args.formComplete : formDefDefault);
            /**
             * Need to include any event handlers (by name)
             */
            var formDefMod = self._prepareFormDef(formDef);




            self.clearDiv(formElement);


            //$(regionElement).find('form').jsonForm({
            var formDefinition = {
                schema: inputModel,
                fields: fields,
                form: formDefMod,
                value: values || null,
                onSubmit: function (errors, values) {

                    //evt.preventDefault();
                    // presentation
                    bccLib.fetchNextElement(referenceId);
                    return false;
                    //invoke behaviour
                    //save dadta

                    // }
                }
            };
            $(formElement).jsonForm(formDefinition);

            jQuery(".hover-home .form-group input").each(function() {
                if (jQuery(this).val().length > 0) {
                    jQuery(this).closest(".form-group").addClass("hasvalue");
                } else {
                    jQuery(this).closest(".form-group").removeClass("hasvalue");
                }
            });
            jQuery(".hover-home .form-group input").on("input", function() {
                if (jQuery(this).val().length > 0) {
                    jQuery(this).closest(".form-group").addClass("hasvalue");
                } else {
                    jQuery(this).closest(".form-group").removeClass("hasvalue");
                }
            });
            jQuery(".hover-home .form-group select").on("change", function() {
                if (jQuery(this).val().length > 0) {
                    jQuery(this).closest(".form-group").addClass("hasvalue");
                } else {
                    jQuery(this).closest(".form-group").removeClass("hasvalue");
                }
            });


            jQuery(".hover-home .form-group select").each(function() {
                if (jQuery(this).val().length > 0) {
                    jQuery(this).closest(".form-group").addClass("hasvalue");
                } else {
                    jQuery(this).closest(".form-group").removeClass("hasvalue");
                }
            });



            if (autoComplete) {
                bccLib.fetchNextElement(referenceId);
            }
            //show next

        }

    }

    self._bindBehaviour = function(params, formElement, referenceId, isConfirm, values, submitThenConfirm) {


        //var url = new URLSearchParams(location.search);
        //var skipValidation = url.has("bypass");
        var skipValidation = SKIP_VALIDATION;

        function handleResult(err, result) {


            if (submitThenConfirm) {

                self._bindBehaviour(params,formElement,referenceId,true,result,false);
            } else if (skipValidation) {
                let val = result || values;
                self._next(params,formElement,referenceId,val);
            }else {


                if (err) {
                    //add warning message
                    self._showBehaviourError(formElement, err);
                } else {

                    if (result && result.responseData && result.responseData.response) {

                        if (result.responseData.response.errorCd && result.responseData.response.errorCd === '00') {
                            self._next(params,formElement,referenceId,values);
                        } else {
                            //add warning
                            var msg = result.responseData.response.desc || 'Error';
                            self._showBehaviourError(formElement, msg);
                        }

                    } else {
                        self._next(params,formElement,referenceId,values);
                    }

                }
            }
        }


        //add params.behaviourDef
        var serviceDetails = params.serviceDetails;

        var inputModel = serviceDetails.inputModel;
        if (_.isString(inputModel)) {
            inputModel = JSON.parse(inputModel);
        }
        var presentationMapping = serviceDetails.presentationMapping;
        if (_.isString(presentationMapping)) {
            presentationMapping = JSON.parse(presentationMapping);
        }
        var fields = (presentationMapping.args && presentationMapping.args.fields ? presentationMapping.args.fields : {});
        // var formDef = (presentationMapping.args && presentationMapping.args.form ? presentationMapping.args.form : null);
        //var values =

        var defaultFormDef = ["*",{"type":"submit","title":"Done","htmlClass":"pink-btn"}];
        var formDef = (presentationMapping.args && presentationMapping.args.form ? presentationMapping.args.form : defaultFormDef);

        var formInput = (presentationMapping.args && presentationMapping.args.formInput ? presentationMapping.args.formInput : null);
        var formConfirm = (presentationMapping.args && presentationMapping.args.formConfirm ? presentationMapping.args.formConfirm : null);
        var formComplete = (presentationMapping.args && presentationMapping.args.formComplete ? presentationMapping.args.formComplete: null);

        var confirmScreen = (presentationMapping && presentationMapping.confirmScreen ? true : false);


        if (isConfirm) {
            confirmScreen = false;
            //copy inputModel and make read only
            // make sure to add readonly to all
            var confirmModel = serviceDetails.confirmModel;
            if (_.isString(confirmModel)) {
                confirmModel = JSON.parse(confirmModel);
            }

            var inputModelConfirm = {};
            if (confirmModel) {
                inputModelConfirm = confirmModel;
            }else {
                inputModelConfirm = JSON.parse(JSON.stringify(inputModel));
            }



            //var inputModelConfirm = JSON.parse(JSON.stringify(inputModel));


            //if array skip
            if (inputModelConfirm.properties) {

                Object.keys(inputModelConfirm.properties).forEach(function(key) {
                    inputModelConfirm.properties[key].readOnly = true;
                });
            }

            var formDefConfirm;
            if (formConfirm) {
                formDefConfirm = formConfirm;
            }else {
                formDefConfirm = JSON.parse(JSON.stringify(formDef));

            }
            try{

            }catch(e){}
            var cancelButton = {
                "type": "button",
                "title": "Cancel",
                "htmlClass":"btn-inner-purchase outline-btn",
                "onClick": function (evt) {
                    evt.preventDefault();
                    self._bindBehaviour(params,formElement,referenceId,false,values);
                }
            };

            if (!formDefConfirm) {
                formDefConfirm = [];
            }
            if (formDefConfirm.length > 0 && formDefConfirm[0] === '*') {

                formDefConfirm.splice(1,0, cancelButton);
            }else {
                if (!presentationMapping.hideCancel) {
                    formDefConfirm.push(cancelButton);
                }

            }
            //cancel goes back to previous form
            //add cancel button
        }


        /**
         * Need to include any event handlers (by name)
         */





        var inModel = (inputModelConfirm ? inputModelConfirm: inputModel);


        if (submitThenConfirm && formInput) {
            formDef = formInput || formDef;
        }

        var formMod = (formDefConfirm ? formDefConfirm : formDef);


        formMod = self._prepareFormDef(formMod);




        //"form": [
        //     "*",
        //     {
        //       "type": "submit",
        //       "title": "OK Go - This Too Shall Pass"
        //     }
        //   ]
        // var formDef = [
        //     "*",
        //     {
        //         "type": "submit",
        //         "title": "Next",
        //         "htmlClass": "pink-btn"
        //     }
        // ]



        self.clearDiv(formElement);

        //All templates must exist here
        if (presentationMapping.customTemplateName && presentationMapping.customTemplateType && JSONForm.fieldTypes[presentationMapping.customTemplateType]) {
            JSONForm.fieldTypes[presentationMapping.customTemplateType].template = window[presentationMapping.customTemplateName];
        }


        //$(regionElement).find('form').jsonForm({
        var formDefinition = {
            schema: inModel,
            fields: fields,
            form: formMod,
            value: values || null,
            onSubmit: function (errors, values) {

                //evt.preventDefault();
                // presentation
                if (confirmScreen && !submitThenConfirm) {

                    self._bindBehaviour(params,formElement,referenceId,true,values);


                }else {
                    //TODO: errors are related to the schema not the values input
                    // if (errors) {
                    //     alert.innerText = 'Please check the values and try again';
                    //     //TODO: show errors
                    // } else {


                    self._executeBehaviour(params, values, referenceId, submitThenConfirm, handleResult);


                }
                return false;
                //invoke behaviour
                //save dadta

                // }
            }
        };
        $(formElement).jsonForm(formDefinition);

        jQuery(".hover-home .form-group input").each(function() {
            if (jQuery(this).val().length > 0) {
                jQuery(this).closest(".form-group").addClass("hasvalue");
            } else {
                jQuery(this).closest(".form-group").removeClass("hasvalue");
            }
        });
        jQuery(".hover-home .form-group input").on("input", function() {
            if (jQuery(this).val().length > 0) {
                jQuery(this).closest(".form-group").addClass("hasvalue");
            } else {
                jQuery(this).closest(".form-group").removeClass("hasvalue");
            }
        });
        jQuery(".hover-home .form-group select").on("change", function() {
            if (jQuery(this).val().length > 0) {
                jQuery(this).closest(".form-group").addClass("hasvalue");
            } else {
                jQuery(this).closest(".form-group").removeClass("hasvalue");
            }
        });


        jQuery(".hover-home .form-group select").each(function() {
            if (jQuery(this).val().length > 0) {
                jQuery(this).closest(".form-group").addClass("hasvalue");
            } else {
                jQuery(this).closest(".form-group").removeClass("hasvalue");
            }
        });
    };




    /**
     *
     * @param {object } params
     * @param {object} params.args - input arguments
     * @param {object[]} params.inputs
     * @param {object} params.behaviourRef
     * @param {object} params.behaviourRef
     * @param {string} params.behaviourRef.scId - smart content identifier
     * @param {string} params.behaviourRef.typeRef - 'behaviour'
     * @param {string} params.behaviourRef.typeId - behaviour identifier
     * @param values
     * @param submitThenConfirm
     * @param referenceId
     * @private
     */
  self._executeBehaviour = function(params, values, referenceId, submitThenConfirm, callback) {


      var skipValidation = SKIP_VALIDATION;

        var args = params.args;
        var inputs = params.inputs;

        //inputs

        //now look at mapping an merge with args
        //params.serviceDetails.inputMapping
        var mappingParams = params.serviceDetails.inputMapping || {};
        if (_.isString(mappingParams)) {
            mappingParams = JSON.parse(mappingParams);
        }

        //TODO: not hardcode but lookup from local helper functions
        var globalValues = {
            deviceId: bccLib.getDeviceId(),
            msgId: 'dex'+ dexit.guid()
        };
        //global values
        _.extend(values, globalValues);



        var presentationMapping = params.serviceDetails.presentationMapping;
        if (_.isString(presentationMapping)) {
            presentationMapping = JSON.parse(presentationMapping);
        }
        var localSave = (presentationMapping && presentationMapping.localSave ? true: false);

        //run any transform functions on values


        async.auto({
            //map any values using local functions
            preMap: function (cb) {
                if (mappingParams && mappingParams.preTransform && mappingParams.preTransform.length > 0) {
                    async.each(mappingParams.preTransform, function (val, done) {
                        let name = val.name;
                        let fnName= val.valueFn;
                        let isAsync = val.isAsync;
                        if (values[name]) {
                            if (isAsync) {
                                window[fnName](values[name]).then(val => {
                                    values[name] = val;
                                    done();
                                }).catch(error => {
                                    done(); //skip
                                })
                            }else {
                                let val = window[fnName](values[name]);
                                values[name] = val;
                            }
                        }
                    }, function (err) {
                        cb(null,values);
                    })

                }else {
                    cb(null,values);
                }
            },
            map: ['preMap', function(results, cb) {
                if (!mappingParams || Object.keys(mappingParams).length < 1) {
                    return cb();
                }
                var expression = getMappingExpression(mappingParams);
                var bindings = mappingParams.bindings || {};
                expression.evaluate(values,bindings, function (err, result) {
                    if (err) {
                        alert('Please check your input');
                        return cb(err);
                    }
                    _.extend(args, result);

                    args= _.mapKeys(args, function(value, key) {
                        return ':'+key;
                    });

                    cb();
                });
            }],
            execute: ['map', function(results, cb) {

                if (localSave) {
                    _.extend(dexit.localData, results.map);
                    cb(null,dexit.localData);
                } else {

              if (skipValidation) {

                if (submitThenConfirm) {
                     self._loadMockData(params,values,cb);


                            // var inputModel = params.serviceDetails.confirmModel;
                            // if (_.isString(inputModel)) {
                            //     inputModel = JSON.parse(inputModel);
                            // }
                            //
                            // var name = inputModel.title;
                            // if (tempData && tempData[name]) {
                            //
                            //     var data = {};
                            //     data[name] = tempData[name];
                            //
                            //     cb(null, data)
                            // }else {
                            //     cb(null,{});
                            // }
                }else {
                    cb(null, results.preMap || {});
                }
                        // cb(null, {});
            } else {

              var scId = params.behaviourRef.scId;
              var behaviourId = params.behaviourRef.typeId;

              var key = referenceId+'_execute';
              bccLib.setBehaviourMessageMap(key, cb);


                var msg = {
                    op: 'dexit.ep.executeBehaviour',
                    hasError: (false),
                    data: {ref: key, scId: scId, behaviourId: behaviourId, args: {args: args, inputs: inputs}}
                  };
                  window.ReactNativeWebView.postMessage(JSON.stringify(msg));

                }
             }
          }]
        }, function(err, result) {


                callback(err, result.execute);
                //TODO:
                //result.execute;
                //result.preMap (values)  //save relevant values with output to temp intelligence




        });

        //
        // var expression = getMappingExpression(mappingParams);
        // var bindings = mappingParams.bindings || {};
        // expression.evaluate(values,bindings, function (err, result) {
        //     if (err) {
        //         alert('Please check your input');
        //     }else {
        //         _.extend(args,result);
        //
        //         //run any transform functions
        //
        //         behaviour.executeWithParams(args, inputs, function (err, result) {
        //             bccLib.fetchNextElement(referenceId);
        //         });
        //     }
        // });

    };
  self._loadMockData = function(params, values, cb) {


        var inputModel = params.serviceDetails.confirmModel;
        if (_.isString(inputModel)) {
            inputModel = JSON.parse(inputModel);
        }


        var name = inputModel.title;
        var data = {};
        var found;
        if (tempData && tempData[name]) {
            //data[name] = tempData[name];
            found = tempData[name];
        }
        if (!found) {
            return cb(null,{});
        }


        if (found && values && values.startDate && values.endDate) {


            var startDate = moment(values.startDate);
            var endDate = moment(values.endDate);

            found = _.filter(found,function(o) {
                var tempDate = moment(o.date);
                return tempDate.isBetween(startDate,endDate);

            });

        }
        data[name] = found;
        cb(null,data);

        //available data (mock data)


    };

  /**
   * add iframe, and populate
   * @param {string} url
   * @param {object} domRef - dom element
   */
  self.showBehaviourInIframe = function(url, regionElement) {
    self.clearIframeResponsive(regionElement);

    //var iframeWrapper = document.createElement('div');
    // iframeWrapper.classList.add('embed-responsive','embed-responsive-4by3');
    regionElement.classList.add('embed-responsive', 'embed-responsive-4by3');
    var iframe = document.createElement('iframe');
    iframe.src = url;

    //FIXME: iframe height and width
    //should size iframe to container
    //iframe.height = '350px';
    //iframe.width = '100%';
    iframe.style.border = 'none';
    iframe.classList.add('embed-responsive-item');

    //empty previous for it
    self.clearDiv(regionElement);

    //add to container
    regionElement.appendChild(iframe);
    // regionElement.appendChild(iframeWrapper);
  };

  /**
   * add iframe, and populate
   * @param {string} url
   * @param {string} referenceId - dom element
   */
  self.showBehaviourInIframePopover = function(url, referenceId) {
    var domId = 'id_' + referenceId;
    //create the LB for behaviour
    var lightboxWrapper = bccLib.createBehaviourLB(domId);

    var lightbox = lightboxWrapper.querySelector('.ucc-lightbox-wrapper'),
        //lboxHeader = document.querySelector('.ucc-lb-header'), //skip header
        lbClose = lightbox.querySelector('button'),
        lboxiFrame = lightbox.querySelector('iframe');

    //when closing lightbox, fetch next, and move LB wrapper
    lbClose.addEventListener(
        'click',
        function() {
          bccVM.closeBehaviourLB(lightbox, lightboxWrapper, domId);
          bccLib.fetchNextElement(referenceId);
        },
        false,
    );

    //set to iframe src
    lboxiFrame.src = url;

    window.scrollTo(0, 0);
    lightbox.parentNode.classList.add('show-lightbox');
    document.body.classList.add('no-scroll');
  };

  /**
   * Open Url in new window
   * @param url
   */
  self.showBehaviourInNewWindow = function(url) {
    if (bccVM.behWindow === null) {
      bccVM.behWindow = window.open('', '_blank');
      bccVM.behWindow.document.write(
          '<i style="color: #999; font-family: arial, helvetica, sans-serif">Loading, please wait...</i>',
      );
    }

    bccVM.behWindow.location.href = url;
  };

  /**
   * FIXME: passing user object is just a temp solution, need to fix issues in ps-questionnaire service
   * @param targetURL
   * @return {*}
   */
  self.prepareUrl = function(targetURL) {
    //FIXME: passing user object is just a temp solution, need to fix issues in ps-questionnaire service
    var userObject = Base64.encode(JSON.stringify(bccLib.getUser()));
    var newTargetURL =
        targetURL +
        (targetURL.indexOf('?') > -1 ? '&' : '?') +
        'object=' +
        userObject;
    if (bccVM.currentSCId()) {
      newTargetURL =
          newTargetURL + '&parent_reference_id=' + bccVM.currentSCId();
    }
    if (bccVM.currentEpId()) {
      newTargetURL = newTargetURL + '&reference=' + bccVM.currentEpId();
    }
    return newTargetURL;
  };

  self.handleQuizSubmission = function(e) {
    if (e.data.message != 'clicked') {
      return;
    }

    bccVM.behURL(null);

    $('.ucc-preloader').height($('.content-scroller').height() - 10 + 'px');
    //TODO:commented out since throwing undefined error
    //document.querySelector('.ucc-preloader').classList.add('show-ucc-preloader');

    //TODO: comment out for now
    // if nextElement is end, show lesson ended message else get the next element
    // if (bccVM.nextElementIsEnd() === true) {
    //     // show end screen (as a separate function)
    //     console.log('should show end screen');
    //     bccVM.showEndedScreen();
    // } else {
    //     PubSub.publish('showNext', {});
    // }
    // PubSub.publish('showNext', {});

    if (bccVM.behWindow) {
      bccVM.behWindow.close();
      bccVM.behWindow = null;
    } else {
      //for iframe empty container
      //self.emptyContainer();
    }
  };

  // reset ep elements to view again
  self.replayMedia = function(container) {
    var theVideo = container.querySelector('video');

    theVideo.controls = true;
    $(theVideo.nextElementSibling).css(
        'top',
        '-' + $(theVideo).height() + 'px',
    );
    theVideo.nextElementSibling.classList.remove('animate-down');
    theVideo.play();
  };

  // add event handling to MM types
  self.addEPEvents = function(targetEl, targetMedia, referenceId, callback) {
    if (targetMedia === 'video') {
      //targetEl.addEventListener('ended', function() { bccVM.handleVideoEnded(targetEl, referenceId); }, false);
      //targetEl.addEventListener('canplay', bccVM.showNavControls, false);
    }

    if (targetMedia === 'image') {
      targetEl.addEventListener('load', bccVM.showNavControls, false);

      targetEl.addEventListener(
          'click',
          function() {
            bccLib.fetchNextElement(referenceId);
          },
          false,
      );
      $(targetEl).css({cursor: 'pointer'});
    }

    if (targetMedia === 'text') {
      targetEl.addEventListener('load', bccVM.showNavControls, false);

      targetEl.addEventListener(
          'click',
          function() {
            bccLib.fetchNextElement(referenceId);
          },
          false,
      );
      $(targetEl).css({cursor: 'pointer'});
    }

    if (callback) {
      callback();
    }
  };

  self.showNavControls = function() {
    if (bccVM.resizeOnLoad() === true) {
      bccVM.resizeLecturePanel();
      return;
    }
    // turn scroller controls on, slide lecture content in
    try {
      document.querySelector('.course-home').classList.remove('hidden');
    } catch (e) {}

    try {
      document
          .querySelector('.ucc-preloader')
          .classList.remove('show-ucc-preloader');
    } catch (e) {}
  };

  self.resizeLecturePanel = function() {
    var newHeight;

    // temp fix for empty behaviour content
    if ($(self.container).height() === 0) {
      newHeight = '275px';
    } else {
      newHeight =
          $(self.container)
              .parent()
              .height() + 'px';
    }

    setTimeout(function() {
      $('.content-scroller').css('height', newHeight);
      document
          .querySelector('.ucc-preloader')
          .classList.remove('show-ucc-preloader');
    }, 250);
  };

  // self.removeEPEvents = function(targetEl, targetMedia, callback) {
  //     var eventType = (targetMedia === 'video') ? 'ended' : 'click';
  //
  //     targetEl.removeEventListener(eventType, function() { uccLib.doFollowUp(targetEl); }, false);
  //
  //     if (callback) {
  //         callback();
  //     }
  // };

  self.popLightBox = function(el, referenceId) {
    //var mainContainer = self.container || container;

    //  var videoExists = mainContainer.querySelector('video');

    //  if (videoExists) { videoExists.pause(); }

    var mediapath = el.dataset.resource,
        mediatype = mediapath.substring(mediapath.lastIndexOf('.')),
        lightbox = document.querySelector('.ucc-lightbox-wrapper'),
        lboxHeader = document.querySelector('.ucc-lb-header'),
        lbClose = lightbox.querySelector('button'),
        lboxiFrame = lightbox.querySelector('iframe');

    //when closing, fetch next
    lbClose.addEventListener(
        'click',
        function() {
          bccVM.closeLB(lightbox);
          bccLib.fetchNextElement(referenceId);
        },
        false,
    );
    lboxHeader.firstChild.nodeValue =
        'Link: ' + el.querySelector('span').innerHTML;

    if (mediatype == '.pdf') {
      // use the google doc viewer inside of an iframe here (or maybe an object tag?)
      lboxiFrame.src = mediapath;
      window.scrollTo(0, 0);
      lightbox.parentNode.classList.add('show-lightbox');
      document.body.classList.add('no-scroll');

      bccVM.addEPEvents(lbClose, 'text', referenceId);
    } else {
      var forceDownload = document.createElement('a');

      forceDownload.setAttribute('href', mediapath);
      forceDownload.setAttribute(
          'download',
          mediapath.substring(mediapath.lastIndexOf('/')),
      );
      forceDownload.click();
      bccLib.fetchNextElement(referenceId);
    }
  };

  self.closeLB = function(lbox) {
    console.log('called close lb');
    lbox.parentNode.classList.remove('show-lightbox');
    lbox.querySelector('iframe').src = '';
    document.body.classList.remove('no-scroll');
  };

  self.closeBehaviourLB = function(lbox, lightboxWrapper, referenceId) {
    console.log('called close lb');
    lbox.parentNode.classList.remove('show-lightbox');
    lbox.querySelector('iframe').src = '';
    document.body.classList.remove('no-scroll');

    lightboxWrapper.remove();
  };

  self._sendVideoEvent = function(multimedia, eventName, eventData) {};

  /**
   * execute pattern based on parsed SC object from SDK
   * @param {object} multimedia
   * @param {object} mainContainer - div container (document) reference
   */
  self.createAssets = function(
      multimedia,
      region,
      referenceId,
      presentationStyle,
  ) {
    var mainContainer = self.container,
        targetRegion = mainContainer.querySelector(
            '[data-region="' + region + '"]',
        ),
        interStitial = document.createElement('div');


      if (!targetRegion) {
          debugger;
          console.log('problem creating asset for multimedia: '+ JSON.stringify(multimedia));
         // bccLib.fetchNextElement(referenceId);
          return;
      }

    // need to update most of the following functions to include references to the region each element
    // is supposed to be rendered into
    self.clearDiv(targetRegion);
    self.clearIframeResponsive(targetRegion);
    // TODO => create generic link holder for next element (behaviour or multimedia)
    if (bccVM.nextElement() !== null) {
      var anchorWrapper = document.createElement('div');
      // nextElIcon = document.createElement('i'),
      // nextElText = document.createElement('p');

      if (bccVM.nextElement() === 'behaviour') {
        //set text based on behaviour definition
        // nextElText.innerHTML = bccVM.nextElementText();

        // nextElIcon.classList.add('fa', bccVM.nextElementIcon());
        anchorWrapper.addEventListener(
            'click',
            function() {
              //alert('clicked');
              //
              bccLib.fetchNextElement(referenceId);
            },
            false,
        );
      } else if (bccVM.nextElement() === 'multimedia') {
        // var secondIcon = document.createElement('i');

        // nextElText.innerHTML = "Next";
        // nextElIcon.classList.add('glyphicon', 'glyphicon-film');
        // secondIcon.classList.add('glyphicon', 'glyphicon-picture');
        anchorWrapper.addEventListener(
            'click',
            function() {
              bccLib.fetchNextElement(referenceId);
            },
            false,
        );

        // anchorWrapper.appendChild(secondIcon);
      }

      // nextElIcon.classList.add('text-center', 'ucc-qs-icon', 'ucc-chat-icon');

      // anchorWrapper.appendChild(nextElIcon);
      // anchorWrapper.appendChild(nextElText);
      // anchorWrapper.classList.add('ucc-qs-link', 'ucc-chat-imageonly', bccVM.textIconWrapper());

      behContainer = anchorWrapper;

      //if (bccVM.mediaType() === "image") {
      //    targetRegion.appendChild(anchorWrapper);
      //}
    }

    // all stuff related to the interstitial => after the MM is done playing / a click etc
    if (bccVM.mediaType() == 'video') {
      // var followUpOptions = document.createElement('ul'),
      //     replayLink = document.createElement('li'),
      //     replayIconHolder = document.createElement('div'),
      //     followUpReplayIcon = document.createElement('i'),
      //     followUpReplayText = document.createElement('p');

      //TODO: fix video overlay control positioning.  for now comment out
      // followUpReplayText.innerHTML = 'Replay Video';
      //
      // followUpOptions.classList.add('list-unstyled', 'list-inline');
      // followUpReplayIcon.classList.add('fa', 'fa-repeat', 'ucc-replay-icon');
      //
      // // add controls - replay
      // replayIconHolder.appendChild(followUpReplayIcon);
      // replayLink.appendChild(replayIconHolder);
      // replayLink.appendChild(followUpReplayText);
      // replayLink.addEventListener('click', function() { bccVM.replayMedia(targetRegion); }, false)
      //
      // followUpOptions.appendChild(replayLink);
      //
      // if (bccVM.nextElement() !== null) {
      //     var nextElLink = document.createElement('li');
      //
      //     // behContainer.classList.remove('ucc-chat-imageonly', bccVM.textIconWrapper());
      //     nextElLink.classList.add(bccVM.textIconWrapper());
      //
      //     nextElLink.appendChild(behContainer);
      //     followUpOptions.appendChild(nextElLink);
      //
      // }
      //
      // interStitial.appendChild(followUpOptions);
      // interStitial.classList.add('ucc-show-qs', 'text-center');

      targetRegion.style.overflow = 'hidden';
    }

    // parse mm object and create required elements
    if (multimedia.mediaType == 'video') {
      var newVid = document.createElement('video');
      var id = bccVM.currentSCId() + ':' + bccVM.currentEpId();

      //TODO:handle multiple sources: for now assumes mp4 but could be more later
      var dataSetupOptions = {
        aspectRatio: '16:9',
        controls: true,
        preload: 'auto',
        sources: [
          {
            src: multimedia.mediaPath,
            type: 'video/mp4',
          },
        ],
      };
      // $(newVid).attr({'data-setup':dataSetupOptions});
      newVid.id = 'id_' + referenceId;
      // newVid.src = ;
      // newVid.controls = true;
      // newVid.autoplay = true;
      //newVid.classList.add('img-responsive');
      // newVid.classList.add('video-js');
      // newVid.classList.add('vjs-default-skin');

      //bccVM.addEPEvents(newVid, 'video', referenceId, function() {
      if (presentationStyle) {
        $(newVid).css(presentationStyle);
      }

      targetRegion.appendChild(newVid);
      targetRegion.appendChild(interStitial);

      //add video-js
      var player = videojs('id_' + referenceId, dataSetupOptions);

      //for all eventCallback

      //TODO
      // var pluginParams = {
      //     url:'/bcc/video',
      //     referenceId:id,
      //     video: multimedia.mediaPath,
      //     playReference:'id_' +referenceId,
      //     deviceId: dexit.scp.device.resolution.touchpoint.deviceId,
      //     eventsToTrack:['percentsPlayed', 'start', 'end', 'seek', 'play', 'pause', 'volumeChange', 'error', 'fullscreen'],
      //     eventsHandler: function (name, data) {
      //         //todo: now can tap into these events, so look at video and see what events are exposed
      //         var dat = {elementId: multimedia.currentElement.id, event:name, data: data};
      //         console.log(dat);
      //         PubSub.publish('video.event', dat);
      //
      //     }
      // };

      player.ready(function() {
        //initialize player options
        this.addClass('video-js');
        this.addClass('vjs-default-skin');
        //TODO
        //this.ga(pluginParams);
        this.play();
      });

      player.on('ended', function() {
        bccVM.handleVideoEnded(null, referenceId);
        this.dispose();
      });
    }

    if (multimedia.mediaType == 'image') {
      //if targetRegion is already an image node then replace it
      if (targetRegion.nodeName === 'IMG') {
        targetRegion.src = multimedia.mediaPath;
        targetRegion.classList.add("fade-in");
        // targetRegion.classList.add('fade-in')
        if (presentationStyle) {
          //also add visibility:visible
          //$(targetRegion).css(presentationStyle + ';visbility:visible');
          //        $(targetRegion).css('visibility','visible')
          //$(targetRegion).css(presentationStyle);
        }
        bccVM.addEPEvents(targetRegion, 'image', referenceId, function() {
          $(targetRegion).css('visibility', 'visible');
        });
      } else {
        //targetRegion.classList.add('image-only');

        var newImg = document.createElement('img');
        newImg.src = multimedia.mediaPath;
        newImg.classList.add('img-responsive');
        newImg.classList.add("fade-in");

        if (presentationStyle) {
          $(newImg).css(presentationStyle);
        }

        bccVM.addEPEvents(newImg, 'image', referenceId, function() {
          targetRegion.appendChild(newImg);
        });
      }
    }

    // append lecture title
    //var mmHeading = document.createElement('h3');
    //mmHeading.classList.add('ucc-mm-heading', 'follow-up-text');

    if (multimedia.mediaText) {
      var mmText;
      //if it contains html then wrap in div no h3
      if (multimedia.mediaText.indexOf('<') !== -1) {
        mmText = document.createElement('div');
        $(mmText).append(multimedia.mediaText);
      }else {
        var mmTextValue = document.createTextNode(multimedia.mediaText);


        var nodeName = targetRegion.nodeName;
        if (
            nodeName === 'SPAN' ||
            nodeName === 'H1' ||
            nodeName === 'H2' ||
            nodeName === 'P' ||
            nodeName === 'H3' ||
            nodeName === 'H4' ||
            nodeName === 'H5'
        ) {
          targetRegion.appendChild(mmTextValue);
          if (presentationStyle) {
            $(mmTextValue).css(presentationStyle);
          }
        }else {
          mmText = document.createElement('span');
          //mmText.classList.add('brandable-header-text');
          mmText.appendChild(mmTextValue);
          targetRegion.appendChild(mmText);
          if (presentationStyle) {
            $(mmText).css(presentationStyle);
          }
        }
      }
      //var mmText = document.createElement('h3');

      if (targetRegion.nodeName === 'SPAN') {
        $(targetRegion).css('visibility','visible');
      }

      // }else {
      bccVM.addEPEvents(targetRegion, 'text', referenceId);



      // }
    }

    if (multimedia.mediaLinks && multimedia.mediaLinks.length > 0) {
      var linksContainer = document.createElement('div');
      linksContainer.classList.add('ucc-links-wrapper');

      //var mmText = document.createElement('h3');
      if (presentationStyle) {
        $(linksContainer).css(presentationStyle);
      }
      //var targetDiv = (bccVM.mediaType() == 'links') ? mmDiv : mmDiv2;
      //targetDiv.appendChild(linksContainer);
      targetRegion.appendChild(linksContainer);

      var linksHeading = document.createElement('h3');
      linksHeading.classList.add('ucc-mm-heading', 'ucc-links-heading');

      var linksHeadingText = document.createTextNode('Documents');
      linksHeading.appendChild(linksHeadingText);
      linksContainer.appendChild(linksHeading);

      var linkList = document.createElement('ul');
      linkList.classList.add('list-unstyled', 'ucc-links');

      [].forEach.call(multimedia.mediaLinks, function(link) {
        var linkItem = document.createElement('li');
        var linkName = document.createElement('span');
        var linkText = document.createTextNode(link[0]);
        var lBoxIcon = document.createElement('i');

        lBoxIcon.classList.add('fa', 'ucc-links-link');

        if (link[1].substring(link[1].lastIndexOf('.')) !== '.pdf') {
          lBoxIcon.classList.add('fa-cloud-download');
        } else {
          lBoxIcon.classList.add('fa-external-link-square');
        }

        linkName.appendChild(linkText);
        linkItem.appendChild(lBoxIcon);
        linkItem.appendChild(linkName);

        linkItem.dataset.resource = link[1];
        //linkItem.
        linkItem.addEventListener(
            'click',
            function() {
              bccVM.popLightBox(linkItem, referenceId);
            },
            false,
        );
        //linkItem.dataset.bind = 'click: function() { bccVM.popLightBox($element); }';
        linkList.appendChild(linkItem);
      });

      linksContainer.appendChild(linkList);
    }
  };
};

document.addEventListener('DOMContentLoaded', function() {
  bccLib.createLB();
  window.addEventListener('message', bccLib.postMessageListener, false);
});
