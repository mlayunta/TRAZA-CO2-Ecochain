/* ECOCHAIN AUDIT · TRAZA//CO2 — Service Worker v3.3.1 (sin conexión · maqueta de datos sintéticos) */
'use strict';
var VERSION='3.4.1';   // antes 3.4.0
var C={static:'tco-static-v'+VERSION,runtime:'tco-runtime-v'+VERSION,data:'tco-data-v'+VERSION};
var PRECACHE=['./','./index.html','./manifest.json','./icon-cart.svg','./icon-maskable.svg','./README.md','./LICENSE'];
var EXT=/\.(css|js|mjs|svg|png|jpg|jpeg|webp|gif|woff2?|ttf|ico|webmanifest)$/i;
function log(){var a=['%c[SW '+VERSION+']','color:#3ecf8e;font-weight:700'];for(var i=0;i<arguments.length;i++)a.push(arguments[i]);console.log.apply(console,a)}

self.addEventListener('install',function(e){
e.waitUntil(caches.open(C.static).then(function(cache){
  return Promise.allSettled(PRECACHE.map(function(u){return cache.add(u)}));
}).then(function(res){
  var ok=res.filter(function(r){return r.status==='fulfilled'}).length;
  log('precache '+ok+'/'+PRECACHE.length);return self.skipWaiting()})));
});

self.addEventListener('activate',function(e){
e.waitUntil(caches.keys().then(function(keys){
  var keep=Object.keys(C).map(function(k){return C[k]});
  return Promise.all(keys.filter(function(k){return keep.indexOf(k)<0}).map(function(k){return caches.delete(k)}));
}).then(function(){return self.clients.claim()}).then(function(){
  if(self.registration.sync){self.registration.sync.register('audit-queue').catch(function(){})}
  if(self.registration.periodicSync){self.registration.periodicSync.register('inventario-mensual',{minInterval:86400000}).catch(function(){})}
  log('activo');
}));
});

function isData(u){return /\/(api|data)\//.test(u.pathname)||/\.data\.json$/i.test(u.pathname)}
function isStatic(u){return u.origin===self.location.origin&&(EXT.test(u.pathname)||u.pathname.slice(-1)==='/')}

function fallback(req){
if(req.destination==='document'||req.mode==='navigate'){
  return caches.match('./index.html').then(function(r){return r||new Response('<!doctype html><meta charset=utf-8><body style="font-family:system-ui;background:#071a14;color:#eaf5ef;display:grid;place-items:center;height:100vh;margin:0"><h1>TRAZA//CO2</h1><p>Sin conexión y sin caché. Recarga una vez en línea.</p>',{headers:{'Content-Type':'text/html'},status:200})});
}
if(isData(new URL(req.url)))return new Response(JSON.stringify({offline:true,stale:true,demo:true}),{headers:{'Content-Type':'application/json'},status:200});
return new Response('',{status:504,statusText:'Offline'});
}
function cacheFirst(req,name){
return caches.match(req).then(function(hit){
  if(hit){fetch(req.clone()).then(function(r){if(r&&r.ok)caches.open(name).then(function(c){c.put(req,r.clone())})}).catch(function(){});return hit}
  return fetch(req).then(function(r){if(r&&r.ok){var cl=r.clone();caches.open(name).then(function(c){c.put(req,cl)})}return r}).catch(function(){return fallback(req)});
});
}
function networkFirst(req,name,timeout){
return new Promise(function(res){
  var t=setTimeout(function(){caches.match(req).then(function(c){res(c||fallback(req))})},timeout||3500);
  fetch(req.clone()).then(function(r){clearTimeout(t);if(r&&r.ok){var cl=r.clone();caches.open(name).then(function(c){c.put(req,cl)})}res(r)})
    .catch(function(){clearTimeout(t);caches.match(req).then(function(c){res(c||fallback(req))})});
});
}

self.addEventListener('fetch',function(e){
var r=e.request;if(r.method!=='GET')return;
var u=new URL(r.url);
if(u.protocol!=='http:'&&u.protocol!=='https:')return;
if(u.origin!==self.location.origin)return;
if(isData(u)){e.respondWith(networkFirst(r,C.data));return}
if(isStatic(u)){e.respondWith(cacheFirst(r,C.static));return}
e.respondWith(cacheFirst(r,C.runtime));
});

self.addEventListener('message',function(e){
var d=e.data||{};
if(d.type==='SKIP_WAITING')self.skipWaiting();
if(d.type==='GET_VERSION')e.source.postMessage({type:'VERSION',version:VERSION});
if(d.type==='PURGE_CACHES')e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){return caches.delete(k)}))}));
});

var QUEUE='tco-audit-queue';
function readQueue(){
return new Promise(function(res){
  if(!('indexedDB' in self))return res([]);
  var o=indexedDB.open('tco',1);
  o.onupgradeneeded=function(){o.result.createObjectStore(QUEUE,{keyPath:'id',autoIncrement:true})};
  o.onsuccess=function(){var tx=o.result.transaction(QUEUE,'readonly'),g=tx.objectStore(QUEUE).getAll();g.onsuccess=function(){res(g.result||[])};g.onerror=function(){res([])}};
  o.onerror=function(){res([])};
});
}
function flushQueue(){
return readQueue().then(function(items){
  if(!items.length)return 0;
  return items.reduce(function(p,it){return p.then(function(n){
    return fetch('/api/audit/registrations',{method:'POST',headers:{'Content-Type':'application/json','X-Client':'TRAZA-CO2-PWA/'+VERSION},body:JSON.stringify(it)}).then(function(r){return r.ok?n+1:n}).catch(function(){return n});
  })},Promise.resolve(0)).then(function(n){log('cola sincronizada',n+'/'+items.length);return n});
});
}
self.addEventListener('sync',function(e){if(e.tag==='audit-queue')e.waitUntil(flushQueue())});
self.addEventListener('periodicsync',function(e){if(e.tag==='inventario-mensual')e.waitUntil(flushQueue())});
self.addEventListener('push',function(e){
var p={};try{p=e.data?e.data.json():{}}catch(x){p={title:'TRAZA//CO2',body:e.data&&e.data.text()}}
e.waitUntil(self.registration.showNotification(p.title||'TRAZA//CO2 · aviso de cadena',{body:p.body||'Nuevo hallazgo de auditoría pendiente de revisión.',icon:'./icon-cart.svg',badge:'./icon-cart.svg',tag:p.tag||'tco',data:{url:p.url||'./index.html#/audit'},actions:[{title:'Ver informe',action:'open'},{title:'Aplazar',action:'snooze'}]}));
});
self.addEventListener('notificationclick',function(e){
e.notification.close();
e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(l){
  for(var i=0;i<l.length;i++){if('focus' in l[i])return l[i].focus()}
  return self.clients.openWindow((e.notification.data&&e.notification.data.url)||'./index.html');
}));
});
if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().then(function(ok){ok&&log('almacenamiento persistente')});