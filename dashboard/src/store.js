import Vue from "vue";
import Vuex from "vuex";
import { db } from '@/main'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    players: null
  },
  getters: {
    getPlayers: state => {
      return state.players
    }
  },
  mutations: {
    setPlayers: state => {
      let players = [];

      db.collection('items').onSnapshot((snapshot) => {
        players = [];
        snapshot.forEach(docData => {
          //build our player object here...
          //most data is contained in 'spins'
          //length of this represents the number of times they have played...
          let wins = 0;
          let coinsWon = 0;
          let jackpots = 0;

          docData.data().spins.forEach(spinData=>{
            if(spinData.result.victory != ""){
                wins++;
                if(spinData.result.victory == "jackpot"){
                    jackpots++;
                }
                //coinsUp should be 0 in all other cases...
                coinsWon += spinData.result.coinsUp;
            }
          });

          players.push({
              playerID: docData.id,
              currentCoins: docData.data().credits,
              turns: docData.data().spins.length,
              wins: wins,
              coinsWon: coinsWon,
              jackpots: jackpots
          });
          
      });

        state.players = players;
      })
    }
  },
  actions: {
    setPlayers: context => {
      context.commit('setPlayers')
    }
  }
});
