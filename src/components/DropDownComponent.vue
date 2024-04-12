<template>
  <div class="menu-button" @click="selectScript">
    <div id="icon-script" href="#" v-if="!isOpen">
      <fa-fa id="caret" icon="caret-down" v-if="!selected"> </fa-fa>
      {{ selected }}
    </div>

    <div class="sub-menu" v-if="isOpen">
      <div v-for="(item, i) in items" :key="i" class="menu-item" @click="selectOption($event)">
        <a>{{ item.title }} </a>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown'
export default {
  name: Dropdown,
  props: ['title', 'items'],
  data() {
    return {
      isOpen: false,
      selected: ''
    }
  },
  methods: {
    selectScript() {
      this.isOpen = !this.isOpen
    },
    selectOption(event) {
      this.selected = event.target.innerText
      const choice = this.selected
      if (choice == '...') {
        this.selected = ''
      }
    }
  }
}
</script>

<style scoped>
.sub-menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 500px;
}
.menu-button {
  background: rgba(60, 131, 141, 0.75);
  border-radius: 5px;
  border-width: 1px;
  height: 100%;
  width: 300px;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  border: solid white 1px;

  /* border: solid red 3px; */
}

#icon-script {
  font-family: 'Michroma', sans-serif;
}

.menu-button:hover {
  
  background-color: rgb(66, 189, 193);
}

.menu-item {
  display: flex;
  justify-content: center;
  position: relative;

  background: rgba(60, 131, 141, 0.75);
  font-family: 'Michroma', sans-serif;
}

.menu-item:hover {
  background-color: rgb(66, 189, 193);
}

a {
  text-decoration: none;
  font-weight: 200;
  color: white;
  width: 100%;
  display: flex;
  justify-content: center;
}

a:hover {
  font-weight: 900;
}

#caret {
  color: rgb(179, 179, 179);
}
</style>
