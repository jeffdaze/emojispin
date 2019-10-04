<template>
    <div>
        <h3>EmojiSpin Dashboard</h3>
        <div v-for="player in $store.getters.getPlayers" v-bind:key="player.playerID" class="dataBlock">
            Player ID: {{ player.playerID }}
            <table>
                <thead>
                    <tr>
                        <th>Current Coins</th>
                        <th>Turns</th>
                        <th>Wins</th>
                        <th>Jackpots</th>
                        <th>Win Ratio</th>
                        <th>Coins Won</th>
                        <th>Plus/Minus</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ player.currentCoins }}</td>
                        <td>{{ player.turns }}</td>
                        <td>{{ player.wins }}</td>
                        <td>{{ player.jackpots }}</td>
                        <td>{{ Math.round(( player.wins / player.turns ) * 100)  }}%</td>
                        <td>{{ player.coinsWon }}</td>
                        <td>{{ player.coinsWon - player.turns }}</td>
                    </tr>
                </tbody>
            </table>
            <p>
                <span>Grant coins: <button @click="setCoins(player.playerID, player.currentCoins + 10)">10</button> <button @click="setCoins(player.playerID, player.currentCoins + 20)">20</button> <button @click="setCoins(player.playerID, player.currentCoins + 50)">50</button></span>
                <span class="setMessage">Set Message: <input type="text" v-model="player.userMessage"><button @click="setMessage(player.playerID, player.userMessage)">Send</button></span>   
            </p>
        </div>
    </div>
</template>

<script>
//get firebase stuff...
import { db } from "@/main"

export default {
    data: function(){
        return {
            players: [],
            userMessage: ""
        };
    },
    beforeCreate: function(){
        this.$store.dispatch('setPlayers');
    },
    methods: {
        setCoins(playerID, adjustedCoins){
            db.collection('items').doc(playerID).update({
                credits: adjustedCoins
            }).then((response) => {
                if (response) {
                    //handle response here...
                }
            }).catch((error) => {
                this.errors = error
            })
            
        },
        setMessage(playerID, newMessage){
            db.collection('items').doc(playerID).update({
                message: newMessage
            }).then((response) => {
                if (response) {
                    //handle response here...
                }
            }).catch((error) => {
                this.errors = error
            })

        }
    }
};
</script>

<style scoped>
.dataBlock {
    display: inline-block;
    text-align: left;
    margin: 20px auto;
    border:1px solid rgb(67, 129, 170);
    padding: 20px;
}

table {
  border: 2px solid #42b983;
  border-radius: 3px;
  background-color: #fff;
}

th {
  background-color: #42b983;
  color: rgba(255,255,255,0.66);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: #f9f9f9;
  text-align: right;
}

th, td {
  min-width: 60px;
  padding: 10px 20px;
}

.setMessage{
    float:right;
}
</style>
