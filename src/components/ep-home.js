module.exports = function() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
<!--    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">-->
    <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />

    <title>Title</title>
    
    <!-- loader icon -->
    
    <link rel="stylesheet" href="https://s3.us-south.cloud-object-storage.appdomain.cloud/dex-resource-00/layouts/sadad-branded/loader/css/main.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.4.1/css/bootstrap.min.css" integrity="sha256-bZLfwXAP04zRMK2BjiO8iu9pf4FbLqX6zitd+tIvLhE=" crossorigin="anonymous" />
    <link href="https://s3.us-south.cloud-object-storage.appdomain.cloud/00-dex-release/ucc/0.3.23/assets/style/ucc-main.css" rel="stylesheet">
<!--    <link rel="stylesheet" href="https://releases.dexit.co/dex-css-master/0.0.40/ice4m_main.css">-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.6.5/video-js.min.css" integrity="sha256-kflKPH4F0cGv0BJg6I6+pb5nIO01FMeoK7qWoz1NayE=" crossorigin="anonymous" />
<!--    <link href="https://3pa.cdnedge.bluemix.net/ajax/libs/video.js/6.3.3/video-js.css" rel="stylesheet">-->
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    
    
    <style>
       body {font-family: 'Lato', sans-serif; background: #FFFFFF;}
    </style>
    

</head>
<body>
<!--    <H1> running..</H1>-->
    <div class="status"></div>
    
   <div id="tog" class="con fade-in fade-out">
    <div class="preloader">
      <img src="https://s3.us-south.cloud-object-storage.appdomain.cloud/dex-resource-00/layouts/sadad-branded/loader/images/spinner.svg" alt="spinner">
      <p class="fade-in">LOADING...</p>
    </div>
  </div>
    <div id="merch-container" style="width:100%">  
    </div>
    <script type="application/javascript">

        // Create Base64 Object
        var Base64 = {


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

                input = input.replace(/[^A-Za-z0-9\\+\\/\\=]/g, "");

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
                string = string.replace(/\\r\\n/g, "\\n");
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

    </script>
    
    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js" integrity="sha256-VeNaFBVDhoX3H+gJ37DpT/nTuZTdjYro9yBruHjVmoQ=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pubsub-js/1.7.0/pubsub.min.js" integrity="sha256-QF0bsKIv/J8eC1vj+f/xSmLSME+ztgCsUVYSR6hdHjE=" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min.js" integrity="sha256-owX7sroiO/O1a7h3a4X29A1g3QgqdNvijRQ7V5TH45M=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.6.5/video.min.js" integrity="sha256-DDYBI87lVdSZOudgc6hh30NBPNzbLZqxBOwwmicNeB0=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/jsonata/jsonata.min.js"></script>
    <script src="https://s3.us-south.cloud-object-storage.appdomain.cloud/dex-resource-00/js/jsonform/2.1.5/jsonform-patched.js"></script>
    <script src="https://s3.us-south.cloud-object-storage.appdomain.cloud/dex-resource-00/js/jsonform/2.1.5/jsv.js"></script>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.min.js" integrity="sha256-gAx3c/BXS1tVc72JrzzIsPxrs2jW+96PfM+Xwwvb9pk=" crossorigin="anonymous"></script>

    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/async/2.6.3/async.min.js"></script>
    
    <script src="https://s3.us-south.cloud-object-storage.appdomain.cloud/00-dex-release/bcc-presentation-react/0.1.2/bcc-main-multi-layout-post-message-bypass.js"></script>
    
<!--    <script src="https://3pa.cdnedge.bluemix.net/ajax/libs/video.js/6.3.3/video.js"></script>-->
<!--    <script src="https://releases.dexit.co/bcc-presentation-react/main.js"></script>-->
     
<!--     <script type="application/javascript">-->
<!--        $( document ).ready(function() {-->
<!--        -->
<!--            // if (window && window.bccLib) {-->
<!--            //     $('.status').append('<h1>bccLib loaded</h1>')-->
<!--            // } else {-->
<!--            //      $('.status').append('<h1>bccLib not loaded</h1>')-->
<!--            // }-->
<!--                -->
<!--            -->
<!--        })      -->
<!--    </script>-->
<!--    -->
    <script>
    
        function keyboardShown() {
            debugger;
            console.log('keyboard shown');
            jQuery('div.bottom-menu').attr('hidden',true);

        }
        
        function keyboardHidden() {
            console.log('keyboard hidden');
            jQuery('div.bottom-menu').removeAttr('hidden');
    
        }
        
    </script>
    
    
    
<!--    jQuery(document).ready(function() {-->

<!--        jQuery(".hover-home .form-group input").each(function() {-->
<!--            if (jQuery(this).val().length > 0) {-->
<!--                jQuery(this).closest(".form-group").addClass("hasvalue");-->
<!--            } else {-->
<!--                jQuery(this).closest(".form-group").removeClass("hasvalue");-->
<!--            }-->
<!--        });-->
<!--        jQuery(".hover-home .form-group input").on("input", function() {-->
<!--            if (jQuery(this).val().length > 0) {-->
<!--                jQuery(this).closest(".form-group").addClass("hasvalue");-->
<!--            } else {-->
<!--                jQuery(this).closest(".form-group").removeClass("hasvalue");-->
<!--            }-->
<!--        });-->
<!--    });-->
<!--    </script>-->
<!--    -->
    
    
</body>


</html>
`;
};
