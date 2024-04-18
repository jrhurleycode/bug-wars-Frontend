<script>
import { EditorState } from '@codemirror/state'
import { basicSetup, EditorView } from 'codemirror'
import { autocompletion } from '@codemirror/autocomplete'
import { useScriptStore } from '@/stores/ScriptStore'
import scriptService from '@/services/ScriptService'
import { useAuthStore } from '@/stores/auth'
import Toast from 'primevue/toast'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import ConfirmPopup from 'primevue/confirmpopup'

export default {
  components: { Toast, Dropdown, InputText, ConfirmPopup },
  data() {
    return {
      user: {},
      scriptName: '',
      validatedScript: false,
      bytecode: '',
      script: {
        name: '',
        raw: ''
      },
      editor: null,
      scriptList: [],
      selectedScript: ''
    }
  },
  mounted() {
    const scriptStore = useScriptStore()
    const authStore = useAuthStore()
    this.user = authStore.user
    this.getUserScripts()

    function myCompletions(context) {
      let before = context.matchBefore(/\w+/)
      if (!context.explicit && !before) return null
      return {
        from: before ? before.from : context.pos,
        options: [
          ...scriptStore.commands.map((cmd) => ({ label: cmd.label, type: 'keyword' })),
          ...scriptStore.actions.map((act) => ({ label: act.label, type: 'keyword' }))
        ],
        validFor: /^\w*$/
      }
    }

    this.editor = new EditorView({
      state: EditorState.create({
        doc: '                                            ',
        extensions: [basicSetup, autocompletion({ override: [myCompletions] })]
      }),
      parent: this.$refs.editor
    })
  },
  methods: {
    getUserScripts() {
      scriptService.getUserScripts(this.user).then((response) => {
        this.scriptList = response.data
      })
    },
    confirmName() {
      if (this.selectedScript && this.selectedScript.name === 'Create new script') {
        if (this.scriptName === '') {
          this.$toast.add({
            severity: 'error',
            summary: 'No script name provided.',
            detail: 'Please provide a name for your script.',
            life: 3000
          })
        } else {
          this.script.name = this.scriptName // Update script name with input field value
        }
      } else if (this.selectedScript) {
        this.script.name = this.selectedScript.name // Update script name with selected script's name
      }
    },

    updateRawScript() {
      const docContent = this.editor.state.doc.toString()
      this.script.raw = docContent
    },
    confirmScript() {
      this.confirmName()
      this.updateRawScript()
      this.validatedScript = true
    },
    createScript(event) {
      this.$confirm.require({
        target: event.currentTarget,
        message: 'Are you sure you want to create this script?',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-sm',
        rejectLabel: 'Cancel',
        acceptLabel: 'Create',
        accept: () => {
          if (this.selectedScript !== null) {
            scriptService
              .createScript(this.user, this.script)
              .then((response) => {
                const script = response.data
                this.handleSuccessResponse(response, script)
                this.getUserScripts()
              })
              .catch((error) => {
                this.handleError(error)
              })
            this.scriptName = ''
            this.validatedScript = false
          } else {
            this.$toast.add({
              severity: 'error',
              summary: 'No script found',
              detail: 'Please create or select a script.',
              life: 3000
            })
          }
        },
        reject: () => {
          this.$toast.add({
            severity: 'error',
            summary: 'Rejected',
            detail: 'You have rejected',
            life: 3000
          })
        }
      })
    },
    updateScript(event) {
      this.$confirm.require({
        target: event.currentTarget,
        message: 'Are you sure you want to update this script?',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-sm',
        rejectLabel: 'Cancel',
        acceptLabel: 'Update',
        accept: () => {
          if (this.selectedScript.id) {
            scriptService
              .updateScript(this.selectedScript.id, this.script, this.user)
              .then((response) => {
                const scriptResponse = response.data
                this.handleSuccessResponse(response, scriptResponse)
                this.getUserScripts()
              })
              .catch((error) => {
                this.handleError(error)
              })
          } else {
            this.$toast.add({
              severity: 'error',
              summary: 'No script selected',
              detail: 'Please select a script.',
              life: 3000
            })
          }
        },
        reject: () => {
          this.$toast.add({
            severity: 'error',
            summary: 'Rejected',
            detail: 'You have rejected',
            life: 3000
          })
        }
      })
    },
    deleteScript(event) {
      this.$confirm.require({
        target: event.currentTarget,
        message: 'Do you want to delete this script?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        accept: () => {
          if (this.selectedScript.id) {
            scriptService
              .deleteScript(this.selectedScript.id, this.user)
              .then((response) => {
                const scriptResponse = response.data
                this.handleSuccessResponse(response, scriptResponse)
                this.getUserScripts()
              })
              .catch((error) => {
                this.handleError(error)
              })
          } else {
            this.$toast.add({
              severity: 'error',
              summary: 'No script selected',
              detail: 'Please select a script.',
              life: 3000
            })
          }
        },
        reject: () => {
          this.$toast.add({
            severity: 'error',
            summary: 'Rejected',
            detail: 'You have rejected',
            life: 3000
          })
        }
      })
    },
    handleSuccessResponse(response, script) {
      if (response.status === 201) {
        this.bytecode = script.bytecode
        this.$toast.add({
          severity: 'success',
          summary: 'Script created',
          detail: 'Script created.',
          life: 3000
        })
      } else if (response.status === 200) {
        this.bytecode = script.bytecode
        this.$toast.add({
          severity: 'success',
          summary: 'Script updated',
          detail: 'Script updated.',
          life: 3000
        })
      } else if (response.status === 204) {
        this.bytecode = script.bytecode
        this.$toast.add({
          severity: 'error',
          summary: 'Script deleted',
          detail: 'Script deleted.',
          life: 3000
        })
      } else {
        this.handleError(response)
      }
    },
    handleError(error) {
      let errorMessage = 'Something happened on our side. Please try again'
      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = 'Error creating script. Please review your script and try again.'
        } else if (error.response.status === 409) {
          errorMessage =
            'Script name exists already. Please choose a different name for your script.'
        } else if (error.response.status === 403) {
          errorMessage =
            'Unable to delete this script. You must be the owner of this script to delete it'
        }
      }
      this.bytecode = errorMessage
    },
    handleDropdownChange() {
      if (this.selectedScript && this.selectedScript.name === 'Create new script') {
        this.script.name = '' // Clear the script name input field
      }
    },
    handleSave(event) {
      if (this.selectedScript.name === 'Create new script' && this.scriptName.trim() !== '') {
        this.createScript(event)
      } else {
        this.updateScript(event)
      }
    }
  },
  computed: {
    tooltipText() {
      return this.validatedScript ? '' : 'Please press UPDATE before saving a new script.'
    },
    isUpdateButtonDisabled() {
      return !this.validatedScript
    },
    isNewScriptSelected() {
      return this.selectedScript && this.selectedScript.name === 'Create new script'
    },
    dropdownOptions() {
      // Add a placeholder option for creating a new script
      return [{ name: 'Create new script' }, ...this.scriptList]
    },
    updateButtonText() {
      if (this.selectedScript && this.selectedScript.name === 'Create new script') {
        return 'CREATE'
      } else {
        return 'UPDATE'
      }
    }
  },
  watch: {
    selectedScript(newScript) {
      if (newScript) {
        this.script.name = newScript.name
        // Update the CodeMirror editor with the raw script content
        this.editor.dispatch({
          changes: { from: 0, to: this.editor.state.doc.length, insert: newScript.raw }
        })
      }
    }
  }
}
</script>
<template>
  <!-- Needs Logo -->

  <Transition appear>
    <div id="script-editor-title-container">
      <div id="title-div">
        <h1 id="title">SCRIPT EDITOR</h1>
      </div>

      <!-- Adjust box to be display:grid and map out elements inside. -->

      <div class="editor-wrapper">
        <div id="script-editor-box">
          <div id="dropdown-name-input">
            <Dropdown
              id="dropdown"
              v-model="selectedScript"
              :options="dropdownOptions"
              optionLabel="name"
              placeholder="Select a Script"
              class="w-full md:w-14rem"
            />

            <InputText
              :disabled="!isNewScriptSelected"
              id="name-input"
              v-model="scriptName"
              placeholder="Enter script name"
            />
          </div>

          <div id="script-input-box">
            <div ref="editor" id="script-input"></div>
          </div>

          <Toast id="toast" />

          <ConfirmPopup />

          <div class="buttons-div">
            <div id="confirm-update-div">
              <button id="confirm-button" @click="confirmScript">CONFIRM</button>
              <button
                id="update-button"
                :class="{ enabled: validatedScript, disabled: !validatedScript }"
                :disabled="isUpdateButtonDisabled"
                @click="handleSave($event)"
                v-tooltip.top="tooltipText"
              >
                {{ updateButtonText }}
              </button>
            </div>

            <button id="delete-button" @click="deleteScript($event)">DELETE</button>
          </div>

          <!-- <div id="script-name-display">{{ script.name }}</div> -->

          <div id="output-label">OUTPUT :</div>

          <div id="output-box">{{ bytecode }}</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
