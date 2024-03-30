<template>
  <transition :name="transitionEffect">
    <div class="carousel-item" v-show="currentSlide === index">
      <img :src="slide" />
    </div>
  </transition>
</template>

<script>
export default {
  props: ['slide', 'currentSlide', 'index', 'direction'],
  computed: {
    transitionEffect(){
        return this.direction === "right" ? "slide-out" : "slide-in";
    }
  }
}
</script>

<style>
.carousel-item {
  position: absolute;
}

.slide-in-enter-active,
.slide-in-leave-active,
.slide-out-enter-active,
.slide-out-leave-active {
  transition: all 1s ease-in-out;
}

.slide-in-enter-from {
  transform: translateX(-100%);
}

.slide-in-leave-to {
  transform: translateX(100%);
}

.slide-out-enter-from{
transform: translateX(100%);
}

.slide-out-leave-to{
transform: translateX(-100%);
}
</style>
