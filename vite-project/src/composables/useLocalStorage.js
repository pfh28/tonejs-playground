import { ref, watch } from 'vue'

export default function (key, defaultValue) {
    const value = localStorage.getItem(key)
    const rv = ref(value ? JSON.parse(value) : defaultValue)

    watch(rv, (val)=> {
        localStorage.setItem(key, JSON.stringify(val))
    },
    { deep: true })

    return rv;
}