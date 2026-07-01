import { defineStore } from "pinia"
import { scheduleApi } from "@/api/restApi"
import { ref } from "vue"

export const useScheduleStore = defineStore('schedule', () => {
    const schedules = ref([])

    return {
        schedules
    }
})