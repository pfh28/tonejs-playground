

<template>
  <div id="arrangement_area" class="bg-gray-300 flex flex-row">
    <div v-for="(block, i) in progression" class="h-5/6 bg-blue-300 rounded m-1 p-1"
    :class="{'bg-blue-600': transportTime > block.playTime.start && transportTime < block.playTime.end}">
      <button @click="removeChord(i)" class="w-5 h-5 p-0 flex place-content-center rounded-full">
        <p class="place-self-center">✖</p>
      </button>
      <select v-model="progression[i].label" @change="progression[i].notes = possibleChords[$event.target.value]">
        <option 
        v-for="option in Object.keys(possibleChords)">
          {{ option }}
        </option>
      </select>
      <input v-model="block.lyrics">
    </div>
    <button @click="addChord">+</button>
  </div>
  <song-block v-for="(block, i) in progression" 
  :block="block" 
  :index="i" 
  :possibleChords="possibleChords"
  @removeChord="removeChord"></song-block>
  <button @click="play">TEST PLAY</button>
  {{ transportTime }}
</template>

<script setup>
import { ref } from 'vue'
import useLocalStorage from '../composables/useLocalStorage'
import * as Tone from 'tone'
import songBlock from './songBlock.vue';
import useTransportTime from '../composables/useTransportTime';

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
  playTime:{start:0, end:0},
  lyrics: ""
  })
}

function removeChord(index) {
  console.log(index, "index")
  if(index > 0) {
    progression.value[index-1].lyrics = progression.value[index-1].lyrics + progression.value[index].lyrics
  } else if(index == 0 && progression.value.length > 1) {
    progression.value[1].lyrics  = progression.value[0].lyrics + progression.value[1].lyrics
  }
  progression.value.splice(index, 1)
}

const progression = useLocalStorage("tone-progression", [])

const transportTime = useTransportTime()

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