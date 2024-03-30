<template>
  <!-- Add logo -->

  <div id="script-editor-window">
    <script-editor-component />
  </div>
</template>

<script>
import ScriptEditorComponent from '../components/ScriptEditorComponent.vue'

export default {
  components: { ScriptEditorComponent }
}
</script>

<style scoped>
#logo {
  display: flex;
  justify-content: center;
}

#script-editor-window {
  height: 100%;
}
</style>
