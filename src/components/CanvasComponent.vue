<template>
  <div id="canvas-box">
    <canvas id="c"></canvas>
  </div>
</template>

<script>

var c = document.getElementById("c");
var ctx = c.getContext("2d");
ctx.beginPath();
ctx.rect(20, 20, 150, 100);
ctx.stroke();



</script>

<style scoped>

</style>
