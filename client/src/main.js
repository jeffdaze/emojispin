import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'
import store from './store'

Vue.config.productionTip = false

const config = {
  apiKey: "AIzaSyACIlh81s06tr_ojPXHahSvkwMoD6j8mNA",
    authDomain: "emojispin.firebaseapp.com",
    databaseURL: "https://emojispin.firebaseio.com",
    projectId: "emojispin",
    storageBucket: "emojispin.appspot.com",
    messagingSenderId: "111067851384",
    appId: "1:111067851384:web:49aa95770647ba14085b8d",
    measurementId: "G-F3NTCRYGBZ"
}

firebase.initializeApp(config)

export const db = firebase.firestore();
export const fba = firebase.auth();
//need this to access the array update methods in the plain firestore object...
export const fbs = firebase;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
