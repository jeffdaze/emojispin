import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import firebase from "firebase"

Vue.config.productionTip = false;

const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

firebase.initializeApp(config);

export const db = firebase.firestore();
//need this to access the array update methods in the plain firestore object...
export const fbs = firebase;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
