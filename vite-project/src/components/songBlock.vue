<template>
    <div class="h-5/6 bg-blue-300 rounded m-1 p-1"
    :class="{'bg-blue-600': transportTime > block.playTime.start && transportTime < block.playTime.end}">
      <button @click="emit('removeChord', index)" class="w-5 h-5 p-0 flex place-content-center rounded-full">
        <p class="place-self-center">✖</p>
      </button>
      <select v-model="block.label" @change="block.notes = possibleChords[$event.target.value]">
        <option 
        v-for="option in Object.keys(possibleChords)">
          {{ option }}
        </option>
      </select>
      <input v-model="block.lyrics">
    </div>
</template>
<script setup>
import useTransportTime from '../composables/useTransportTime';
import { defineEmits } from 'vue';

const props = defineProps({
    block: Object,
    index: Number,
    transportTime: Number,
    possibleChords: Object
})

const emit = defineEmits(["removeChord"])

const transportTime = useTransportTime()
</script>