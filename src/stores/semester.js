import { defineStore } from "pinia"
import { semesterApi } from "@/api/restApi"
import { ref } from "vue"
import { useUiStore } from "./ui"


export const useSemesterStore = defineStore('semester', () => {
    const uiStore = useUiStore()
    
    const semesters = ref([])
    const currentSemester = ref(null)
    const semester = ref(null)

    const fetchSemesters = async (clubId) => {
        console.log('semester.js - fetchSemesters')
        uiStore.isLoading = true
        semesters.value = []
        currentSemester.value = null
        try {
            const response = await semesterApi.getSemesters(clubId)
            console.log('response', response)
            semesters.value = response.data
            currentSemester.value = response.data.find(s => s.isCurrent)
        } catch (error) {
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }

    const fetchSemester = async (semesterId) => {
        console.log('semester.js - fetchSemester')
        uiStore.isLoading = true
        semester.value = null
        try {
            const response = semesterApi.getSemester(semesterId)
            console.log('response', response)
            semester.value = response.data
        } catch (error) {
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }

    return {
        semesters, currentSemester, semester,
        fetchSemesters, fetchSemester
    }
})