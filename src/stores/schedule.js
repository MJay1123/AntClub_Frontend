import { defineStore } from "pinia"
import { scheduleApi } from "@/api/restApi"
import { ref } from "vue"
import { useUiStore } from "./ui"

const uiStore = useUiStore()

export const useScheduleStore = defineStore('schedule', () => {
    const schedules = ref([])
    const semesterSchedules = ref([])
    const schedule = ref(null)

    const fetchSchedules = async (clubId) => {
        console.log('schedule.js - fetchSchedules')
        uiStore.isLoading = true
        schedules.value = []
        try {
            const response = await scheduleApi.getSchedules(clubId)
            console.log('response', response)
            schedules.value = response.data
        } catch (error) {
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }

    const fetchSemesterSchedules = async (clubId, semesterId) => {
        console.log('schedule.js - fetchSemesterSchedules')
        uiStore.isLoading = true
        semesterSchedules.value = []
        try {
            const response = await scheduleApi.getSemesterSchedules(clubId, semesterId)
            console.log('response', response)
            semesterSchedules.value = response.data
        } catch (error) {
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }

    const fetchSchedule = async (scheduleId) => {
        console.log('schedule.js - fetchSchedule')
        uiStore.isLoading = true
        schedule.value = []
        try {
            const response = await scheduleApi.getSchedule(scheduleId)
            console.log('response', response)
            schedule.value = response.data
        } catch (error) {
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }

    return {
        schedules, semesterSchedules, schedule,
        fetchSchedules, fetchSemesterSchedules, fetchSchedule
    }
})