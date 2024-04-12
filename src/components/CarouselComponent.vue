<template>
  <div class="carousel">
    <div class="carousel-inner">
      <carousel-item-vue
        v-for="(slide, index) in slides"
        :slide="slide"
        :key="`item-${index}`"
        :currentSlide="currentSlide"
        :index="index"
        :direction="direction"
      ></carousel-item-vue>
      <carousel-controls-vue @prev="prev" @next="next"></carousel-controls-vue>
    </div>
  </div>
</template>

<script>
import CarouselControlsVue from './CarouselControls.vue'
import CarouselItemVue from './CarouselItem.vue'
export default {
  props: ['slides'],
  components: { CarouselItemVue, CarouselControlsVue },
  data() {
    return {
      currentSlide: 0,
      slideInterval: null,
      direction: "right"
    }
  },

  methods: {
    setCurrentSlide(index) {
      this.currentSlide = index;
    },
    prev(){
        const index = this.currentSlide > 0 ? this.currentSlide - 1 : this.slides.length -1;
      this.setCurrentSlide(index);
      this.direction = "left";
    },
    next(){
        const index = this.currentSlide < this.slides.length - 1 ? this.currentSlide + 1 : 0;
      this.setCurrentSlide(index);
      this.direction = "right"
    }
  },
  mounted() {
    // this.slideInterval = setInterval(() => {
    //   this.next();
    // }, 5000)
  },
  beforeUnmount() {
    clearInterval(this.slideInterval)
  }
}
</script>

<style scoped>
.carousel {
  display: flex;
  justify-content: center;
}

.carousel-inner {
  position: relative;
  width: 672px;
  height: 672px;
  overflow: hidden;
}
</style>
