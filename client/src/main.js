import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'
import store from './store'

Vue.config.productionTip = false

const config = {
  apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
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
