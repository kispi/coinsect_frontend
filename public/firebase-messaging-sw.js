importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyDlu7u3lb91ezUMExLxQSdD3aA3FnQ-AWg',
  authDomain: 'coinsect-26edd.firebaseapp.com',
  projectId: 'coinsect-26edd',
  storageBucket: 'coinsect-26edd.appspot.com',
  messagingSenderId: '504356303167',
  appId: '1:504356303167:web:ec6fab1b5dd75ae211638a',
  measurementId: 'G-S9HP3XL2VE',
})

firebase.messaging() // 이 라인을 실행해야 메시지가 받아지는듯