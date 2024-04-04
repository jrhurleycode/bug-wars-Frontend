<template>
  <!-- Needs Logo -->
  <Transition appear>
    <div id="script-editor-title-container">
      <div id="title-div">
        <h1 id="title">SCRIPT EDITOR</h1>
      </div>

      <!-- <div class="card flex justify-content-center">
        <Dropdown
          v-model="selectedScript"
          :options="scriptList"
          optionLabel="name"
          placeholder="Select a Script"
          class="w-full md:w-14rem"
        />
      </div> -->

      <!-- Adjust box to be display:grid and map out elements inside. -->
      <div id="script-editor-div">
        <div id="script-editor-box">
          <div id="name-input-div">
            <input id="name-input-field" placeholder="script-name" v-model="scriptName" />
          </div>

          <div id="script-input-box">
            <div ref="editor" id="script-input"></div>
          </div>

          <div id="generate-button-div">
            <button id="generate-button" @click="updateScript">UPDATE</button>
          </div>

          <div id="save-button-div">
            <button
              id="save-button"
              :class="{ enabled: validatedScript, disabled: !validatedScript }"
              :disabled="isSaveButtonDisabled"
              @click="saveScript"
              v-tooltip.top="tooltipText"
            >
              SAVE
            </button>
          </div>

          <div id="script-name-display">{{ script.name }}</div>

          <div id="output-label">OUTPUT :</div>

          <div id="output-box">{{ bytecode }}</div>
        </div>
        <Toast />
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

export default {
  components: { Toast },
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
      scriptList: []
    }
  },
  mounted() {
    const scriptStore = useScriptStore()
    const authStore = useAuthStore()
    this.user = authStore.user

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
      if (this.scriptName === '') {
        this.$toast.add({
          severity: 'error',
          summary: 'No script name provided.',
          detail: 'Please provide a name for your script.',
          life: 3000
        })
      } else {
        this.script.name = this.scriptName
      }
    },
    updateRawScript() {
      // Get the document content
      const docContent = this.editor.state.doc.toString()
      // Update script.rawScript with the document content
      this.script.raw = docContent
      console.log('Raw Script: ' + this.script.raw)
    },
    updateScript() {
      this.confirmName()
      this.updateRawScript()
      this.validatedScript = true
    },
    saveScript() {
      scriptService
        .createScript(this.user, this.script)
        .then((response) => {
          const script = response.data
          this.handleSuccessResponse(response, script)
        })
        .catch((error) => {
          this.handleError(error)
        })
      this.validatedScript = false
    },
    handleSuccessResponse(response, script) {
      if (response.status === 409) {
        this.bytecode =
          'Script name exists already. Please choose a different name for your script.'
      } else if (response.status === 201) {
        this.bytecode = script.bytecode
        this.$toast.add({
          severity: 'success',
          summary: 'Script created',
          detail: 'Script created.',
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
        }
      }
      this.bytecode = errorMessage
    }
  },
  computed: {
    tooltipText() {
      return this.validatedScript ? '' : 'Please press UPDATE before saving a new script.'
    },
    isSaveButtonDisabled() {
      return !this.validatedScript
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
  width: 450px;
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
    '. name confirm .'
    '. script-input script-input .'
    '. gen save .'
    '. output-label name-display .'
    '. script-output script-output .'
    '. . . .';
}

#name-input-div {
  grid-area: name;
  align-items: flex-end;
}

#name-input-field {
  border: solid #53b290 1px;
  text-align: center;
  border-radius: 5px;
  width: 130px;
  height: 30px;
  margin-bottom: 5px;
  font-family: Orbitron;
  background-color: #0a111c;
}

#confirm-button-div {
  grid-area: confirm;
  align-items: flex-end;
  justify-content: end;
}

button {
  cursor: pointer;
}

button:active {
  transform: translateY(4px);
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
  border-left: solid #53b290 3px;
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
  grid-area: gen;
}

#generate-button {
  background: #e55300;
  border: #e55300;
  font-family: Michroma;
  width: 130px;
  height: 30px;
  margin-top: 5px;
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

#script-name-display {
  grid-area: name-display;
  text-align: center;
  color: #e55300;
  font-size: 15px;
  font-family: Orbitron;
  font-weight: 400;
  align-items: flex-end;
  /* word-wrap: break-word; */
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
