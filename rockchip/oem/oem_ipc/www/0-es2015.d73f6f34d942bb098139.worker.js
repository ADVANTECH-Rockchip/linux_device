!function(e){var t={};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,(function(t){return e[t]}).bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s="Mp7B")}({Mp7B:function(e,t,o){"use strict";o.r(t);class n{constructor(e){this.module=e}log(e){console.log("["+this.currentTimeStr()+"]["+this.module+"]"+e)}error(e){console.log("["+this.currentTimeStr()+"]["+this.module+"][E] "+e)}info(e){console.log("["+this.currentTimeStr()+"]["+this.module+"][I] "+e)}debug(e){console.log("["+this.currentTimeStr()+"]["+this.module+"][D] "+e)}currentTimeStr(){var e=new Date(Date.now());return e.getFullYear()+"-"+(e.getMonth()+1)+"-"+e.getDate()+" "+e.getHours()+":"+e.getMinutes()+":"+e.getSeconds()+":"+e.getMilliseconds()}}var r=function(e){return e[e.kWebsocket=0]="kWebsocket",e[e.kHttp=1]="kHttp",e}({}),s=function(e){return e[e.kGetFileInfoReq=0]="kGetFileInfoReq",e[e.kDownloadFileReq=1]="kDownloadFileReq",e[e.kCloseDownloaderReq=2]="kCloseDownloaderReq",e}({}),a=function(e){return e[e.kGetFileInfoRsp=0]="kGetFileInfoRsp",e[e.kFileData=1]="kFileData",e}({});const l=new class{constructor(){this.logger=new n("Downloader"),this.ws=null}appendBuffer(e,t){let o=new Uint8Array(e.byteLength+t.byteLength);return o.set(new Uint8Array(e),0),o.set(new Uint8Array(t),e.byteLength),o.buffer}reportFileSize(e,t){let o={type:a.kGetFileInfoRsp,data:{i:{sz:e,st:t}}};this.logger.info("File size "+e+" bytes."),postMessage(o)}reportData(e,t,o,n){postMessage({type:a.kFileData,data:{s:e,e:t,d:n,q:o}},[n])}getFileInfoByHttp(e){this.logger.info("Getting file size "+e+".");let t=0,o=0,n=!1,r=new XMLHttpRequest;r.open("get",e,!0);let s=this;r.onreadystatechange=()=>{let e=parseInt(r.getResponseHeader("Content-Length"),10);e&&(t=e),r.status&&(o=r.status),!n&&(t>0&&o>0||4==r.readyState)&&(s.reportFileSize(t,o),n=!0,r.abort())},r.send()}downloadFileByHttp(e,t,o,n){let r=new XMLHttpRequest;r.open("get",e,!0),r.responseType="arraybuffer",r.setRequestHeader("Range","bytes="+t+"-"+o);let s=this;r.onload=()=>s.reportData(t,o,n,r.response),r.send()}requestWebsocket(e,t,o){if(null==this.ws){this.ws=new WebSocket(e),this.ws.binaryType="arraybuffer";const n=this;this.ws.onopen=e=>{n.logger.info("Ws connected."),n.ws.send(t)},this.ws.onerror=e=>{n.logger.error("Ws connect error "+e.type)},this.ws.onmessage=o.onmessage}else this.ws.onmessage=o.onmessage,this.ws.send(t)}getFileInfoByWebsocket(e){this.logger.info("Getting file size "+e+".");let t=null,o=this;this.requestWebsocket(e,JSON.stringify({url:e,cmd:"size"}),{onmessage:function(e){if(console.log("info",e),t=null!=t?o.appendBuffer(t,e.data):e.data.byteLength<4?e.data.slice(0):e.data,4==t.byteLength){let e=new Int32Array(t,0,1);o.reportFileSize(e[0],200)}}})}downloadFileByWebsocket(e,t,o,n){let r=null,s=o-t+1,a=this;this.requestWebsocket(e,JSON.stringify({url:e,cmd:"data",start:t,end:o}),{onmessage:function(e){console.log("dw",e),null!=r?(console.log("dw0",e),r=a.appendBuffer(r,e.data)):e.data.byteLength<s?(r=e.data.slice(0),console.log("dw1",r)):(r=e.data,console.log("dw2",r)),r.byteLength==s&&(console.log("repo data",r),a.reportData(t,o,n,r))}})}getFileInfo(e,t){switch(e){case r.kHttp:this.getFileInfoByHttp(t);break;case r.kWebsocket:this.getFileInfoByWebsocket(t);break;default:this.logger.error("Invalid protocol "+e)}}downloadFile(e,t,o,n,s){switch(e){case r.kHttp:this.downloadFileByHttp(t,o,n,s);break;case r.kWebsocket:this.downloadFileByWebsocket(t,o,n,s);break;default:this.logger.error("Invalid protocol "+e)}}};addEventListener("message",({data:e})=>{l||console.error("Downloader is not initialized");let t=e;switch(t.type){case s.kGetFileInfoReq:l.getFileInfo(t.data.p,t.data.u);break;case s.kDownloadFileReq:l.downloadFile(t.data.p,t.data.u,t.data.s,t.data.e,t.data.q);break;case s.kCloseDownloaderReq:break;default:l.logger.error("Unsupport messsage "+e.type)}})}});