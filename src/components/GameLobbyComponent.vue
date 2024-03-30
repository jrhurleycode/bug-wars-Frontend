<template>
  <Transition appear>
    <div class="transition-wrapper">
      <div class="lobby-wrapper">
        <!-- <div id="image">
      <img id="logo" src="..\assets\bugwars-logo.png" alt="" />
    </div> -->

        <div class="game-species">
          <div id="map">
            <map-selector-component />
          </div>

          <div id="species-selector">
            <species-selector-component />
          </div>
        </div>
      </div>
      <div id="start-button">
        <start-button-component />
      </div>
    </div>
  </Transition>
</template>

<script>
import MapSelectorComponent from './MapSelectorComponent.vue'
import SpeciesSelectorComponent from './SpeciesSelectorComponent.vue'
import StartButtonComponent from './StartButtonComponent.vue'
export default {
  components: { MapSelectorComponent, SpeciesSelectorComponent, StartButtonComponent }
}
</script>

<style scoped>
.lobby-wrapper {
  display: flex;
  justify-content: center;
}

#start-button {
  display: flex;
  justify-content: center;
  align-self: center;
  margin-top: 20px;
}

.game-species {
  display: flex;
  justify-content: center;
  gap: 20px;
  width: fit-content;
  padding: 20px;
  background: rgba(10, 17, 28, 0.6);
  padding-left: 50px;
  padding-bottom: 50px;
  border-radius: 30px;
}

#species-selector {
  display: flex;
}

#map {
  grid-area: map;
  display: flex;
  justify-content: center;
}

#image {
  display: flex;
  justify-content: center;
  grid-area: image;
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
