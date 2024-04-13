<template>
  <Transition appear>
    <div id="HTP-container" :style="{ height: HTPContainerHeight + 'px' }">
      <div class="text-container">
        <Accordion :multiple="true" :activeIndex="[0]">
          <AccordionTab header="OBJECTIVE">
            <div class="objective-container">
              <div class="title" id="objective-title">OBJECTIVE</div>
              <div class="text">
                Bug wars is a <span class="high-light">Battle Royale</span> where players create a
                command script for their bug to be pitted against other bugs. In an effort to be the
                last species standing, bugs will attack one another,
                <span class="high-light"> food and each other</span>, to increase their numbers and
                take over the battleground before the turn counter expires. The species with the
                most specimens when time runs out <span class="high-light">wins!</span>
              </div>
            </div>
          </AccordionTab>

          <AccordionTab header="BATTLEFIELD">
            <div class="battlefield-container">
              <div class="title">BATTLEFIELD</div>
              <div class="text">
                Each <span class="high-light">BATTLEFIELD</span> is a different environment and thus
                provide your species with a unique challenge. Species scripts that work for one
                battleground will have a different result in a different environment.
                <br /><br />All battlefields are comprise of these four elements: <br /><br /><span
                  class="high-light"
                  >OPEN SPACE</span
                >
                - These spaces are unoccupied and a bug can move freely through this environment.
                Attack and Eat commands are ineffective on these squares. <br /><br /><span
                  class="high-light"
                  >BUGS -</span
                >
                Like your unique species, opponent bugs are programmed according to premade scripts
                allowing for unique behavior. Each bug’s main objective is to attack opposing bugs
                and reproduce itself to victory. <br /><br /><span class="high-light">WALLS -</span>
                Physical barriers found throughout the battle field that obstruct your bug’s
                movement towards food and other bugs. Attack, Eat and Move commands will have no
                effect on these spaces and will result in a spent turn. <br /><br /><span
                  class="high-light"
                  >FOOD -</span
                >
                Food is also located throughout the battlefield and provides your bugs with the
                opportunity to increase their numbers. Executing the EAT command on a food element
                will spawn +1 bugs to your species. Bugs attacked using the ATTACK command will
                consequently become food and can then be eaten to generate more of your bug’s
                species.
              </div>
            </div>
          </AccordionTab>

          <AccordionTab header="SCRIPT EDITOR">
            <div class="script-editor-container">
              <div class="title">SCRIPT EDITOR</div>
              <div class="text">
                The <span class="high-light">SCRIPT EDITOR</span> functions as a compiler for
                user-input code, converting commands into bytecode values to be interpreted by your
                bug species. User input is entered into the upper half green section of the script
                editor. Once ready to be compiled, press the
                <span id="generate">GENERATE</span> button to convert into bytecode. Scripts can be
                uniquely named and using the <span id="confirm">CONFIRM</span> button. Scripts may
                also be saved by pressing the <span id="save">SAVE</span> button after the command
                list has been processed. These scripts can be saved as is or later modified for use
                in future battles through the species selector.
              </div>
            </div>
          </AccordionTab>

          <AccordionTab header="SPECIES SCRIPTS">
            <div class="species-script-container">
              <div class="title">SPECIES SCRIPTS</div>
              <div class="text">
                Scripts are how you code your species’ unique behavior. Generating your species
                script will make use of the following elements: <br /><br /><span class="high-light"
                  >COMMENTS</span
                >
                are lines prefixed with an omission symbol (#) and will not be converted into
                bytecode when the script is generated. Comments will not be executed by your
                species’ script.
                <br /><br /><span class="high-light">LABELS</span> such as EAT or ATTACK will act as
                markers for your script to jump to when executing a CONTROL STATEMENT. LABELS are
                made distinguishable using numbers, capital letters, and underscoring.
                <br /><br /><span class="high-light">ACTION STATEMENTS</span> are moves executed
                when a bug encounters food, enemy, wall, or an open space. When the specific element
                is encountered according to your action statement, the script will jump to it’s
                respective label and execute the presented code. <br /><br /><span
                  class="high-light"
                  >CONTROL STATEMENTS</span
                >
                use a LABEL to determine where to go next in your species’ script and are
                conditionally executed based on their purpose and context.
              </div>
            </div>
          </AccordionTab>
        </Accordion>
      </div>

      <button v-if="tokenExists" id="lobby-button" @click="backToLobby">BACK TO LOBBY</button>
    </div>
  </Transition>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  data() {
    return {
      HTPContainerHeight: 0,
      hasToken: true
    }
  },
  methods: {
    backToLobby() {
      this.$router.push({
        path: '/lobby'
      })
    },
    calculateHTPContainerHeight() {
      const htpContainer = document.querySelector('#HTP-container')
      if (htpContainer) {
        this.HTPContainerHeight = htpContainer.scrollHeight
      }
    }
  },
  computed: {
    tokenExists() {
      const authStore = useAuthStore()
      return authStore.$state.user.accessToken !== ''
    }
  },
  mounted() {
    // Recalculate height when component is mounted
    this.calculateHTPContainerHeight()
  },
  updated() {
    // Recalculate height when component is updated (e.g., when accordion tabs are expanded/collapsed)
    this.calculateHTPContainerHeight()
  }
}
</script>

<style scoped>
.high-light {
  color: #1ded0b;
}

#generate {
  color: orange;
}

#confirm {
  color: green;
}

#save {
  color: gold;
}

#lobby-button {
  border: #e55300;
  width: 700px;
  height: 100px;
  margin: 20px;
  background-color: #e55300;
  border-radius: 10px;
  font-size: 40px;
  font-family: Michroma;
  color: black;
  font-weight: 400;
  word-wrap: break-word;
}

#lobby-button:hover {
  background-color: goldenrod;
}

.title {
  text-align: center;
  color: #e55300;
  font-size: 16px;
  font-family: Michroma;
  font-weight: 400;
  word-wrap: break-word;
}

.text {
  color: white;
  font-size: 16px;
  font-family: Michroma;
  font-weight: 400;
  word-wrap: break-word;
  width: 825px;
  height: auto;
  text-align: justify;
  text-justify: inter-word;
}

.text-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 1050px;
  height: 1400px;
  /* border: solid red 3px; */
  margin-top: 50px;
  align-content: center;
}

#HTP-container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 1150px;
  min-height: 1900px;
  margin-top: 20px;
  background: rgba(10, 17, 28, 0.6);
  border-radius: 30px;
  align-items: center;
  gap: 50px;
  box-shadow: 0 0 8px #53b290;
}

#objective-title {
  padding-top: 40px;
}

.objective-container {
  display: flex;
  justify-content: space-between;
  /* border: solid blue 3px; */
}

.battlefield-container {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  /* border: solid red 3px; */
}

.script-editor-container {
  display: flex;
  justify-content: space-between;
  /* border: solid green 3px; */
}

.species-script-container {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  /* border: solid yellow 3px; */
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
