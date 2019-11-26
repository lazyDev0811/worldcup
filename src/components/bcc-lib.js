// import uuid from "uuid";
//
//
// class bccLib {
//     constructor(parent) {
//         this.parent = parent;
//         this.uuidsToCb = {};
//
//     }
//
//
//     onMessage(srr) {
//         try {
//         var
//         obj = JSON.parse(str);
//         //next get the id
//
//         let
//         id = obj.id;
//
//         if(id) {
//             //get the callback
//             let cb = this.uuidsToCb[obj.id];
//             if (obj.hasError && obj.error) {
//                 var error = new Error(obj.error);
//                 cb(error);
//             } else {
//                 cb();
//                 try {
//                     delete this.uuidsToCb[id];
//                 } catch (e) {
//                     debugger;
//                 }
//             }
//         }
//
//         else {
//         if(obj
//
//     .
//         op
//     &&
//         obj
//     .
//         op
//     ===
//         'dexit.ep.show'
//     ) {
//         debugger;
//         let
//         data = obj.data;
//
//         //now call pusub
//         if(
//             data
//
//     &&
//         data
//     .
//         element
//     &&
//         data
//     .
//         element
//     .
//         intelligence
//     &&
//         data
//     .
//         element
//     .
//         intelligence
//     .
//         epId
//     &&
//         data
//     .
//         element
//     .
//         intelligence
//     .
//         epId
//     .
//
//         startsWith(
//
//         '1111'
//     )
//     ) {
//         debugger;
//
//         if(data
//
//     .
//         element
//     .
//         intelligence
//     .
//         epId
//     ==
//         '111114'
//     ) {
//         selfWeb
//     .
//
//         logoutPress();
//     }
//
//     else
//     if (data.element.intelligence.epId == '111110') {
//
//
//         selfWeb.openCamera();
//
//         debugger;
//     }
//     //alert(data.element.intelligence.epId);
//     } else
//     {
//         selfWeb.dexit.PubSub.publish('dexit.ep.show', data);
//     }
//     } else
//     {
//         console.warn('unknown message:' + str);
//     }
//     }
//     } catch
//     (e)
//     {
//         debugger;
//     }
//     },
//     resetAll: function () {
//         const run = `
//                 setTimeout(() => {
//                   bccLib.resetAll();
//                   console.log('bccLib.resetAll()');
//                 }, 100);
//                 true;`;
//         selfWeb.sendMessage(run);
//     }
//     ,
//     setUser: function (obj) {
//         let objStr = JSON.stringify(obj);
//         const run = `
//                 setTimeout(function() {
//                   let objStr = '${objStr}';
//                   try {
//                     let obj = JSON.parse(objStr);
//                     bccLib.setUser(obj);
//                   }catch(e){}
//                 }, 10);
//                 true;`;
//         selfWeb.sendMessage(run);
//     }
//     ,
//     setErrorStatus: function (err) {
//         debugger;
//         const run = `
//                 setTimeout(() => {
//                   bccLib.setErrorStatus(${err});
//                 }, 100);
//                 true;`;
//         selfWeb.sendMessage(run);
//     }
//     ,
//     show: function (obj, callback) {
//         let id = uuid.v4();
//         try {
//             //FIXME:  remove invalid json that is not used based on serialize/de-serialzation
//             if (obj.nextElement && obj.nextElement.ds) {
//                 delete obj.nextElement.ds;
//             }
//             var objStr = JSON.stringify(obj);
//
//             const run = `
//              setTimeout(() => {
//                   var toShow = ${objStr};
//
//                   bccLib.show('${id}', toShow, function(err) {
//                     //msg back here
//                     //alert('showing');
//                   });
//                 }, 10);
//               `;
//
//             selfWeb.sendMessage(run);
//             this.uuidsToCb[id] = callback;
//         } catch (e) {
//             console.log('invalid json');
//         }
//     }
//     ,
//     prepareMasterContainer: function (layoutId, container, layoutHtml) {
//
//         const layoutHtml2 = layoutHtml.replace(/\r?\n|\r/g, '');
//
//         const run = `
//                  setTimeout(() => {
//                     var layoutId = '${layoutId}';
//                     var container = '${container}';
//                     var layoutHtml = '${layoutHtml2}';
//                     bccLib.prepareMasterContainer(layoutId, container, layoutHtml);
//                     //alert('preparing layout');
//                 }, 10);
//                 `;
//         selfWeb.sendMessage(run);
//         //self.sendMessage(JSON.stringify([layoutId,container, layoutHtml]));
//     }
//
// };
