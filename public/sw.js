const foo = e => console.log(e)

self.addEventListener('install', foo)
self.addEventListener('fetch', foo)