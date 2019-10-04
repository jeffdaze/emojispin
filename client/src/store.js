import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/main'
 
Vue.use(Vuex)
 //use our store to hold the user coin state and update realtime from the db...
export default new Vuex.Store({
  state: {
    userCoins: null,
    userId: null,
    userMessage: null
  },
  getters: {
    getCoins: state => {
      return state.userCoins;
    },
    getUserId: state => {
        return state.userId;
    },
    getUserMessage: state => {
        return state.userMessage;
    }
  },
  mutations: {
    setCoins: state => {
        db.collection('items').doc(state.userId).onSnapshot(
            docData => {
                //set the credits to the value from the db...
                state.userCoins = docData.data().credits;
            })
    },
    setUserMessage: state => {
        db.collection('items').doc(state.userId).onSnapshot(
            docData => {
                //set the message to display to the user from the db...
                state.userMessage = docData.data().message;
            })
    },
    setUserId: (state, newValue) => {
        state.userId = newValue;
    }
  },
  actions: {
    setCoins: context => {
      context.commit('setCoins');
    },
    setUserId: context => {
        context.commit('setUserId');
    },
    setUserMessage: context => {
        context.commit('setUserMessage');
    }
  }
})