import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js'
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging.js'

window.__coinsect__firebase__ = {
  token: null,
  init: async () => {
    initializeApp({
      apiKey: 'AIzaSyDlu7u3lb91ezUMExLxQSdD3aA3FnQ-AWg',
      authDomain: 'coinsect-26edd.firebaseapp.com',
      projectId: 'coinsect-26edd',
      storageBucket: 'coinsect-26edd.appspot.com',
      messagingSenderId: '504356303167',
      appId: '1:504356303167:web:ec6fab1b5dd75ae211638a',
      measurementId: 'G-S9HP3XL2VE',
    })

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return Promise.reject({ data: { message: '브라우저 알림 권한을 허용해주세요' } })

    const messaging = getMessaging()

    // onMessage(messaging, payload => {
    //   FIREBASE FOREGROUND MESSAGE
    // })

    window.__coinsect__firebase__.token = await getToken(
      messaging,
      { vapidKey: 'BNeQwwS1NRfgBhF499ApF_MBawGTkzhiR94Wi3D4Tegqc5ii95k2m4HCzw_eCK2CE5FBDFr0ESHylPcNcRwiEI8' },
    )
  },
}