<template>
  <Transition appear>
    <div class="transition-wrapper">
      <div class="lobby-wrapper">
        <!-- <div id="image">
      <img id="logo" src="..\assets\bugwars-logo.png" alt="" />
    </div> -->

        <div class="game-species">
          <div>
            <h2 id="title">BATTLEGROUND: </h2>
            <carousel-component id="carousel" :slides="slides"></carousel-component>
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
import SpeciesSelectorComponent from './SpeciesSelectorComponent.vue'
import StartButtonComponent from './StartButtonComponent.vue'
import CarouselComponent from './CarouselComponent.vue'
export default {
  components: {
    SpeciesSelectorComponent,
    StartButtonComponent,
    CarouselComponent
  },
  data() {
    return {
      slides: [
        'src/assets/maps/Screenshot 2024-03-29 183705.png',
        'src/assets/maps/Screenshot 2024-03-29 183720.png',
        'src/assets/maps/Screenshot 2024-03-29 183735.png',
        'src/assets/maps/Screenshot 2024-03-29 183748.jpg',
      ]
    }
  }
}
</script>

<style scoped>

.carousel{
  border: solid silver 3px;
}

#title{
  font-family: Orbitron;
  color: #53b290;
  font-weight: bold;

}

.lobby-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  
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
  box-shadow: 0 0 30px #53b290;

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
