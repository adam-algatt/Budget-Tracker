// ability to enter deposits offline

// ability to enter expenses offline

// Offline entries should be added to the tracker when the application is brought back online.
const APP_PREFIX = 'PennyPincher-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "/index.html",
    "/icons/icon-72x72.png",
    "/icons/icon-96x96.png",
    "/icons/icon-128x128.png",
    "/icons/icon-144x144.png",
    "/icons/icon-152x152.png",
    "/icons/icon-192x192.png",
    "/icons/icon-384x384.png",
    "/icons/icon-512x512.png",
    "/js/idb.js",
    "/js/index.js",
    "/manifest.json",
    "/css/style.css",
  ];

//   check module codesnap if  'return request || fetch(e.request)' doesn't
// work as intended

// return cached resources
  self.addEventListener('fetch', function(e) {
    console.log(`fetch request: ${e.request.url}`);
    e.respondWith(
    caches.match(e.request).then(function (request) {
        console.log(`responding with cache:  ${e.request.url}`);
        return request || fetch(e.request)
    })
)
})

//cache new resources 
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
          console.log('installing cache : ' + CACHE_NAME)
          return cache.addAll(FILES_TO_CACHE)
        })
    )
        })

        self.addEventListener('activate', function(e) {
            e.waitUntil(
                caches.keys().then(function (keyList) {
                  // `keyList` contains all cache names under your username.github.io
                  // filter out ones that has this app prefix to create keeplist
                  let cacheKeeplist = keyList.filter(function (key) {
                    return key.indexOf(APP_PREFIX);
                  })
                  // add current cache name to keeplist
                  cacheKeeplist.push(CACHE_NAME);
            
                  return Promise.all(keyList.map(function (key, i) {
                    if (cacheKeeplist.indexOf(key) === -1) {
                      console.log('deleting cache : ' + keyList[i] );
                      return caches.delete(keyList[i]);
                    }
                  }));
                })
              );
            });
        
