<template>
  <div class="map-selector-wrapper">
    <div id="box-label">BATTLEGROUND: {{ Arena }}</div>

    <div id="map-window">
      <img
        src="C:\Users\james\workspace\side-projects\crusader-games\bug-wars\bug-wars-Frontend\src\assets\maps\Screenshot 2024-03-29 183705.png"
        alt=""
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style scoped>
.map-selector-wrapper {
  width: fit-content;
  height: fit-content;
}

#box-label {
  grid-area: map-select;
  justify-self: center;
  align-self: end;
  color: #53b290;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: 'Michroma', sans-serif;
}

img {
  width: auto;
  height: auto;
}

#map-window {
  grid-area: map-window;
  width: 672px;
  height: 672px;
}

#level-name {
  grid-area: level-name;
  color: #53b290;
  font-size: 15px;
  font-weight: bold;
  font-family: 'Michroma', sans-serif;
  border: solid green 3px;
}

.v-enter-active,
.v-leave-active {
  transition:
    opacity 2s ease,
    transform 1s ease-in-out;
  transform: translateY(0px);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(100px);
}
</style>
