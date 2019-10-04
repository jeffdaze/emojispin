<template>
  <div id="app">
    <h1>EmojiSpin</h1>
    <app-spinner :credits="credits"></app-spinner>
    <p>Any two matching icons: win 10 credits</p>
    <p>All three matching icons: win 200 credit jackpot!</p>
  </div>
</template>

<script>
import spinner from './components/spinner.vue'

export default {
  name: 'app',
  data: function () {
      //this is a default amount of credits to init a first time user...
      return {
        credits: 10
      };
  },
  components: {
    appSpinner: spinner
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