#name-input{
  border: solid #53b290 2px;
  font-family: orbitron;
}

.buttons-div {
  margin-top: 10px;
}

.editor-wrapper {
  margin-right: 200px;
}

#delete-button {
  margin-right: 10px;
}

#output-label {
  margin-left: 10px;

  color: white;
  font-size: 16px;
  font-family: Michroma;
  font-weight: 400;
  /* word-wrap: break-word; */
  height: 30px;
  width: 100%;
}

.editor-wrapper {
  display: flex;
  justify-content: start;
}

#confirm-update-div {
  width: 100%;
  gap: 10px;
  margin-left: 10px;
}

#dropdown-name-input {
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 10px;
}

#script-editor-box {
  height: 800px;
  width: 600px;
  display: flex;
  flex-direction: column;
  background-color: #0a111c;
  border-radius: 30px;
  box-shadow: 0 0 20px #53b290;
}

#script-input {
  margin: 10px;
  background: #0a111c;
  height: 50px;
  grid-area: script-input;
  width: 100%;
  border-radius: 5px;
  font-family: Orbitron;
  color: #53b290;
  font-size: 15px;
  height: 500px;
  /* overflow-x: scroll; */
  /* max-height: 275px; */
}

button {
  border-radius: 5px;
}

div {
  display: flex;
  height: 100%;
  width: 100%;
}

