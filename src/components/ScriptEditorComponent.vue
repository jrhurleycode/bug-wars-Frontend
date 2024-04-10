<template>
  <!-- Needs Logo -->

  <Transition appear>
    <div id="script-editor-title-container">
      <div id="title-div">
        <h1 id="title">SCRIPT EDITOR</h1>
      </div>

      <!-- Adjust box to be display:grid and map out elements inside. -->
      <div id="script-editor-div">
        <div id="script-editor-box">
          <div class="card flex justify-content-center" id="name-input-div">
            <Dropdown
              id="name-input-field"
              v-model="selectedScript"
              :options="dropdownOptions"
              optionLabel="name"
              placeholder="Select a Script"
              class="w-full md:w-14rem"
            />
            <InputText
              :disabled="!isNewScriptSelected"
              id="input-script-name"
              v-model="scriptName"
              placeholder="Enter script name"
            />
          </div>

          <div id="script-input-box">
            <div ref="editor" id="script-input"></div>
          </div>

          <Toast />

          <div id="generate-button-div">
            <button id="generate-button" @click="confirmScript">CONFIRM</button>
          </div>

          <ConfirmPopup />
          <div id="save-button-div">
            <button
              id="save-button"
              :class="{ enabled: validatedScript, disabled: !validatedScript }"
              :disabled="isSaveButtonDisabled"
              @click="handleSave($event)"
              v-tooltip.top="tooltipText"
            >
              {{ saveButtonText }}
            </button>

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
            this.confirmSave(event)
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
    isSaveButtonDisabled() {
      return !this.validatedScript
    },
    isNewScriptSelected() {
      return this.selectedScript && this.selectedScript.name === 'Create new script'
    },
    dropdownOptions() {
      // Add a placeholder option for creating a new script
      return [{ name: 'Create new script' }, ...this.scriptList]
    },
    saveButtonText() {
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

<style scoped>
#logo {
  display: flex;
  justify-content: center;
  width: auto;
  height: auto;
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
  display: flex;
  justify-content: space-around; /* Center horizontally */
  align-items: center; /* Center vertically */
  height: 100vh; /* Make the container full height of the viewport */
}
#title-div {
  width: 64%;
  justify-content: flex-end;
  /* border: solid red 1px; */
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

#script-editor-box {
  width: 100%;
  height: 650px;
  background: #0a111c;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  box-shadow: 0 0 8px #53b290;
  display: grid;
  grid-template-columns: 0.5fr 3fr 8fr 0.5fr;
  grid-template-rows: 0.5fr 1fr 8fr 1fr 1fr 8fr 0.5fr;
  grid-template-areas:
    '. . . .'
    'name . . input'
    'script-input script-input script-input script-input'
    'generate . save delete'
    'output-label . . .'
    'script-output script-output script-output script-output'
    '. . . .';
}

#name-input-div {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

#name-input-field {
  grid-area: name;
  border: solid #53b290 1px;
  text-align: center;
  border-radius: 5px;
  width: 300px;
  height: 40px;
  margin-bottom: 5px;
  font-family: Orbitron;
  background-color: #0a111c;
}

#input-script-name {
  grid-area: input;
}

#confirm-button-div {
  grid-area: confirm;
  align-items: flex-end;
  justify-content: end;
}

button {
  cursor: pointer;
}

#confirm-button {
  align-content: center;
  justify-content: center;
  width: 130px;
  height: 30px;
  font-family: Michroma;
  background: #53b290;
  border: 1px solid #3a7e66;

  margin-bottom: 5px;
}

#script-input-box {
  grid-area: script-input;
  background: #0a111c;
  border: none;
  flex-direction: column;
  margin-top: 5px;
  height: 95%;
  padding-left: 5px;
}

#script-input {
  width: 100%;
  border: none;
  border-radius: 5px;
  background: #f0f9f0;
  font-family: Orbitron;
  color: #53b290;
  font-size: 15px;
  overflow-x: scroll;
  max-height: 275px;
  min-width: 100%;
}

#script-input::placeholder {
  color: #53b290;
}

#generate-button-div {
  grid-area: generate;
}

#generate-button,
#delete-button {
  background: #e55300;
  border: #e55300;
  font-family: Michroma;
  width: 130px;
  height: 30px;
  margin-top: 5px;
}

#delete-button {
  margin-left: 20px;
  grid-area: generate;
}

#save-button-div {
  grid-area: save;
  justify-content: end;
}

#save-button {
  font-family: Michroma;
  width: 130px;
  height: 30px;
  margin-top: 5px;
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
  grid-area: output-label;
  text-align: center;
  color: white;
  font-size: 16px;
  font-family: Michroma;
  font-weight: 400;
  /* word-wrap: break-word; */
  align-items: flex-end;
  padding-right: 10px;
  width: auto;
}

#output-box {
  grid-area: script-output;
  font-family: Orbitron;
  margin-top: 5px;
  color: yellow;
  background: #0a111c;
  border-top: solid #e55300 3px;
  font-size: 15px;
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
