"use strict";
const htmlBuilder = (arr) => `<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>audio</title>
    <style>
      body > div {
        display: flex;
        width: 100%;
        justify-content: space-between;
      }
    </style>
  </head>
  <body style="max-width: 600px">
    <div>
      <div>
        <a href="https://t.bilibili.com/469580598520318461">春丽姐的切片</a
        >的镜像 随缘同步 请善用网页内搜索
      </div>
    </div>
     ${arr
       .map(
         (v) => `<div>
     <a href="./${v.name}"
       >${v.name} </a
     ><span>${v.size}MiB</span>
   </div>`
       )
       .join("")}
  </body>
</html>
`;
const indexHtmlBuilder = (arr) => `
<!doctype html><html lang="en"><head><meta charset="utf-8"/><link rel="icon" href="/5424/favicon.ico"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#000000"/><meta name="description" content="Web site created using create-react-app"/><link rel="apple-touch-icon" href="/5424/logo192.png"/><link rel="manifest" href="/5424/manifest.json"/><title>React App</title><style>body{height:100%}html{height:100%}#root{height:100%}</style></head><body><noscript>You need to enable JavaScript to run this app.</noscript><script id="data" type="json">${JSON.stringify(
  arr
)}</script><div id="root"></div><script>!function(e){function r(r){for(var n,a,i=r[0],c=r[1],l=r[2],p=0,s=[];p<i.length;p++)a=i[p],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&s.push(o[a][0]),o[a]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);for(f&&f(r);s.length;)s.shift()();return u.push.apply(u,l||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,i=1;i<t.length;i++){var c=t[i];0!==o[c]&&(n=!1)}n&&(u.splice(r--,1),e=a(a.s=t[0]))}return e}var n={},o={1:0},u=[];function a(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,a),t.l=!0,t.exports}a.e=function(e){var r=[],t=o[e];if(0!==t)if(t)r.push(t[2]);else{var n=new Promise((function(r,n){t=o[e]=[r,n]}));r.push(t[2]=n);var u,i=document.createElement("script");i.charset="utf-8",i.timeout=120,a.nc&&i.setAttribute("nonce",a.nc),i.src=function(e){return a.p+"static/js/"+({}[e]||e)+"."+{3:"201e39d3"}[e]+".chunk.js"}(e);var c=new Error;u=function(r){i.onerror=i.onload=null,clearTimeout(l);var t=o[e];if(0!==t){if(t){var n=r&&("load"===r.type?"missing":r.type),u=r&&r.target&&r.target.src;c.message="Loading chunk "+e+" failed.\\n("+n+": "+u+")",c.name="ChunkLoadError",c.type=n,c.request=u,t[1](c)}o[e]=void 0}};var l=setTimeout((function(){u({type:"timeout",target:i})}),12e4);i.onerror=i.onload=u,document.head.appendChild(i)}return Promise.all(r)},a.m=e,a.c=n,a.d=function(e,r,t){a.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,r){if(1&r&&(e=a(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(a.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)a.d(t,n,function(r){return e[r]}.bind(null,n));return t},a.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(r,"a",r),r},a.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},a.p="/5424/",a.oe=function(e){throw console.error(e),e};var i=this.webpackJsonpplayer=this.webpackJsonpplayer||[],c=i.push.bind(i);i.push=r,i=i.slice();for(var l=0;l<i.length;l++)r(i[l]);var f=c;t()}([])</script><script src="/5424/static/js/2.2a73e4f1.chunk.js"></script><script src="/5424/static/js/main.e07c9341.chunk.js"></script></body></html>
`;
const oss = require("ali-oss");
exports.handler = (event, context, callback) => {
  const ossClient = new oss({
    region: "oss-cn-shanghai",
    accessKeyId: context.credentials.accessKeyId,
    accessKeySecret: context.credentials.accessKeySecret,
    stsToken: context.credentials.securityToken,
    internal: true,
    bucket: "d-l",
  });
  ossClient
    .list({
      prefix: "5424", // 指定需要列举的存储空间的前缀。
      "max-keys": 1000,
    })
    .then((res) => {
      let arr = res.objects
        .map((v) => {
          return { name: v.name.replace("5424/", ""), size: v.size >> 20 };
        })
        .filter((v) => v.name.includes(".mp3"));
      const html = htmlBuilder(arr);
      const indexHtml = indexHtmlBuilder(
        arr.map((v) => v.name.replace(".mp3", ""))
      );
      Promise.all([
        ossClient.put("5424/5424.html", Buffer.from(html)),
        ossClient.put("5424/index.html", Buffer.from(indexHtml)),
      ])
        .then((res) => {
          callback(null, JSON.stringify(res));
        })
        .catch((err) => {
          callback(null, JSON.stringify(err));
        });
    })
    .catch((err) => callback(null, JSON.stringify(err)));
};