#script-editor-title-container {
  margin-top: 30px;
  width: 100%;
  height: 100vh; /* Make the container full height of the viewport */
}

#title-div {
  display: flex;
  justify-content: end;
  margin: 0px;
  padding: 0;
  width: 75%;
}

#title {
  width: 600px;
  height: 70px;

  background: linear-gradient(to bottom, #f0f0f0, #070707f4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; /* Hide original text */

  font-size: 45px;
  font-family: Michroma;
  font-weight: bold;
  letter-spacing: 5.2px;
  /* border: solid purple 2px; */

  transform: rotate(-90deg);
  translate: 270px 200px;
}

#dropdown {
  text-align: center;
  width: 300px;
  height: 40px;
  font-family: Orbitron;
  background-color: #0a111c;
}

button {
  cursor: pointer;
}

#script-input::placeholder {
  color: #53b290;
}

#confirm-button,
#delete-button {
  background: #e55300;
  border: #e55300;
  font-family: Michroma;
  width: 130px;
  height: 30px;
  transition: background-color 0.3s ease-in-out;
}

#confirm-button:hover,
#delete-button:hover {
  background: #b23a00;
}

#delete-button {
  background: #ff0000;
  transition: background-color 0.3s ease-in-out;
}

#delete-button:hover {
  background: #cc0000;
}

#update-button {
  font-family: Michroma;
  width: 130px;
  height: 30px;
  transition: background-color 0.3s ease-in-out;
}

#update-button:hover {
  background: #b23a00;
}

.enabled {
  background: #e55300;
  border: #e55300;
}

.disabled {
  background: #9b9b9b;
  border: #9b9b9b;
}

#output-label {
}

#output-box {
  font-family: Orbitron;
  background: #0a111c;
  width: 95%;
  margin: 10px;

  justify-content: center;
  align-content: center;
  border-top: solid orange 3px;
  color: yellow;
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
