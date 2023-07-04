

<template>
  <div id="arrangement_area" class="bg-gray-300 h-20 flex flex-row">
    <div v-for="(chord, i) in progression" class="h-5/6 bg-blue-300 rounded m-1 p-1"
    :class="{'bg-blue-600': transportTime > chord.playTime.start && transportTime < chord.playTime.end}">
      <select v-model="progression[i].label" @change="progression[i].notes = possibleChords[$event.target.value]">
        <option 
        v-for="option in Object.keys(possibleChords)">
          {{ option }}
  </option></select>
    </div>
    <button @click="addChord">+</button>
  </div>
  <button @click="play">TEST PLAY</button>
  {{ transportTime }}
</template>

<script setup>
import { ref } from 'vue'
import useLocalStorage from '../composables/useLocalStorage'
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
      progression.value[i].playTime.start = Tone.now() + Tone.Transport.toSeconds(i+"m")
      progression.value[i].playTime.end = progression.value[i].playTime.start + Tone.Transport.toSeconds("1m")
      
      let chord = progression.value[i].notes;
      synth.triggerAttackRelease(
        chord,
        "1m", 
        Tone.now() + Tone.Transport.toSeconds(i+"m"))
    }
    Tone.Transport.stop();
  }, Tone.now());
}

function addChord() {
  progression.value.push({label: "C", 
  notes: possibleChords.value["C"], 
  playTime:{start:0, end:0}})
}

const progression = useLocalStorage("tone-progression", [])

const transportTime = ref(0)

setInterval(() => {
	transportTime.value = Tone.now();
}, 100);

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