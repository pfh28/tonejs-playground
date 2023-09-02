import { ref, watch } from 'vue'
import * as Tone from 'tone'

const transportTime = ref(-1)

export default function () {
    if(transportTime.value < 0) {
        transportTime.value = 0
        setInterval(() => {
            transportTime.value = Tone.now();
        }, 100);
    }

    return transportTime;
}