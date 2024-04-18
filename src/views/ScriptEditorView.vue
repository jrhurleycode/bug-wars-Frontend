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


#script-editor-window {
  height: 100%;
  width: 100%;
}
</style>
