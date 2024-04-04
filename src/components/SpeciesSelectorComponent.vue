<template>
  <!-- Species Selector Element -->
  <div class="species-selector">
    <!-- Title -->

    <!-- Button Container -->

    <div id="button-container">
      <div id="drop-down">
        <h3>SCRIPT: 1</h3>
        <drop-down-component :items="scripts" />
      </div>
      <div id="drop-down">
        <h3>SCRIPT: 2</h3>
        <drop-down-component :items="scripts" />
      </div>
      <div id="drop-down">
        <h3>SCRIPT: 3</h3>
        <drop-down-component :items="scripts" />
      </div>
      <div id="drop-down">
        <h3>SCRIPT: 4</h3>
        <drop-down-component :items="scripts" />
      </div>
    </div>
  </div>
</template>

<script>
import DropDownComponent from './DropDownComponent.vue'
export default {
  components: { DropDownComponent },
  data() {
    return {
      scripts: [
        {
          title: '...'
        },
        {
          title: 'SCRIPT '
        },
        {
          title: 'SCRIPT'
        },
        {
          title: 'SCRIPT'
        },
        {
          title: 'SCRIPT'
        }
      ]
    }
  }
}
</script>

<style scoped>
#drop-down {
  display: flex;
  flex-direction: column;
  font-family: 'Michroma', sans-serif;
  justify-content: center;
  height: 60px;
  
}

#button-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 100px;
  justify-content: center;
}

#header {
  display: flex;
  color: #53b290;
  font-size: 12px;
  width: 100%;
  justify-content: center;
  font-family: 'Michroma', sans-serif;
}

h3 {
  height: 30px;
  margin: 0;
}

.button-div {
  width: 100%;
  height: 31px;
  display: flex;
  justify-content: center;
}
</style>
