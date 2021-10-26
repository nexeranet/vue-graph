<script setup>
import Chart from "./components/Chart.vue";
</script>

<template>
  <Chart />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-family: "IBM Plex Mono", monospace;
  /* background-image: url("./assets/crop-screen.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center; */
  min-height: 100vh;
}
html {
  background-color: #000;
  background-image: url("./assets/bg-bricks.gif");
  background-repeat: repeat;
}
button {
  background: rgb(246, 247, 249);
  color: rgb(60, 60, 59);
  font-weight: bold;
  box-shadow: rgb(194 202 214) 0px 0.2em, rgb(194 202 214) 0px -0.2em,
    rgb(194 202 214) 0.2em 0px, rgb(194 202 214) -0.2em 0px;
  line-height: 1em;
  margin: 0px 20px 20px 0px;
  padding: 10px 20px;
  font-size: 21px;
  border: none;
  text-transform: uppercase;
  cursor: pointer;
}
input {
  background: rgb(246, 247, 249);
  color: rgb(60, 60, 59);
  font-weight: bold;
  box-shadow: rgb(194 202 214) 0px 0.2em, rgb(194 202 214) 0px -0.2em,
    rgb(194 202 214) 0.2em 0px, rgb(194 202 214) -0.2em 0px;
  line-height: 1em;
  padding: 10px 20px;
  margin: 0px 20px 20px 0px;
  font-size: 21px;
  transition: all 0.2s ease;
}
button:hover,
input:hover {
  transform: scale(1.05);
}
</style>
