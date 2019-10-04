<template>
  <div id="app">
    <dataview></dataview>
  </div>
</template>

<script>
import dataview from './components/dataview.vue'


export default {
  name: "app",
  components: {
    dataview
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
