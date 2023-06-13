

<template>
  <div id="arrangement_area" class="bg-gray-300 h-20 flex flex-row">
    <div v-for="(chord, i) in progression">
      <select v-model="progression[i]">
        <option v-for="option in Object.keys(possibleChords)">
          {{ option }}
  </option></select>
    </div>
    <button @click="addChord">+</button>
  </div>
  <button @click="play">TEST PLAY</button>
</template>

<script setup>
import { ref, computed } from 'vue'
import * as Tone from 'tone'

const synth = new Tone.PolySynth(Tone.Synth).toDestination();

let started = false;

//play a middle 'C' for the duration of an 8th note
function play() {
  if(!started){
    Tone.start();
    started = true
  }

  Tone.Transport.start(Tone.now());
  
  Tone.Transport.schedule((time) => {
	  for(let i = 0; i < progression.value.length; i++) {
      let chord = progression.value[i];
      synth.triggerAttackRelease(possibleChords.value[chord], "1m", Tone.now() + Tone.Transport.toSeconds(i+"m"))
    }
	  console.log("measure 16!");
    Tone.Transport.stop();
  }, Tone.now());
}

function addChord() {
  progression.value.push("C")

}

const progression = ref([])
const possibleChords = ref({
  C: ["C4", "E4", "G4"], 
  D: ["D4", "F#4", "A4"],
  Dm: ["D4", "F4", "A4"],
  E: ["E4", "G#4", "B4"],
  Em: ["E4", "G4", "B4"],
  F: ["F4", "A4", "C4"],
  G: ["G4", "B4", "D4"],
})

const count = ref(0)
</script>